"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

interface SectionStatus {
  id: number;
  title: string;
  completed: boolean;
}

// Criteria data structure (same as criteria page)
const criteriaData = [
  { id: 1, title: "Ethics in AI", questions: 2 },
  { id: 2, title: "Fairness", questions: 2 },
  { id: 3, title: "Transparency", questions: 2 },
  { id: 4, title: "Accountability", questions: 2 },
  { id: 5, title: "Privacy", questions: 2 },
  { id: 6, title: "Security", questions: 2 },
  { id: 7, title: "Continuous Learning", questions: 2 },
  { id: 8, title: "Collaboration", questions: 2 },
];

export default function ReviewPage() {
  const router = useRouter();
  const [sections, setSections] = useState<SectionStatus[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const totalCount = 8;

  useEffect(() => {
    // Get current user email
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      // If no user logged in, redirect to login
      router.push("/login");
      return;
    }

    // Read answers from localStorage for this user
    const answersKey = `questionnaireAnswers_${userEmail}`;
    const savedAnswers = localStorage.getItem(answersKey);
    const answers = savedAnswers ? JSON.parse(savedAnswers) : {};

    // Check completion status for each criteria
    const sectionsStatus = criteriaData.map((criteria) => {
      // Check if all questions in this criteria are answered
      const question1Id = `${criteria.id}.1`;
      const question2Id = `${criteria.id}.2`;

      const isCompleted =
        answers[question1Id] !== undefined &&
        answers[question2Id] !== undefined;

      return {
        id: criteria.id,
        title: `${criteria.id}. ${criteria.title}`,
        completed: isCompleted,
      };
    });

    setSections(sectionsStatus);
    setCompletedCount(sectionsStatus.filter((s) => s.completed).length);
  }, [router]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 py-12 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Review Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12">
            {/* Success Icon */}
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

            {/* Title */}
            <h1 className="text-3xl font-bold text-center text-[#5C2E2E] mb-8">
              Review and Submit Your Questionnaire
            </h1>

            {/* Section Status Grid */}
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200"
                >
                  {section.completed ? (
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0"
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
                      className="w-5 h-5 text-red-600 flex-shrink-0"
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
                  <span className="text-sm font-medium text-gray-900">
                    {section.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Warning Text */}
            <div className="bg-[#FFF5F5] border border-[#FFE5E5] rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-700 text-center">
                You have completed{" "}
                <span className="font-bold">{completedCount}</span> out of{" "}
                <span className="font-bold">{totalCount}</span> sections of the
                RAI questionnaire. Please review your answers before final
                submission. Once submitted, the questionnaire will be locked for
                review and cannot be edited.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/questionnaire/criteria"
                className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-3 rounded-md transition-colors"
              >
                Go Back and Edit
              </Link>
              <Link
                href="/questionnaire/submission"
                className="inline-flex items-center justify-center bg-[#A84032] hover:bg-[#8B3528] text-white font-medium px-8 py-3 rounded-md transition-colors"
              >
                Submit Final Questionnaire
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2E2E] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <span className="text-xl font-bold">RAI</span>
              </div>
              <p className="text-sm text-white/80">
                Responsible AI Global University Ranking
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm">Contact: info@rai-ranking.org</p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="hover:text-white/80 transition-colors">
                  Twitter/X
                </a>
                <a href="#" className="hover:text-white/80 transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-white/80 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-white/60 text-center md:text-left">
              © 2025 RAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
