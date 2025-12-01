"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

interface UniversityRank {
  id: string;
  ranking: number;
  score: number;
  university_id: string;
  university_name: string;
  aiPublications: number;
  aiAssets: number;
  publicationPdfUrl?: string;
  assetsPdfUrl?: string;
}

interface ScoreBreakdown {
  category_name: string;
  score: number;
}

export default function RankingPage() {
  const [rankings, setRankings] = useState<UniversityRank[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState<UniversityRank | null>(null);
  const [scoresBreakdown, setScoresBreakdown] = useState<ScoreBreakdown[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    async function fetchRankings() {
      try {
        setLoading(true);
        const { data, error } = await getSupabaseBrowserClient()
          .from("UniversityRankings")
          .select(
            `
            id,
            rank,
            final_total_score,
            university_id,
            Universities (
              name,
              CrawlingData ( num_publications, num_assets )
            )
          `
          )
          .eq("period", "all-time")
          .order("rank", { ascending: true });

        if (error) throw error;

        const formatted: UniversityRank[] = data.map((item: any) => ({
          id: item.id,
          ranking: item.rank,
          score: item.final_total_score,
          university_id: item.university_id,
          university_name: item.Universities?.name || "Unknown",
          aiPublications:
            item.Universities?.CrawlingData?.[0]?.num_publications || 0,
          aiAssets: item.Universities?.CrawlingData?.[0]?.num_assets || 0,
          publicationPdfUrl: item.Universities?.publication_evidence_path,
          assetsPdfUrl: item.Universities?.asset_evidence_path,
        }));

        setRankings(formatted);
      } catch (err) {
        console.error("Failed to load ranking", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRankings();
  }, []);

  const handleRowClick = async (uni: UniversityRank) => {
    setSelectedUni(uni);
    setIsModalOpen(true);
    setLoadingDetails(true);
    setScoresBreakdown([]);

    try {
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
        console.warn("Belum ada submission completed untuk univ ini");
        setLoadingDetails(false);
        return;
      }

      const { data: scoresData, error: scoresError } =
        await getSupabaseBrowserClient()
          .from("CategoryScores")
          .select(
            `
          calculated_score,
          Categories ( name )
        `
          )
          .eq("submission_id", subData.id);

      if (scoresError) throw scoresError;

      const breakdown = scoresData.map((item: any) => ({
        category_name: item.Categories?.name || "Unknown Category",
        score: Number(item.calculated_score),
      }));

      setScoresBreakdown(breakdown);
    } catch (err) {
      console.error("Gagal load detail:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUni(null);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-[65px] bg-gradient-to-br from-[#511715] to-[#8B3528] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            RAI Global University Rankings
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Discover the world's leading universities in Responsible AI
            implementation.
          </p>
        </div>
      </section>

      {/* Rankings Table */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-[#511715] text-white p-6">
              <h2 className="text-2xl font-bold">Live Rankings</h2>
              <p className="text-white/80 mt-1">
                Data is updated in real-time based on submissions.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      University
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Total Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center">
                        Loading data...
                      </td>
                    </tr>
                  ) : (
                    rankings.map((uni) => (
                      <tr
                        key={uni.id}
                        onClick={() => handleRowClick(uni)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900">
                          #{uni.ranking}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {uni.university_name}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#c5372c]">
                          {uni.score.toLocaleString()}
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
      {isModalOpen && selectedUni && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#511715] text-white p-6 flex justify-between sticky top-0">
              <div>
                <h3 className="text-2xl font-bold">
                  #{selectedUni.ranking} {selectedUni.university_name}
                </h3>
                <p className="opacity-90">
                  Total Score: {selectedUni.score.toLocaleString()}
                </p>
              </div>
              <button onClick={closeModal} className="text-2xl">
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {loadingDetails ? (
                <p className="text-center py-8">Loading details...</p>
              ) : (
                <>
                  <h4 className="text-lg font-semibold mb-4">
                    Criteria Breakdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {scoresBreakdown.map((item, idx) => (
                      <div key={idx} className="border p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            {item.category_name}
                          </span>
                          <span className="font-bold text-[#c5372c]">
                            {item.score}
                          </span>
                        </div>
                        {/* Progress Bar Visual (Assuming max per category is roughly 1500-2000, adjust scale accordingly) */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#c5372c] h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (item.score / 2000) * 100,
                                100
                              )}%`,
                            }} // Estimasi max score
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold mb-4">
                    Additional Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">AI Publications</p>
                      <p className="text-2xl font-bold">
                        {selectedUni.aiPublications}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-sm text-gray-600">
                        Open Source Assets
                      </p>
                      <p className="text-2xl font-bold">
                        {selectedUni.aiAssets}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
