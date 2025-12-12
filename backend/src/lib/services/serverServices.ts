import { UNIVERSITIES, mockSubmissions, mockUsers } from "@/lib/mockData";
import type { University, Submission, User, UserRole } from "@/lib/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getUniversities(): Promise<University[]> {
  await delay(60);
  return UNIVERSITIES;
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  await delay(40);
  return UNIVERSITIES.find((u) => u.slug === slug) ?? null;
}

export async function getRankings(): Promise<University[]> {
  await delay(80);
  return UNIVERSITIES;
}

export async function updateRankingScore(id: string, score: number): Promise<boolean> {
  await delay(80);
  const u = UNIVERSITIES.find((x) => x.id === id || x.slug === id);
  if (!u) return false;
  u.trustScore = score;
  u.lastUpdated = new Date().toISOString();
  return true;
}

export async function getSubmissions(): Promise<Submission[]> {
  await delay(50);
  return mockSubmissions;
}

export async function acceptSubmission(id: string): Promise<boolean> {
  await delay(40);
  const idx = mockSubmissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  mockSubmissions.splice(idx, 1);
  return true;
}

export async function rejectSubmission(id: string): Promise<boolean> {
  await delay(40);
  const idx = mockSubmissions.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  mockSubmissions.splice(idx, 1);
  return true;
}

export async function getUsers(): Promise<User[]> {
  await delay(40);
  return mockUsers;
}

export async function updateUserRole(id: string, role: UserRole): Promise<boolean> {
  await delay(40);
  const u = mockUsers.find((x) => x.id === id);
  if (!u) return false;
  u.role = role;
  return true;
}

export async function startScoreProcessing(): Promise<{ success: boolean; message: string }> {
  await delay(1200);
  return { success: true, message: "Processing simulated (mock)." };
}

export async function login(username: string, password: string): Promise<{ user: User; token: string } | null> {
  await delay(80);
  const found = mockUsers.find((u) => u.email === username || u.id === username || u.name === username);
  if (!found) return null;
  return { user: found, token: `mock-token-${found.id}` };
}
