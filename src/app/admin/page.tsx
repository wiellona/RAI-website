"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Container from "@/components/Container";
import UniversitySubmissions from "@/components/admin/UniversitySubmissions";
import UserManagement from "@/components/admin/UserManagement";
import NotFull from "@/components/admin/NotFull";
import ManageRankings from "@/components/admin/ManageRankings";
import AIAnalysis from "@/components/admin/AIAnalysis";
import { Submission, User, University, UserRole } from "@/lib/types";
import * as api from "@/lib/api";
import AdminGuard from "@/components/auth/AdminGuard";

// ✅ OPTIMIZED: React Query for automatic caching, background refetching, and optimistic updates
function AdminDashboard() {
  const queryClient = useQueryClient();

  // Cache submissions data for 5 minutes
  const { data: submissions = [], isLoading: loadingSubmissions } = useQuery({
    queryKey: ["admin", "submissions"],
    queryFn: api.getSubmissions,
  });

  // Cache users data for 5 minutes
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: api.getUsers,
  });

  // Cache rankings data for 5 minutes
  const { data: rankings = [], isLoading: loadingRankings } = useQuery({
    queryKey: ["admin", "rankings"],
    queryFn: api.getRankings,
  });

  // Optimistic update for accepting submission
  const acceptMutation = useMutation({
    mutationFn: api.acceptSubmission,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admin", "submissions"] });

      // Snapshot previous value
      const previousSubmissions = queryClient.getQueryData([
        "admin",
        "submissions",
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["admin", "submissions"],
        (old: Submission[] = []) => old.filter((s) => s.id !== id)
      );

      return { previousSubmissions };
    },
    onError: (err, id, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["admin", "submissions"],
        context?.previousSubmissions
      );
      alert("Failed to approve submission");
    },
    onSuccess: () => {
      alert("Submission approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "rankings"] });
    },
  });

  // Optimistic update for rejecting submission
  const rejectMutation = useMutation({
    mutationFn: api.rejectSubmission,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "submissions"] });
      const previousSubmissions = queryClient.getQueryData([
        "admin",
        "submissions",
      ]);

      queryClient.setQueryData(
        ["admin", "submissions"],
        (old: Submission[] = []) => old.filter((s) => s.id !== id)
      );

      return { previousSubmissions };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(
        ["admin", "submissions"],
        context?.previousSubmissions
      );
      alert("Failed to decline submission");
    },
    onSuccess: () => {
      alert("Submission declined.");
    },
  });

  // Optimistic update for user role change
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      api.updateUserRole(id, role),
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "users"] });
      const previousUsers = queryClient.getQueryData(["admin", "users"]);

      queryClient.setQueryData(["admin", "users"], (old: User[] = []) =>
        old.map((u) => (u.id === id ? { ...u, role } : u))
      );

      return { previousUsers };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["admin", "users"], context?.previousUsers);
      alert("Failed to update user role");
    },
    onSuccess: (data, { role }) => {
      alert(`User role updated to ${role}`);
    },
  });

  const handleAcceptSubmission = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to approve this submission?"
    );
    if (!confirmed) return;
    acceptMutation.mutate(id);
  };

  const handleRejectSubmission = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to decline this submission?"
    );
    if (!confirmed) return;
    rejectMutation.mutate(id);
  };

  const handleUpdateUserRole = async (id: string, role: UserRole) => {
    updateRoleMutation.mutate({ id, role });
  };

  const isLoading = loadingSubmissions || loadingUsers || loadingRankings;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white via-[#e6f0ff] to-[#f0f4ff] min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#000080]">
              Loading Admin Dashboard...
            </h1>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-[#e6f0ff] to-[#f0f4ff] min-h-screen py-12">
      <Container>
        <h1 className="text-4xl font-bold text-center my-8 text-[#000080]">
          Admin Dashboard
        </h1>
        <p className="text-center text-[#000080]/70 mb-8">
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
