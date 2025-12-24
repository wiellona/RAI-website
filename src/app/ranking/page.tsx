"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

interface UniversityRank {
  id: string;
  ranking: number;
  score: number;
  university_id: string;
  university_name: string;
  // aiPublications: number;
  // aiAssets: number;
}

interface ScoreBreakdown {
  category_name: string;
  score: number;
  category_order: number | null;
}

type DownloadLinkCard = {
  label: string;
  icon: string;
  url: string;
};

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

const normalizeName = (value?: string | null) =>
  (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

const safeNumber = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const getTotalAssetsValue = (uni?: UniversityCrawlData | null) => {
  if (!uni) return 0;
  const hasExplicitTotal =
    typeof uni.total_assets === "number" && Number.isFinite(uni.total_assets);
  if (hasExplicitTotal) {
    return uni.total_assets;
  }
  return safeNumber(uni.total_models) + safeNumber(uni.total_datasets);
};

export default function RankingPage() {
  // ✅ OPTIMIZED: Pagination state (20 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState<UniversityRank | null>(null);
  const [selectedUniversity, setSelectedUniversity] =
    useState<UniversityCrawlData | null>(null);
  const [scoresBreakdown, setScoresBreakdown] = useState<ScoreBreakdown[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ✅ OPTIMIZED: React Query for automatic caching (5 minutes)
  const { data: allRankings = [], isLoading: loading } = useQuery({
    queryKey: ["rankings", "all-time"],
    queryFn: async () => {
      const { data, error } = await getSupabaseBrowserClient()
        .from("UniversityRankings")
        .select(
          `
          id,
          rank,
          final_total_score,
          university_id,
          Universities (
            name
          )
        `
        )
        .eq("period", "all-time")
        .order("rank", { ascending: true });

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        ranking: item.rank,
        score: item.final_total_score,
        university_id: item.university_id,
        university_name: item.Universities?.name || "Unknown",
      })) as UniversityRank[];
    },
  });

  // ✅ OPTIMIZED: Cache automated data separately
  const { data: automatedData = [] } = useQuery({
    queryKey: ["rankings", "automated"],
    queryFn: async () => {
      const response = await fetch("/api/automated-ranking", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch automated ranking data");
      }
      const payload = (await response.json()) as {
        data?: UniversityCrawlData[];
      };
      return payload.data ?? [];
    },
  });

  // ✅ OPTIMIZED: Paginate rankings
  const totalPages = Math.ceil(allRankings.length / ITEMS_PER_PAGE);
  const rankings = allRankings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = async (uni: UniversityRank) => {
    setSelectedUni(uni);
    setIsModalOpen(true);
    setLoadingDetails(true);
    setScoresBreakdown([]);

    try {
      console.log(
        `[Ranking] Loading details for university: ${uni.university_id}`
      );

      // ✅ OPTIMIZED: Use cached automatedData from React Query
      const normalizedTarget = normalizeName(uni.university_name);
      const match = automatedData.find((item) => {
        const nameMatch =
          normalizeName(item.university_name) === normalizedTarget;
        const normalizedMatch = item.university_name_normalized
          ? normalizeName(item.university_name_normalized) === normalizedTarget
          : false;
        return nameMatch || normalizedMatch;
      });

      setSelectedUniversity(match ?? null);

      // Step 1: Get the most recent completed submission
      const { data: subData, error: subError } =
        await getSupabaseBrowserClient()
          .from("Submissions")
          .select("id")
          .eq("university_id", uni.university_id)
          .eq("status", "completed")
          .order("submitted_at", { ascending: false })
          .limit(1)
          .single();

      if (subError || !subData) {
        console.error("[Ranking] No completed submission found:", subError);
        setLoadingDetails(false);
        return;
      }

      console.log(`[Ranking] Found submission: ${subData.id}`);

      // Step 2: Fetch category scores with category details
      const { data: scoresData, error: scoresError } =
        await getSupabaseBrowserClient()
          .from("CategoryScores")
          .select(
            `
              calculated_score,
              Categories (
                name,
                order
              )
            `
          )
          .eq("submission_id", subData.id);

      if (scoresError) {
        console.error(
          "[Ranking] Failed to fetch category scores:",
          scoresError
        );
        throw scoresError;
      }

      console.log(`[Ranking] Found ${scoresData?.length || 0} category scores`);

      // Step 3: Sort by Categories.order (ascending) for proper UI display
      const breakdown = (scoresData || [])
        .map((item: any) => ({
          category_name: item.Categories?.name || "Unknown Category",
          score: Number(item.calculated_score) || 0,
          category_order:
            typeof item.Categories?.order === "number"
              ? item.Categories.order
              : 999, // Put unordered categories at the end
        }))
        .sort((a, b) => {
          // Primary sort: by category order
          if (a.category_order !== b.category_order) {
            return a.category_order - b.category_order;
          }
          // Secondary sort: alphabetically if same order
          return a.category_name.localeCompare(b.category_name);
        });

      console.log(`[Ranking] Sorted ${breakdown.length} categories by order`);
      setScoresBreakdown(breakdown);
    } catch (err) {
      console.error("[Ranking] Error loading details:", err);
      setScoresBreakdown([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUni(null);
    setSelectedUniversity(null);
  };

  const breakdownMetrics = [
    {
      label: "Publications",
      value: safeNumber(selectedUniversity?.total_publications),
    },
    {
      label: "Total Models",
      value: safeNumber(selectedUniversity?.total_models),
    },
    {
      label: "Total Datasets",
      value: safeNumber(selectedUniversity?.total_datasets),
    },
    {
      label: "Policies",
      value: safeNumber(selectedUniversity?.total_policies),
    },
    {
      label: "Divisions",
      value: safeNumber(selectedUniversity?.total_divisions),
    },
    {
      label: "Total Assets",
      value: getTotalAssetsValue(selectedUniversity),
    },
  ];

  const downloadLinks: DownloadLinkCard[] = [
    {
      label: "Publications CSV",
      icon: "📄",
      url: selectedUniversity?.publications_csv_url ?? undefined,
    },
    {
      label: "HuggingFace CSV",
      icon: "🤗",
      url: selectedUniversity?.huggingface_csv_url ?? undefined,
    },
    {
      label: "GitHub CSV",
      icon: "💻",
      url: selectedUniversity?.github_csv_url ?? undefined,
    },
    {
      label: "Policies CSV",
      icon: "📋",
      url: selectedUniversity?.policies_csv_url ?? undefined,
    },
    {
      label: "Organigram CSV",
      icon: "🏢",
      url: selectedUniversity?.organigram_csv_url ?? undefined,
    },
  ]
    .filter((link) => Boolean(link.url))
    .map((link) => ({
      label: link.label,
      icon: link.icon,
      url: link.url as string,
    }));

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col">
        <section className="pt-[65px] bg-gradient-to-br from-[#000080] via-[#0047AB] to-[#000080] text-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 right-10 w-96 h-96 bg-[#0099ED]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#0047AB]/20 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              RAI Global University Rankings
            </h1>
            <p className="text-xl text-white/90 max-w-3xl font-medium">
              Discover the world's leading universities in Responsible AI
              implementation.
            </p>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-br from-white via-[#f0f4ff] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-white via-[#f8f9ff] to-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#0047AB]/20">
              <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] text-white p-6">
                <h2 className="text-2xl font-bold">Live Rankings</h2>
                <p className="text-white/90 mt-1 font-medium">
                  Data is updated in real-time based on submissions.
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
                        Total Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-gray-500"
                        >
                          Loading rankings...
                        </td>
                      </tr>
                    ) : rankings.length > 0 ? (
                      rankings.map((uni) => (
                        <tr
                          key={uni.id}
                          onClick={() => handleRowClick(uni)}
                          className="hover:bg-gradient-to-r hover:from-[#0047AB]/5 hover:to-[#0099ED]/5 cursor-pointer transition-all duration-300 border-b border-[#0047AB]/10"
                        >
                          <td className="px-6 py-4 font-bold text-[#0047AB] text-lg">
                            #{uni.ranking}
                          </td>
                          <td className="px-6 py-4 text-[#000080] font-semibold">
                            {uni.university_name}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#0047AB] text-lg">
                            {uni.score.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-8 text-center text-[#000080]/60"
                        >
                          No rankings available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ✅ OPTIMIZED: Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white hover:shadow-lg transform hover:scale-105"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 2
                      )
                      .map((page, idx, arr) => {
                        const prevPage = arr[idx - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;
                        return (
                          <div key={page} className="flex items-center gap-2">
                            {showEllipsis && (
                              <span className="text-[#000080]/50 px-2">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white shadow-lg"
                                  : "bg-white text-[#000080] border-2 border-[#0047AB]/20 hover:border-[#0047AB] hover:bg-[#f0f4ff]"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white hover:shadow-lg transform hover:scale-105"
                    }`}
                  >
                    Next
                  </button>

                  <div className="ml-4 text-[#000080] font-semibold">
                    Page {currentPage} of {totalPages} ({allRankings.length}{" "}
                    total)
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {isModalOpen && selectedUni && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-gradient-to-br from-white via-[#f8f9ff] to-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#0047AB]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] text-white p-6 flex justify-between sticky top-0 z-10 rounded-t-2xl">
                <div>
                  <h3 className="text-2xl font-bold">
                    #{selectedUni.ranking} {selectedUni.university_name}
                  </h3>
                  <p className="opacity-90 font-medium">
                    Total Score: {selectedUni.score.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-[#0099ED] transition-colors text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10"
                >
                  &times;
                </button>
              </div>

              <div className="p-6">
                {loadingDetails ? (
                  <p className="text-center py-8 text-[#000080]/60 font-medium">
                    Loading details...
                  </p>
                ) : (
                  <>
                    <h4 className="text-lg font-bold text-[#000080] mb-4">
                      Criteria Breakdown
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {scoresBreakdown.length > 0 ? (
                        scoresBreakdown.map((item, idx) => (
                          <div
                            key={idx}
                            className="border-2 border-[#0047AB]/20 rounded-xl p-4 hover:border-[#0047AB] hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-[#f8f9ff]"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <span className="text-sm font-semibold text-[#000080] block">
                                  {item.category_name}
                                </span>
                              </div>
                              <div className="text-right ml-3">
                                <span className="text-lg font-bold text-[#0047AB] block">
                                  {item.score.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-[#0047AB]/10 rounded-full h-3 mt-3">
                              <div
                                className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] h-3 rounded-full transition-all duration-500 shadow-lg"
                                style={{
                                  width: `${Math.min(
                                    (item.score / 2000) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="col-span-2 text-center text-[#000080]/60 text-sm py-8 font-medium">
                          No criteria data available for this university yet.
                        </p>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-[#000080] mb-4">
                      Data Breakdown
                    </h4>
                    {selectedUniversity ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {breakdownMetrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="border-2 border-[#0047AB]/20 rounded-xl p-4 bg-gradient-to-br from-white to-[#f8f9ff] hover:border-[#0047AB] hover:shadow-lg transition-all duration-300"
                          >
                            <p className="text-xs font-semibold text-[#000080]/70 uppercase tracking-wide">
                              {metric.label}
                            </p>
                            <p className="text-3xl font-bold text-[#000080] mt-2">
                              {metric.value.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#000080]/70 mb-8">
                        Automated crawl data has not been captured for this
                        university yet. Metrics will appear here once data is
                        available.
                      </p>
                    )}

                    <h4 className="text-lg font-bold text-[#000080] mb-4">
                      Download Data
                    </h4>
                    {!selectedUniversity ? (
                      <p className="text-sm text-[#000080]/70">
                        Automated crawl data has not been captured, so download
                        files are not available yet.
                      </p>
                    ) : downloadLinks.length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {downloadLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-[#0047AB]/20 rounded-xl p-4 bg-gradient-to-br from-white to-[#f8f9ff] hover:border-[#0047AB] hover:shadow-lg transition-all duration-300 flex items-center gap-3 text-[#000080] font-semibold"
                          >
                            <span className="text-2xl" aria-hidden>
                              {link.icon}
                            </span>
                            <span>{link.label}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#000080]/70">
                        Download files are not available for this university
                        yet.
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="border-t-2 border-[#0047AB]/20 p-6 bg-gradient-to-r from-[#0047AB]/5 to-[#0099ED]/5 rounded-b-2xl">
                <button
                  onClick={closeModal}
                  className="w-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
