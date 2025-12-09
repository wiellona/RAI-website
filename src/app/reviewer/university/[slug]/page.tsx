"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { University } from "@/lib/types";
import * as api from "@/lib/api";
import ReviewerGuard from "@/components/auth/ReviewerGuard";

interface UniversityDetailProps {
  params: {
    slug: string;
  };
}

function UniversityDetailPage({ params }: UniversityDetailProps) {
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUniversity() {
      setIsLoading(true);
      const data = await api.fetchUniversityBySlug(params.slug);
      setUniversity(data);
      setIsLoading(false);
    }
    loadUniversity();
  }, [params.slug]);

  const downloadCSV = <T extends Record<string, unknown>>(data: T[], filename: string) => {
    if (!data || data.length === 0) {
      alert("No data available to download");
      return;
    }

    // Convert JSON to CSV
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = ('' + value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadAnswers = async () => {
    if (!university) return;
    
    setIsProcessing(true);
    const data = await api.getAnswersData(university.id);
    downloadCSV(data, `${university.slug}-answers-data.csv`);
    setIsProcessing(false);
  };

  const handleDownloadCrawling = async () => {
    if (!university) return;
    
    setIsProcessing(true);
    const data = await api.getCrawlingData(university.id);
    downloadCSV(data, `${university.slug}-crawling-data.csv`);
    setIsProcessing(false);
  };

  const handleMarkValid = () => {
    const confirmed = confirm(`Are you sure the data for ${university?.name} is VALID?\n\nThis will keep the current calculated scores.`);
    if (!confirmed) return;
    
    alert("Data marked as valid. No changes made to the scores.");
    router.push('/reviewer');
  };

  const handleMarkInvalid = async () => {
    if (!university) return;
    
    const confirmed = confirm(
      `Are you sure the data for ${university.name} is INVALID?\n\n` +
      `This will set ALL category scores to 0 for this university.\n\n` +
      `This action will update the database immediately.`
    );
    
    if (!confirmed) return;
    
    setIsProcessing(true);
    const result = await api.invalidateUniversity(university.id);
    setIsProcessing(false);
    
    if (result.success) {
      alert(`✓ ${result.message}\n\nAll category scores have been set to 0.`);
      router.push('/reviewer');
    } else {
      alert(`✗ Failed to invalidate university data:\n${result.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#5C2E2E]">Loading University Details...</h1>
          </div>
        </Container>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#5C2E2E]">University Not Found</h1>
            <button
              onClick={() => router.push('/reviewer')}
              className="mt-4 bg-[#5C2E2E] text-white px-6 py-2 rounded-lg hover:bg-[#7A3E3E] transition"
            >
              Back to Dashboard
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <Container>
        <button
          onClick={() => router.push('/reviewer')}
          className="mb-6 text-[#5C2E2E] hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-center my-8 text-[#5C2E2E]">{university.name}</h1>
        
        {/* University Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-[#5C2E2E] mb-4">University Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Country:</p>
              <p className="font-semibold text-[#5C2E2E]">{university.country}</p>
            </div>
            <div>
              <p className="text-gray-600">Region:</p>
              <p className="font-semibold text-[#5C2E2E]">{university.region}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Rank:</p>
              <p className="font-semibold text-[#5C2E2E]">#{university.rank}</p>
            </div>
            <div>
              <p className="text-gray-600">Trust Score:</p>
              <p className={`font-semibold text-xl ${
                university.trustScore >= 70 ? 'text-green-600' :
                university.trustScore >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {university.trustScore}
              </p>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-[#5C2E2E] mb-4">RAI Dimension Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {university.categoryScores && university.categoryScores.length > 0 ? (
              university.categoryScores.map((category) => (
                <div key={category.categoryName} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{category.categoryName}</p>
                  <p className="text-2xl font-bold text-[#5C2E2E]">
                    {category.score !== null ? category.score.toFixed(2) : 'N/A'}
                  </p>
                  {category.updatedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Updated: {new Date(category.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-4">
                No category scores available
              </div>
            )}
          </div>
        </div>

        {/* Download Data Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-[#5C2E2E] mb-4">Download Comparison Data</h2>
          <p className="text-gray-600 mb-4">
            Download the evidence data and crawling data to compare them manually and determine validity.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownloadAnswers}
              disabled={isProcessing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : '📥 Download Answers Data (CSV)'}
            </button>
            <button
              onClick={handleDownloadCrawling}
              disabled={isProcessing}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : '📥 Download Crawling Data (CSV)'}
            </button>
          </div>
        </div>

        {/* Validation Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-[#5C2E2E] mb-4">Data Validation Decision</h2>
          <p className="text-gray-600 mb-6">
            After comparing the data, make your decision on whether the university&apos;s submitted data is valid.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleMarkValid}
              disabled={isProcessing}
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✓ Mark as VALID
            </button>
            <button
              onClick={handleMarkInvalid}
              disabled={isProcessing}
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✗ Mark as INVALID (Set Scores to 0)
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Marking as INVALID will immediately update all category scores to 0 in the database. 
              This action affects the university&apos;s ranking. Please ensure you have reviewed the data thoroughly.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function UniversityDetailPageWrapper({ params }: UniversityDetailProps) {
  return (
    <ReviewerGuard>
      <UniversityDetailPage params={params} />
    </ReviewerGuard>
  );
}
