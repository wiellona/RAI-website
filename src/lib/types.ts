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
  university_id: string;
  questionnaire_id: string;
  submitted_by_user_id: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  // Related data from joins
  university?: {
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
  };
  questionnaire?: {
    title: string;
    version: string;
    description?: string;
  };
  submittedBy?: {
    name: string;
    email: string;
  };
}

export type UserRole = "admin" | "university" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

