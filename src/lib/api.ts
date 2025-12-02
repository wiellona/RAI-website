import type { University } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

// --- Local overrides (dev fallback) ---
type UniOverride = Partial<Pick<University, 'trustScore'>> & {
  metrics?: Partial<University['metrics']>
}

function getLocalOverrides(): Record<string, UniOverride> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('uniOverrides');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setLocalUniversityOverrides(id: string, patch: UniOverride) {
  if (typeof window === 'undefined') return;
  const current = getLocalOverrides();
  const prev = current[id] || {};
  const merged: UniOverride = {
    ...prev,
    ...('trustScore' in patch ? { trustScore: patch.trustScore } : {}),
    metrics: { ...(prev.metrics || {}), ...(patch.metrics || {}) },
  };
  const next = { ...current, [id]: merged };
  localStorage.setItem('uniOverrides', JSON.stringify(next));
}

async function apiFetch<T>(path: string, init: RequestInit = {}, requireAuth = false): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (requireAuth) {
    const token = getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: 'no-cache' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchUniversities(): Promise<University[]> {
  try {
    return await apiFetch<University[]>(`/universities`);
  } catch (e) {
    console.error("Failed to fetch universities from database:", e);
    // Return empty array when database is empty or error occurs
    return [];
  }
}

export async function fetchUniversityBySlug(slug: string): Promise<University | null> {
  try {
    return await apiFetch<University>(`/universities/${slug}`);
  } catch (e) {
    console.warn("Falling back to mock data for slug:", slug, e);
    const all = await fetchUniversities();
    return all.find((u) => u.slug === slug) ?? null;
  }
}

// --- Admin API Functions ---

import { Submission, User, UserRole } from "./types";

export async function getSubmissions(): Promise<Submission[]> {
  try {
    const result = await apiFetch<Submission[]>(`/admin/submissions`, {}, true);
    console.log('[api.ts] Submissions fetched from API:', result.length);
    return result;
  } catch (e) {
    console.error("Failed to fetch submissions:", e);
    return [];
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    return await apiFetch<User[]>(`/admin/users`, {}, true);
  } catch (e) {
    console.error("Failed to fetch users:", e);
    return [];
  }
}

export async function getRankings(): Promise<University[]> {
  try {
    return await apiFetch<University[]>(`/rankings`);
  } catch (e) {
    console.error("Failed to fetch rankings from database:", e);
    // Return empty array when database is empty or error occurs
    return [];
  }
}

export async function acceptSubmission(id: string): Promise<{ success: boolean }> {
  try {
    await apiFetch(`/admin/submissions/${id}/accept`, { method: 'POST' }, true);
    return { success: true };
  } catch (e) {
    console.error("Accept submission failed:", e);
    return { success: false };
  }
}

export async function rejectSubmission(id: string): Promise<{ success: boolean }> {
  try {
    await apiFetch(`/admin/submissions/${id}/reject`, { method: 'POST' }, true);
    return { success: true };
  } catch (e) {
    console.error("Reject submission failed:", e);
    return { success: false };
  }
}

export async function updateUserRole(id: string, role: UserRole): Promise<{ success: boolean }> {
  try {
    await apiFetch(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }, true);
    return { success: true };
  } catch (e) {
    console.error("Update user role failed:", e);
    return { success: false };
  }
}

export async function updateRankingScore(id: string, newScore: number): Promise<{ success: boolean }> {
  try {
    await apiFetch(`/rankings/${id}/score`, { method: 'PUT', body: JSON.stringify({ score: newScore }) }, true);
    return { success: true };
  } catch (e) {
    console.error("Update ranking score failed:", e);
    return { success: false };
  }
}

export async function startScoreProcessing(): Promise<{ success: boolean, message: string }> {
  try {
    const res = await apiFetch<{ success: boolean, message: string }>(`/admin/process-scores`, { method: 'POST' }, true);
    return res;
  } catch (e) {
    console.error("Process scores failed:", e);
    return { success: false, message: "Failed to process scores." };
  }
}

export async function login(username: string, pass: string): Promise<{ user: User, token: string } | null> {
  // If backend exists, call real endpoint
  try {
    const result = await apiFetch<{ user: User, session: { access_token: string } | null }>(`/auth/login`, { method: 'POST', body: JSON.stringify({ username, password: pass }) });
    // Convert session to token format for compatibility
    return { 
      user: result.user, 
      token: result.session?.access_token || 'mock-token' 
    };
  } catch (e) {
    console.warn("Backend login failed, falling back to mock:", e);
    // Mock login for development
    if (username === 'admin' && pass === 'admin') {
      return { user: { id: 'admin-user', name: 'Admin', email: 'admin@app.com', role: 'admin' }, token: 'mock-admin-token' };
    }
    if (username === 'reviewer' && pass === 'reviewer') {
      return { user: { id: 'reviewer-user', name: 'Reviewer', email: 'reviewer@app.com', role: 'reviewer' }, token: 'mock-reviewer-token' };
    }
    if (username === 'user' && pass === 'user') {
      return { user: { id: 'normal-user', name: 'User', email: 'user@app.com', role: 'user' }, token: 'mock-user-token' };
    }
    return null;
  }
}

// --- Reviewer API Functions ---

export interface AnswerExportData extends Record<string, unknown> {
  category: string;
  question: string;
  selected_option: string;
  option_value: number;
  evidence: string;
}

export interface CrawlingExportData extends Record<string, unknown> {
  university_id: string;
  num_publications: number;
  num_assets: number;
  crawling_score: number;
  last_crawled_at: string | null;
  note?: string;
}

export async function getAnswersData(universityId: string): Promise<AnswerExportData[]> {
  try {
    return await apiFetch<AnswerExportData[]>(`/reviewer/universities/${universityId}/answers`, {}, true);
  } catch (e) {
    console.error("Failed to fetch answers data:", e);
    return [];
  }
}

export async function getCrawlingData(universityId: string): Promise<CrawlingExportData[]> {
  try {
    return await apiFetch<CrawlingExportData[]>(`/reviewer/universities/${universityId}/crawling`, {}, true);
  } catch (e) {
    console.error("Failed to fetch crawling data:", e);
    return [];
  }
}

export async function invalidateUniversity(universityId: string): Promise<{ success: boolean, message: string }> {
  try {
    const result = await apiFetch<{ success: boolean, message: string }>(`/reviewer/universities/${universityId}/invalidate`, { method: 'POST' }, true);
    return result;
  } catch (e) {
    console.error("Failed to invalidate university:", e);
    return { success: false, message: 'Failed to invalidate university data' };
  }
}

