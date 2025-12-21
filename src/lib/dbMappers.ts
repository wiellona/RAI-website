import type { University } from "./types";

export type DbUniversity = {
  id: string;
  slug: string;
  name: string;
  country_code: string;
  region: string;
  rank: number;
  trustScore: number;
  lastUpdated: string;
  metrics: any; // JSONB
  created_at?: string;
  updated_at?: string;
  dean_name?: string;
  pic_name?: string;
  pic_email?: string;
};

/**
 * Mapping dari database row ke TypeScript type
 */
export function mapDbToUniversity(db: DbUniversity): University {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    country: db.country_code,
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
    dean_name: "",
    pic_name: "",
    pic_email: "",
  };
}
