"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/Header";

interface SectionStatus {
  id: number;
  title: string;
  completed: boolean;
  totalQuestions: number;
  answeredQuestions: number;
}

interface ReviewDataResponse {
  submissionId: string;
  sections: SectionStatus[];
  completedCount: number;
  totalCount: number;
  allCompleted: boolean;
  submissionStatus: string | null;
  error?: string;
}

export default function ReviewPage() {
  const router = useRouter();

  const [sections, setSections] = useState<SectionStatus[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [allCompleted, setAllCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusLevel, setStatusLevel] = useState<"info" | "error" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progressSummary = useMemo(
    () => ({ completedCount, totalCount }),
    [completedCount, totalCount]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setStatusMessage(null);
      setStatusLevel(null);
      try {
        const res = await fetch("/api/review-data", { cache: "no-store" });
        const payload = (await res
          .json()
          .catch(() => ({}))) as ReviewDataResponse;

        if (!res.ok) {
          throw new Error(payload?.error ?? "Failed to load review data.");
        }
        if (cancelled) return;

        setSubmissionId(payload.submissionId);
        setSections(payload.sections ?? []);
        setCompletedCount(payload.completedCount ?? 0);
        setTotalCount(payload.totalCount ?? 0);
        setAllCompleted(Boolean(payload.allCompleted));
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load review data", error);
        setSections([]);
        setSubmissionId(null);
        setCompletedCount(0);
        setTotalCount(0);
        setAllCompleted(false);
        setStatusLevel("error");
        setStatusMessage(
          error instanceof Error ? error.message : "Failed to load review data."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    // if (!submissionId || !allCompleted) {
    //   setStatusLevel("error");
    //   setStatusMessage("Please complete every section before submitting.");
    //   return;
    // }

    if (!submissionId) {
      setStatusLevel("error");
      setStatusMessage("Submission is missing.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setStatusLevel(null);

    try {
      const res = await fetch("/api/review-data", { method: "POST" });
      const payload = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Failed to submit questionnaire.");
      }

      setStatusLevel("info");
      setStatusMessage("Questionnaire submitted successfully.");
      router.push("/questionnaire/submission");
    } catch (error) {
      console.error("Failed to submit questionnaire", error);
      setStatusLevel("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit questionnaire."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [allCompleted, router, submissionId]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center text-gray-600">
        Loading review data...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12">
            {statusMessage && (
              <div
                className={`mb-6 rounded-md px-4 py-3 text-sm ${
                  statusLevel === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {statusMessage}
              </div>
            )}

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-[#5C2E2E] mb-8">
              Review and Submit Your Questionnaire
            </h1>

            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    section.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {section.completed ? (
                    <svg
                      className="w-5 h-5 text-green-600 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-600 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {section.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {section.answeredQuestions}/{section.totalQuestions}{" "}
                      questions answered
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FFF5F5] border border-[#FFE5E5] rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-700 text-center">
                You have completed{" "}
                <span className="font-bold">
                  {progressSummary.completedCount}
                </span>{" "}
                out of{" "}
                <span className="font-bold">{progressSummary.totalCount}</span>{" "}
                sections. Please review your answers before final submission.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/questionnaire/criteria"
                className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-3 rounded-md transition-colors"
              >
                Go Back and Edit
              </Link>
              <button
                type="button"
                onClick={handleSubmit}
                // disabled={!submissionId || !allCompleted || isSubmitting}
                disabled={!submissionId || isSubmitting}
                className="inline-flex items-center justify-center bg-[#A84032] hover:bg-[#8B3528] disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium px-8 py-3 rounded-md transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Final Questionnaire"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#5C2E2E] text-white py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-6">
          <div>
            <p className="font-semibold text-lg">Need assistance?</p>
            <p className="text-sm text-white/80">
              Contact the National Research and Innovation Agency (BRIN) RAI
              Team.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            <span>☎ (021) 1230-4567</span>
            <span>✉ rai@brin.go.id</span>
            <span>📍 Jakarta, Indonesia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
