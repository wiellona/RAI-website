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

export interface UniversityCrawling {
  id: string;
  university_name: string;
  storage_folder_path: string | null;
  publications_csv_url: string | null;
  huggingface_csv_url: string | null;
  policies_csv_url: string | null;
  organigram_csv_url: string | null;
  total_publications: number | null;
  total_huggingface_models: number | null;
  total_huggingface_datasets: number | null;
  total_policies: number | null;
  total_divisions: number | null;
  status: string;
  analysis_timestamp: string | null;
}

export interface UniversityAnswerDetail {
  universityId: string;
  universityName: string;
  submissionId: string;
  submittedAt: string;
  answers: Answer[];
  crawlingData?: UniversityCrawling | null;
  submissionDocuments?: {
    letterPath: string | null;
    assetEvidencePath: string | null;
    publicationEvidencePath: string | null;
  } | null;
  isDataApproved?: boolean;
}
