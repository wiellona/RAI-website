export type University = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  rank: number;
  trustScore: number; // 0-100
  lastUpdated: string; // ISO date string
  metrics: {
    transparency: number; // 0-100
    auditability: number; // 0-100
    dataPrivacy: number; // 0-100
    policyMaturity: number; // 0-100
  };
};

export type Filters = {
  query?: string;
  region?: string;
  country?: string;
  minScore?: number;
};

export interface Submission {
  id: string;
  name: string;
}

export type UserRole = "admin" | "university" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

