"use client";

import { useState, useEffect } from "react";

interface UniversityCrawlData {
  id: string;
  university_name: string;
  university_name_normalized: string;
  analysis_timestamp: string;
  duration_seconds: number;
  status: string;

  // Step completion flags
  step_publications_completed: boolean;
  step_huggingface_completed: boolean;
  step_github_completed: boolean;
  step_policies_completed: boolean;
  step_organigram_completed: boolean;

  // Summary counts
  total_publications: number;
  total_models: number;
  total_datasets: number;
  total_policies: number;
  total_divisions: number;
  total_assets: number;

  // Ranking data
  publications_grade: number;
  assets_grade: number;
  policies_grade: number;
  divisions_grade: number;
  total_score: number;
  rank: number;
  qs_world_ranking_2026?: number;
  greenmetric_ranking_2025?: number;
  region?: string;

  // Storage and CSV URLs
  storage_folder_path?: string;
  publications_csv_url?: string;
  huggingface_csv_url?: string;
  github_csv_url?: string;
  policies_csv_url?: string;
  organigram_csv_url?: string;

  created_at: string;
  updated_at: string;
}

export default function AutomatedRankingPage() {
  const [crawlData, setCrawlData] = useState<UniversityCrawlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<UniversityCrawlData | null>(null);

  useEffect(() => {
    async function fetchCrawlData() {
      try {
        setLoading(true);
        const response = await fetch("/api/automated-ranking");

        if (!response.ok) {
          throw new Error("Failed to fetch automated ranking data");
        }

        const result = await response.json();
        setCrawlData(result.data || []);
      } catch (err) {
        console.error("Failed to load automated ranking data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCrawlData();
  }, []);

  const handleRowClick = (university: UniversityCrawlData) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUniversity(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateTotalAssets = (uni: UniversityCrawlData) => {
    return uni.total_assets || uni.total_models + uni.total_datasets;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-[65px] bg-gradient-to-br from-[#000080] via-[#0047AB] to-[#000080] text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#0099ED]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#0047AB]/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Automated RAI University Rankings
          </h1>
          <p className="text-xl text-white/90 max-w-3xl font-medium">
            Automated analysis of universities' AI research, assets, and
            policies through web crawling.
          </p>
        </div>
      </section>

      {/* Rankings Table */}
      <section className="py-12 bg-gradient-to-br from-white via-[#f0f4ff] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white via-[#f8f9ff] to-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#0047AB]/20">
            <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] text-white p-6">
              <h2 className="text-2xl font-bold">Automated Rankings</h2>
              <p className="text-white/90 mt-1 font-medium">
                Data collected through automated web crawling and analysis.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#0047AB]/10 to-[#0099ED]/10 border-b-2 border-[#0047AB]/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#000080]">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#000080]">
                      University
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#000080]">
                      Country/Territory
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#000080]">
                      Ethics & Fairness
                      <br />
                      <span className="text-xs font-semibold">(0-3,200)</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#000080]">
                      Transparency & Accountability
                      <br />
                      <span className="text-xs font-semibold">(0-2,100)</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#000080]">
                      Privacy & Security
                      <br />
                      <span className="text-xs font-semibold">(0-1,800)</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#000080]">
                      Continuous Learning & Collaboration
                      <br />
                      <span className="text-xs font-semibold">(0-1,900)</span>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#000080]">
                      Total Score
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#000080]">
                      QS World Ranking 2026
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-[#000080]">
                      UI Greenmetric Ranking 2025
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="p-8 text-center text-[#000080]/60 font-medium"
                      >
                        Loading data...
                      </td>
                    </tr>
                  ) : crawlData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="p-8 text-center text-[#000080]/60 font-medium"
                      >
                        No automated ranking data available yet.
                      </td>
                    </tr>
                  ) : (
                    crawlData.map((uni) => (
                      <tr
                        key={uni.id}
                        onClick={() => handleRowClick(uni)}
                        className="hover:bg-gradient-to-r hover:from-[#0047AB]/5 hover:to-[#0099ED]/5 cursor-pointer transition-all duration-300 border-b border-[#0047AB]/10"
                      >
                        <td className="px-6 py-4 font-bold text-[#0047AB] text-lg">
                          #{uni.rank}
                        </td>
                        <td className="px-6 py-4 text-[#000080] font-semibold">
                          {uni.university_name}
                        </td>
                        <td className="px-6 py-4 text-[#000080] font-medium">
                          {uni.region || "-"}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-[#000080]">
                          {uni.publications_grade.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-[#000080]">
                          {uni.assets_grade.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-[#000080]">
                          {uni.policies_grade.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-[#000080]">
                          {uni.divisions_grade.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-[#0047AB] text-lg">
                          {uni.total_score.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-[#000080]">
                          {uni.qs_world_ranking_2026 || "-"}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-[#000080]">
                          {uni.greenmetric_ranking_2025 || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {isModalOpen && selectedUniversity && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-white via-[#f8f9ff] to-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#0047AB]/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] text-white p-6 flex justify-between sticky top-0 rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold">
                  {selectedUniversity.university_name}
                </h3>
                <p className="opacity-90 text-sm mt-1 font-medium">
                  Analysis completed:{" "}
                  {formatDate(selectedUniversity.analysis_timestamp)}
                </p>
                {selectedUniversity.duration_seconds && (
                  <p className="opacity-90 text-sm font-medium">
                    Duration: {selectedUniversity.duration_seconds.toFixed(2)}s
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-[#0099ED] transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Ranking Score Breakdown */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Score Breakdown
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    Total:{" "}
                    {selectedUniversity.total_score.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    / 10,000
                  </span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-4 rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Ethics & Fairness
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedUniversity.publications_grade.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          },
                        )}
                      </p>
                      <p className="text-sm text-gray-500">/ 3,200</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Transparency & Accountability
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedUniversity.assets_grade.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          },
                        )}
                      </p>
                      <p className="text-sm text-gray-500">/ 2,100</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Privacy & Security
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedUniversity.policies_grade.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          },
                        )}
                      </p>
                      <p className="text-sm text-gray-500">/ 1,800</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200 hover:border-gray-300 transition-colors">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Continuous Learning & Collaboration
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedUniversity.divisions_grade.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          },
                        )}
                      </p>
                      <p className="text-sm text-gray-500">/ 1,900</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Data Breakdown
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Ethics & Fairness
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                      {selectedUniversity.total_publications}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total Models
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                      {selectedUniversity.total_models}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total Datasets
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                      {selectedUniversity.total_datasets}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Privacy & Security
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                      {selectedUniversity.total_policies}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Continuous Learning & Collaboration
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                      {selectedUniversity.total_divisions}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total Assets
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                      {calculateTotalAssets(selectedUniversity)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Completion Status */}
              {/* <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Crawling Steps Completed
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Publications
                    </span>
                    {selectedUniversity.step_publications_completed ? (
                      <span className="text-green-600 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-300 text-lg">✗</span>
                    )}
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      HuggingFace
                    </span>
                    {selectedUniversity.step_huggingface_completed ? (
                      <span className="text-green-600 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-300 text-lg">✗</span>
                    )}
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Policies
                    </span>
                    {selectedUniversity.step_policies_completed ? (
                      <span className="text-green-600 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-300 text-lg">✗</span>
                    )}
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Organigram
                    </span>
                    {selectedUniversity.step_organigram_completed ? (
                      <span className="text-green-600 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-300 text-lg">✗</span>
                    )}
                  </div>
                </div>
              </div> */}

              {/* CSV Download Links */}
              {(selectedUniversity.publications_csv_url ||
                selectedUniversity.huggingface_csv_url ||
                selectedUniversity.github_csv_url ||
                selectedUniversity.policies_csv_url ||
                selectedUniversity.organigram_csv_url) && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3">
                    Download Data
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedUniversity.publications_csv_url && (
                      <a
                        href={selectedUniversity.publications_csv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium text-gray-700"
                      >
                        <span>📄</span>
                        <span>Ethics & Fairness CSV</span>
                      </a>
                    )}
                    {selectedUniversity.huggingface_csv_url && (
                      <a
                        href={selectedUniversity.huggingface_csv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium text-gray-700"
                      >
                        <span>🤗</span>
                        <span>HuggingFace CSV</span>
                      </a>
                    )}
                    {selectedUniversity.github_csv_url && (
                      <a
                        href={selectedUniversity.github_csv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium text-gray-700"
                      >
                        <span>💻</span>
                        <span>GitHub CSV</span>
                      </a>
                    )}
                    {selectedUniversity.policies_csv_url && (
                      <a
                        href={selectedUniversity.policies_csv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium text-gray-700"
                      >
                        <span>📋</span>
                        <span>Privacy & Security CSV</span>
                      </a>
                    )}
                    {selectedUniversity.organigram_csv_url && (
                      <a
                        href={selectedUniversity.organigram_csv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium text-gray-700"
                      >
                        <span>🏢</span>
                        <span>Organigram CSV</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
