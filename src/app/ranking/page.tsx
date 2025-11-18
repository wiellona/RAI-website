"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface University {
  ranking: number;
  name: string;
  score: number;
  ethicsScore?: number;
  fairnessScore?: number;
  transparencyScore?: number;
  accountabilityScore?: number;
  privacyScore?: number;
  securityScore?: number;
  continuousLearningScore?: number;
  collaborationScore?: number;
  aiPublications?: number;
  aiAssets?: number;
  publicationsPdfUrl?: string;
  assetsPdfUrl?: string;
}

// Dummy data - will be replaced with API call
const dummyRankings: University[] = [
  {
    ranking: 1,
    name: "Stanford University",
    score: 9500,
    ethicsScore: 95,
    fairnessScore: 98,
    transparencyScore: 92,
    accountabilityScore: 96,
    privacyScore: 94,
    securityScore: 97,
    continuousLearningScore: 93,
    collaborationScore: 95,
    aiPublications: 450,
    aiAssets: 120,
    publicationsPdfUrl: "/documents/stanford-publications.pdf",
    assetsPdfUrl: "/documents/stanford-assets.pdf",
  },
  {
    ranking: 2,
    name: "MIT",
    score: 9350,
    ethicsScore: 93,
    fairnessScore: 95,
    transparencyScore: 94,
    accountabilityScore: 95,
    privacyScore: 92,
    securityScore: 96,
    continuousLearningScore: 91,
    collaborationScore: 94,
    aiPublications: 420,
    aiAssets: 115,
    publicationsPdfUrl: "/documents/mit-publications.pdf",
    assetsPdfUrl: "/documents/mit-assets.pdf",
  },
  {
    ranking: 3,
    name: "Carnegie Mellon University",
    score: 9200,
    ethicsScore: 91,
    fairnessScore: 93,
    transparencyScore: 90,
    accountabilityScore: 94,
    privacyScore: 93,
    securityScore: 95,
    continuousLearningScore: 92,
    collaborationScore: 92,
    aiPublications: 380,
    aiAssets: 110,
    publicationsPdfUrl: "/documents/cmu-publications.pdf",
    assetsPdfUrl: "/documents/cmu-assets.pdf",
  },
];

export default function RankingPage() {
  const [rankings, setRankings] = useState<University[]>(dummyRankings);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (university: University) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUniversity(null);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-[65px] bg-gradient-to-br from-[#511715] to-[#8B3528] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            RAI Global University Rankings 2025
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Discover the world's leading universities in Responsible AI
            implementation, governance, and innovation.
          </p>
        </div>
      </section>

      {/* Rankings Table Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="bg-[#511715] text-white p-6">
              <h2 className="text-2xl font-bold">University Rankings</h2>
              <p className="text-white/80 mt-1">
                Click on any university to view detailed breakdown
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Ranking
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      University Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rankings.map((university) => (
                    <tr
                      key={university.ranking}
                      onClick={() => handleRowClick(university)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {university.ranking}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {university.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#c5372c]">
                        {university.score.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State if no data */}
            {rankings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No rankings available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Detail Modal/Popup */}
      {isModalOpen && selectedUniversity && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#511715] text-white p-6 flex justify-between items-start sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold">
                  #{selectedUniversity.ranking} {selectedUniversity.name}
                </h3>
                <p className="text-white/80 mt-1">
                  Total Score: {selectedUniversity.score.toLocaleString()}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Criteria Scores */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Criteria Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedUniversity.ethicsScore !== undefined && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Ethics in AI
                        </span>
                        <span className="text-sm font-bold text-[#c5372c]">
                          {selectedUniversity.ethicsScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#c5372c] h-2 rounded-full"
                          style={{
                            width: `${selectedUniversity.ethicsScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {selectedUniversity.fairnessScore !== undefined && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Fairness
                        </span>
                        <span className="text-sm font-bold text-[#c5372c]">
                          {selectedUniversity.fairnessScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#c5372c] h-2 rounded-full"
                          style={{
                            width: `${selectedUniversity.fairnessScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {selectedUniversity.transparencyScore !== undefined && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Transparency
                        </span>
                        <span className="text-sm font-bold text-[#c5372c]">
                          {selectedUniversity.transparencyScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#c5372c] h-2 rounded-full"
                          style={{
                            width: `${selectedUniversity.transparencyScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {selectedUniversity.accountabilityScore !== undefined && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Accountability
                        </span>
                        <span className="text-sm font-bold text-[#c5372c]">
                          {selectedUniversity.accountabilityScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#c5372c] h-2 rounded-full"
                          style={{
                            width: `${selectedUniversity.accountabilityScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {selectedUniversity.privacyScore !== undefined && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Privacy
                        </span>
                        <span className="text-sm font-bold text-[#c5372c]">
                          {selectedUniversity.privacyScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#c5372c] h-2 rounded-full"
                          style={{
                            width: `${selectedUniversity.privacyScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {selectedUniversity.securityScore !== undefined && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Security
                        </span>
                        <span className="text-sm font-bold text-[#c5372c]">
                          {selectedUniversity.securityScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#c5372c] h-2 rounded-full"
                          style={{
                            width: `${selectedUniversity.securityScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {selectedUniversity.continuousLearningScore !== undefined && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Continuous Learning
                        </span>
                        <span className="text-sm font-bold text-[#c5372c]">
                          {selectedUniversity.continuousLearningScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#c5372c] h-2 rounded-full"
                          style={{
                            width: `${selectedUniversity.continuousLearningScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {selectedUniversity.collaborationScore !== undefined && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Collaboration
                        </span>
                        <span className="text-sm font-bold text-[#c5372c]">
                          {selectedUniversity.collaborationScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#c5372c] h-2 rounded-full"
                          style={{
                            width: `${selectedUniversity.collaborationScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Metrics */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Metrics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedUniversity.aiPublications !== undefined && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Number of AI Publications
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedUniversity.aiPublications}
                        </div>
                        {selectedUniversity.publicationsPdfUrl && (
                          <a
                            href={selectedUniversity.publicationsPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#c5372c] hover:text-[#a42e24] font-medium text-sm underline"
                          >
                            See Here
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedUniversity.aiAssets !== undefined && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Number of AI Open-Source Assets
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedUniversity.aiAssets}
                        </div>
                        {selectedUniversity.assetsPdfUrl && (
                          <a
                            href={selectedUniversity.assetsPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#c5372c] hover:text-[#a42e24] font-medium text-sm underline"
                          >
                            See Here
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <button
                onClick={closeModal}
                className="w-full bg-[#c5372c] hover:bg-[#a42e24] text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
