export type University = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  rank: number;
  trustScore: number;
  lastUpdated: string;
  metrics: {
    transparency: number;
    auditability: number;
    dataPrivacy: number;
    policyMaturity: number;
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
