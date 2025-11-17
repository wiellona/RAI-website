"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import UniversitySubmissions from "@/components/admin/UniversitySubmissions";
import UserManagement from "@/components/admin/UserManagement";
import ManageRankings from "@/components/admin/ManageRankings";
import AIAnalysis from "@/components/admin/AIAnalysis";
import { Submission, User, University, UserRole } from "@/lib/types";
import * as api from "@/lib/api";
import AdminGuard from "@/components/auth/AdminGuard";

function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [rankings, setRankings] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [submissionsData, usersData, rankingsData] = await Promise.all([
        api.getSubmissions(),
        api.getUsers(),
        api.getRankings(),
      ]);
      setSubmissions(submissionsData);
      setUsers(usersData);
      setRankings(rankingsData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleAcceptSubmission = async (id: string) => {
    await api.acceptSubmission(id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
    // You might want to refresh rankings or add to a university list
  };

  const handleRejectSubmission = async (id: string) => {
    await api.rejectSubmission(id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateUserRole = async (id: string, role: UserRole) => {
    await api.updateUserRole(id, role);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    alert(`User ${id} role updated to ${role}`);
  };

  const handleUpdateRankingScore = async (id: string, score: number) => {
    await api.updateRankingScore(id, score);
    setRankings(prev => prev.map(r => r.id === id ? { ...r, trustScore: score } : r).sort((a, b) => b.trustScore - a.trustScore).map((r, index) => ({ ...r, rank: index + 1 })));
    alert(`University ${id} score updated to ${score}`);
  };

  const handleUpdateUniversityMetrics = (id: string, m: University["metrics"]) => {
    setRankings(prev => prev.map(r => r.id === id ? { ...r, metrics: { ...m } } : r));
    // Persist metrics override for dev fallback (when no backend)
    api.setLocalUniversityOverrides(id, { metrics: m });
  };

  if (isLoading) {
    return (
      <Container>
        <div className="text-center py-16">
          <h1 className="text-2xl font-semibold">Loading Admin Dashboard...</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-4xl font-bold text-center my-8">Admin Dashboard</h1>
      <div className="space-y-8">
        <UniversitySubmissions 
          submissions={submissions} 
          onAccept={handleAcceptSubmission}
          onReject={handleRejectSubmission}
        />

        <AIAnalysis rankings={rankings} />

        <UserManagement users={users} onUpdateRole={handleUpdateUserRole} />

        <ManageRankings rankings={rankings} onUpdateScore={handleUpdateRankingScore} onUpdateMetrics={handleUpdateUniversityMetrics} />
      </div>
    </Container>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
