"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { University } from "@/lib/types";
import * as api from "@/lib/api";
import ReviewerGuard from "@/components/auth/ReviewerGuard";

function ReviewerDashboard() {
  const [rankings, setRankings] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const rankingsData = await api.getRankings();
      setRankings(rankingsData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleViewDetail = (slug: string) => {
    router.push(`/reviewer/university/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#5C2E2E]">Loading Reviewer Dashboard...</h1>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <Container>
        <h1 className="text-4xl font-bold text-center my-8 text-[#5C2E2E]">Reviewer Dashboard</h1>
        <p className="text-center text-gray-600 mb-8">
          Review and validate university submissions by comparing evidence data with crawled data.
        </p>
      
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-[#5C2E2E] mb-4">University Rankings - RAI Dimensions</h2>
          
          {rankings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No universities available for review.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#5C2E2E]">
                    <th className="py-3 px-4 text-[#5C2E2E] font-semibold">Rank</th>
                    <th className="py-3 px-4 text-[#5C2E2E] font-semibold">University</th>
                    <th className="py-3 px-4 text-[#5C2E2E] font-semibold">Country</th>
                    <th className="py-3 px-4 text-[#5C2E2E] font-semibold">Region</th>
                    <th className="py-3 px-4 text-[#5C2E2E] font-semibold">Trust Score</th>
                    <th className="py-3 px-4 text-[#5C2E2E] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((university) => (
                    <tr key={university.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-semibold text-[#5C2E2E]">{university.rank}</td>
                      <td className="py-3 px-4">{university.name}</td>
                      <td className="py-3 px-4">{university.country}</td>
                      <td className="py-3 px-4">{university.region}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          university.trustScore >= 70 ? 'text-green-600' :
                          university.trustScore >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {university.trustScore}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetail(university.slug)}
                          className="bg-[#5C2E2E] text-white px-4 py-2 rounded-lg hover:bg-[#7A3E3E] transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Reviewer Guide:</strong> Click &quot;Review&quot; to view detailed information about each university. 
            You can download both the evidence data (from submissions) and crawled data to compare them manually. 
            After reviewing, you can mark the university data as valid or invalid.
          </p>
        </div>
      </Container>
    </div>
  );
}

export default function ReviewerPage() {
  return (
    <ReviewerGuard>
      <ReviewerDashboard />
    </ReviewerGuard>
  );
}
