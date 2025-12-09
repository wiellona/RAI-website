import type { University } from "./types";

/**
 * Database type mapping untuk tabel Universities
 * Menggunakan snake_case sesuai dengan PostgreSQL convention
 */
export type DbUniversity = {
  id: string;
  slug?: string;
  name: string;
  website?: string;
  address?: string;
  date_of_establishment?: string;
  dean_name?: string;
  pic_name?: string;
  pic_email?: string;
  country_code?: string;
  pic_relation?: string;
  publication_evidence_path?: string;
  asset_evidence_path?: string;
  letter_path?: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * Mapping dari database row (snake_case) ke TypeScript type (camelCase)
 */
export function mapDbToUniversity(db: DbUniversity): University {
  return {
    id: db.id,
    slug: db.slug || '',
    name: db.name,
    country: db.country_code || '',
    region: '', // Need to derive from country_code or add to DB
    rank: 0, // Will be calculated from UniversityRankings
    trustScore: 0, // Will be calculated from scores
    lastUpdated: db.updated_at || db.created_at || new Date().toISOString(),
    metrics: {
      collaboration: null,
      privacy: null,
      accountability: null,
      security: null,
      ethicsInAI: null,
      fairness: null,
      transparency: null,
      continuousLearning: null,
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
    country_code: uni.country,
    dean_name: '',
    pic_name: '',
    pic_email: '',
  };
}
