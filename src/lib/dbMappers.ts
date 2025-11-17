import type { University } from "./types";

/**
 * Database type mapping untuk tabel universities
 * Menggunakan snake_case sesuai dengan PostgreSQL convention
 */
export type DbUniversity = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  rank: number;
  trust_score: number;
  last_updated: string;
  transparency: number;
  auditability: number;
  data_privacy: number;
  policy_maturity: number;
  created_at?: string;
  updated_at?: string;
};

/**
 * Mapping dari database row (snake_case) ke TypeScript type (camelCase)
 */
export function mapDbToUniversity(db: DbUniversity): University {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    country: db.country,
    region: db.region,
    rank: db.rank,
    trustScore: db.trust_score,
    lastUpdated: db.last_updated,
    metrics: {
      transparency: db.transparency,
      auditability: db.auditability,
      dataPrivacy: db.data_privacy,
      policyMaturity: db.policy_maturity,
    },
  };
}

/**
 * Mapping dari TypeScript type (camelCase) ke database row (snake_case)
 * Untuk INSERT/UPDATE operations
 */
export function mapUniversityToDb(uni: University): Partial<DbUniversity> {
  return {
    id: uni.id,
    slug: uni.slug,
    name: uni.name,
    country: uni.country,
    region: uni.region,
    rank: uni.rank,
    trust_score: uni.trustScore,
    last_updated: uni.lastUpdated,
    transparency: uni.metrics.transparency,
    auditability: uni.metrics.auditability,
    data_privacy: uni.metrics.dataPrivacy,
    policy_maturity: uni.metrics.policyMaturity,
  };
}
