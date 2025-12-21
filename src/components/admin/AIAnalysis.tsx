"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { University } from "@/lib/types";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  universityName: string;
  analysis: string;
}

function AnalysisModal({
  isOpen,
  onClose,
  universityName,
  analysis,
}: AnalysisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden border-2 border-[#0047AB]/30">
        <div className="bg-gradient-to-r from-[#000080] to-[#0047AB] p-6 text-white">
          <h2 className="text-2xl font-bold">AI Analysis & Recommendations</h2>
          <p className="text-blue-100 mt-1">{universityName}</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-160px)]">
          <div className="prose prose-lg max-w-none text-gray-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white rounded-lg hover:from-[#0099ED] hover:to-[#0047AB] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface AIAnalysisProps {
  rankings: University[];
}

export default function AIAnalysis({ rankings }: AIAnalysisProps) {
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [error, setError] = useState("");

  // Get selected university data
  const selectedUni = rankings.find((u) => u.id === selectedUniversity);

  const handleAnalyze = async () => {
    if (!selectedUniversity) {
      setError("Please select a university");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/admin/analyze-university", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          universityId: selectedUniversity,
          name: selectedUni?.name,
          trustScore: selectedUni?.trustScore,
          metrics: selectedUni?.metrics,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze university");
      }

      setAnalysis(data.analysis);
      setUniversityName(data.universityName);
      setShowModal(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      // Check if it's the "service unavailable" error from disabled AI feature
      if (
        errorMessage.includes("unavailable") ||
        errorMessage.includes("503")
      ) {
        setError(
          "AI analysis feature is currently unavailable. This feature requires Gemini AI integration."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white border-2 border-[#0047AB]/20 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-[#000080]">
        AI-Powered Analysis & Recommendations
      </h2>

      {/* Feature Status Banner */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Feature Currently Unavailable:</strong> AI analysis
          requires Gemini AI API integration. This feature is temporarily
          disabled.
        </p>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Select a university to view metrics and get AI-powered insights using
        Gemini AI
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select University
          </label>
          <select
            value={selectedUniversity}
            onChange={(e) => {
              setSelectedUniversity(e.target.value);
              setError("");
            }}
            className="w-full p-2 border-2 border-[#0047AB]/30 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
            disabled={isAnalyzing}
          >
            <option value="">Choose a university...</option>
            {rankings.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display metrics when university is selected */}
        {selectedUni && (
          <div className="bg-gradient-to-r from-[#f0f4ff] to-white border-2 border-[#0047AB]/30 rounded-lg p-6 text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Trust Score</h3>
            <p className="text-5xl font-bold text-[#0047AB] mb-1">{selectedUni.trustScore}</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !selectedUniversity}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white rounded-lg font-medium hover:from-[#0099ED] hover:to-[#0047AB] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing with AI...
            </span>
          ) : (
            "Analyze & Get Recommendations"
          )}
        </button>
      </div>

      <AnalysisModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        universityName={universityName}
        analysis={analysis}
      />
    </div>
  );
}
