"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import UniversitySubmissions from "@/components/admin/UniversitySubmissions";
import UserManagement from "@/components/admin/UserManagement";
import NotFull from "@/components/admin/NotFull";
import ManageRankings from "@/components/admin/ManageRankings";
import AIAnalysis from "@/components/admin/AIAnalysis";
import { Submission, User, University, UserRole } from "@/lib/types";
import * as api from "@/lib/api";
import AdminGuard from "@/components/auth/AdminGuard";
import { useAuth } from "@/hooks/useAuth";

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
    const confirmed = confirm("Are you sure you want to approve this submission?");
    if (!confirmed) return;
    
    await api.acceptSubmission(id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
    alert("Submission approved successfully!");
  };

  const handleRejectSubmission = async (id: string) => {
    const confirmed = confirm("Are you sure you want to decline this submission?");
    if (!confirmed) return;
    
    await api.rejectSubmission(id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
    alert("Submission declined.");
  };

  const handleUpdateUserRole = async (id: string, role: UserRole) => {
    await api.updateUserRole(id, role);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    alert(`User role updated to ${role}`);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#000080]">Loading Admin Dashboard...</h1>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen py-12">
      <Container>
        <h1 className="text-4xl font-bold text-center my-8 text-[#000080]">Admin Dashboard</h1>
        <p className="text-center text-gray-600 mb-8">
          View and manage university submissions, rankings, and user roles.
        </p>
      
        <div className="space-y-8">
          {/* HANYA ADMIN YANG BISA LIHAT INI */}
          <UniversitySubmissions 
            submissions={submissions} 
            onAccept={handleAcceptSubmission}
            onReject={handleRejectSubmission}
          />
          {/* Complete Rankings */}
          <ManageRankings rankings={rankings} />
          <NotFull rankings={rankings} />
          <AIAnalysis rankings={rankings} />
          <UserManagement users={users} onUpdateRole={handleUpdateUserRole} />

          {/* Incomplete Universities */}

        </div>

        
      </Container>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
