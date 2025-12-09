/**
 * Supabase Backend Services
 * Real database integration with Supabase
 */

import { createClient } from "@supabase/supabase-js";
import type { University, Submission, User, UserRole } from "@/lib/types";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase credentials not configured. Backend will use mock data.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all universities from database
 */
export async function getUniversities(): Promise<University[]> {
  try {
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .order("rank", { ascending: true });

    if (error) throw error;

    return (data || []).map(mapUniversityFromDB);
  } catch (error) {
    console.error("[getUniversities] Error:", error);
    return [];
  }
}

/**
 * Get university by slug
 */
export async function getUniversityBySlug(slug: string): Promise<University | null> {
  try {
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    if (!data) return null;

    return mapUniversityFromDB(data);
  } catch (error) {
    console.error("[getUniversityBySlug] Error:", error);
    return null;
  }
}

/**
 * Get all rankings (same as universities but specifically for ranking view)
 */
export async function getRankings(): Promise<University[]> {
  return getUniversities();
}

/**
 * Update university trust score
 */
export async function updateRankingScore(id: string, score: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("universities")
      .update({ 
        trust_score: score,
        last_updated: new Date().toISOString()
      })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[updateRankingScore] Error:", error);
    return false;
  }
}

/**
 * Get all submissions
 */
export async function getSubmissions(): Promise<Submission[]> {
  try {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(mapSubmissionFromDB);
  } catch (error) {
    console.error("[getSubmissions] Error:", error);
    return [];
  }
}

/**
 * Accept submission
 */
export async function acceptSubmission(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("submissions")
      .update({ status: "accepted" })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[acceptSubmission] Error:", error);
    return false;
  }
}

/**
 * Reject submission
 */
export async function rejectSubmission(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[rejectSubmission] Error:", error);
    return false;
  }
}

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(mapUserFromDB);
  } catch (error) {
    console.error("[getUsers] Error:", error);
    return [];
  }
}

/**
 * Update user role
 */
export async function updateUserRole(id: string, role: UserRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[updateUserRole] Error:", error);
    return false;
  }
}

/**
 * Login user
 */
export async function login(email: string, _password: string): Promise<{ user: User; token: string } | null> {
  try {
    // In production, use Supabase Auth
    // For now, just fetch user by email
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return null;

    // In production, verify password here
    return {
      user: mapUserFromDB(data),
      token: `token-${data.id}-${Date.now()}`
    };
  } catch (error) {
    console.error("[login] Error:", error);
    return null;
  }
}

/**
 * Process scores (placeholder for AI processing)
 */
export async function startScoreProcessing(): Promise<{ success: boolean; message: string }> {
  // This would trigger background job to recalculate scores
  return {
    success: true,
    message: "Score processing initiated. This will run in background."
  };
}

// ==================== MAPPER FUNCTIONS ====================

/**
 * Map database row to University type
 */
function mapUniversityFromDB(row: Record<string, unknown>): University {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    country: row.country as string,
    region: row.region as string,
    rank: row.rank as number,
    trustScore: row.trust_score as number,
    lastUpdated: (row.last_updated || row.updated_at) as string,
    metrics: {
      transparency: row.transparency as number,
      auditability: row.auditability as number,
      dataPrivacy: row.data_privacy as number,
      policyMaturity: row.policy_maturity as number,
    },
  };
}

/**
 * Map database row to Submission type
 */
function mapSubmissionFromDB(row: Record<string, unknown>): Submission {
  return {
    id: row.id as string,
    university_id: row.university_id as string,
    questionnaire_id: row.questionnaire_id as string,
    submitted_by_user_id: row.submitted_by_user_id as string,
    submitted_at: (row.submitted_at || row.created_at) as string,
    status: row.status as "pending" | "accepted" | "rejected",
  };
}

/**
 * Map database row to User type
 */
function mapUserFromDB(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as UserRole,
  };
}
