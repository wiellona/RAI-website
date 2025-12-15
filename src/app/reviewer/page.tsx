"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import NotFull from "@/components/admin/NotFull";
import ManageRankings from "@/components/admin/ManageRankings";
import AIAnalysis from "@/components/admin/AIAnalysis";
import { University } from "@/lib/types";
import * as api from "@/lib/api";
import ReviewerGuard from "@/components/auth/ReviewerGuard";

function ReviewerDashboard() {
  const [rankings, setRankings] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const rankingsData = await api.getRankings();
      setRankings(rankingsData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white via-[#e6f0ff] to-[#f0f4ff] min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#000080]">Loading Reviewer Dashboard...</h1>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-[#e6f0ff] to-[#f0f4ff] min-h-screen py-12">
      <Container>
        <h1 className="text-4xl font-bold text-center my-8 text-[#000080]">Reviewer Dashboard</h1>
        <p className="text-center text-[#000080]/70 mb-8">
          Review university rankings and validate incomplete submissions.
        </p>
      
        <div className="space-y-8">
          {/* REVIEWER BISA LIHAT 3 KOMPONEN INI */}
          
          {/* AI Analysis */}
          <AIAnalysis rankings={rankings} />

          {/* Incomplete Universities */}
          <NotFull rankings={rankings} />

          {/* Complete Rankings */}
          <ManageRankings rankings={rankings} />
        </div>

        <div className="mt-8 p-4 bg-[#e6f0ff] border border-[#000080]/30 rounded-lg">
          <p className="text-sm text-[#000080]">
            <strong>Reviewer Notice:</strong> You can view all university rankings and their completion status. 
            Click the "?" icon to view detailed questionnaire answers and evidence.
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
