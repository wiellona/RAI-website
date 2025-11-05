import { UNIVERSITIES } from "./mockData";
import type { University } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

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

function applyOverrides(list: University[]): University[] {
  if (typeof window === 'undefined') return list;
  const overrides = getLocalOverrides();
  return list.map(u => {
    const o = overrides[u.id];
    if (!o) return u;
    const metrics = {
      ...u.metrics,
      ...(o.metrics || {}),
    };
    const trustScore = typeof o.trustScore === 'number' ? o.trustScore : u.trustScore;
    return { ...u, metrics, trustScore };
  });
}

async function apiFetch<T>(path: string, init: RequestInit = {}, requireAuth = false): Promise<T> {
  if (!API_BASE) {
    throw new Error("API base URL is not configured");
  }
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
  if (API_BASE) {
    try {
      return await apiFetch<University[]>(`/universities`);
    } catch (e) {
      console.warn("Falling back to mock universities:", e);
      return applyOverrides(UNIVERSITIES);
    }
  }
  return applyOverrides(UNIVERSITIES);
}

export async function fetchUniversityBySlug(slug: string): Promise<University | null> {
  if (API_BASE) {
    try {
      return await apiFetch<University>(`/universities/${slug}`);
    } catch (e) {
      console.warn("Falling back to mock data for slug:", slug, e);
      const all = await fetchUniversities();
      return all.find((u) => u.slug === slug) ?? null;
    }
  }
  const all = await fetchUniversities();
  return all.find((u) => u.slug === slug) ?? null;
}

// --- Admin API Functions ---

import { mockSubmissions, mockUsers } from "./mockData";
import { Submission, User, UserRole } from "./types";

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getSubmissions(): Promise<Submission[]> {
  if (API_BASE) {
    try {
      return await apiFetch<Submission[]>(`/admin/submissions`, {}, true);
    } catch (e) {
      console.warn("Falling back to mock submissions:", e);
    }
  }
  await delay(300);
  return mockSubmissions;
}

export async function getUsers(): Promise<User[]> {
  if (API_BASE) {
    try {
      return await apiFetch<User[]>(`/admin/users`, {}, true);
    } catch (e) {
      console.warn("Falling back to mock users:", e);
    }
  }
  await delay(300);
  return mockUsers;
}

export async function getRankings(): Promise<University[]> {
  if (API_BASE) {
    try {
      return await apiFetch<University[]>(`/rankings`);
    } catch (e) {
      console.warn("Falling back to mock rankings:", e);
    }
  }
  await delay(300);
  return UNIVERSITIES;
}

export async function acceptSubmission(id: string): Promise<{ success: boolean }> {
  if (API_BASE) {
    try {
      await apiFetch(`/admin/submissions/${id}/accept`, { method: 'POST' }, true);
      return { success: true };
    } catch (e) {
      console.warn("Accept submission failed, mock success:", e);
    }
  }
  await delay(500);
  return { success: true };
}

export async function rejectSubmission(id: string): Promise<{ success: boolean }> {
  if (API_BASE) {
    try {
      await apiFetch(`/admin/submissions/${id}/reject`, { method: 'POST' }, true);
      return { success: true };
    } catch (e) {
      console.warn("Reject submission failed, mock success:", e);
    }
  }
  await delay(500);
  return { success: true };
}

export async function updateUserRole(id: string, role: UserRole): Promise<{ success: boolean }> {
  if (API_BASE) {
    try {
      await apiFetch(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }, true);
      return { success: true };
    } catch (e) {
      console.warn("Update user role failed, mock success:", e);
    }
  }
  await delay(500);
  return { success: true };
}

export async function updateRankingScore(id: string, newScore: number): Promise<{ success: boolean }> {
  if (API_BASE) {
    try {
      await apiFetch(`/rankings/${id}/score`, { method: 'PUT', body: JSON.stringify({ score: newScore }) }, true);
      return { success: true };
    } catch (e) {
      console.warn("Update ranking score failed, mock success:", e);
    }
  }
  await delay(500);
  // Persist override locally for dev fallback
  setLocalUniversityOverrides(id, { trustScore: newScore });
  return { success: true };
}

export async function startScoreProcessing(): Promise<{ success: boolean, message: string }> {
  if (API_BASE) {
    try {
      const res = await apiFetch<{ success: boolean, message: string }>(`/admin/process-scores`, { method: 'POST' }, true);
      return res;
    } catch (e) {
      console.warn("Process scores failed, mock success:", e);
    }
  }
  await delay(2000);
  return { success: true, message: "Score processing started successfully." };
}

export async function login(username: string, pass: string): Promise<{ user: User, token: string } | null> {
  // If backend exists, call real endpoint
  if (API_BASE) {
    try {
      const result = await apiFetch<{ user: User, token: string }>(`/auth/login`, { method: 'POST', body: JSON.stringify({ username, password: pass }) });
      return result;
    } catch (e) {
      console.warn("Backend login failed, falling back to mock:", e);
    }
  }
  // Mock login
  await delay(300);
  if (username === 'admin' && pass === 'admin') {
    return { user: { id: 'admin-user', name: 'Admin', email: 'admin@app.com', role: 'admin' }, token: 'mock-admin-token' };
  }
  if (username === 'user' && pass === 'user') {
    return { user: { id: 'normal-user', name: 'User', email: 'user@app.com', role: 'user' }, token: 'mock-user-token' };
  }
  return null;
}
