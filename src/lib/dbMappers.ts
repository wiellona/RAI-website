import type { University } from "./types";

/**
 * Database type mapping untuk tabel universities
 * Menggunakan camelCase sesuai dengan schema Supabase
 */
export type DbUniversity = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  rank: number;
  trustScore: number;
  lastUpdated: string;
  metrics: any; // JSONB
  created_at?: string;
  updated_at?: string;
};

/**
 * Mapping dari database row ke TypeScript type
 */
export function mapDbToUniversity(db: DbUniversity): University {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    country: db.country,
    region: db.region,
    rank: db.rank,
    trustScore: db.trustScore,
    lastUpdated: db.lastUpdated,
    metrics: db.metrics, // Assuming metrics is already in correct format
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
