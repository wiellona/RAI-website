// 8 Dimensi RAI (Responsible AI)
export type RAIDimensions = {
  collaboration: number | null;
  privacy: number | null;
  accountability: number | null;
  security: number | null;
  ethicsInAI: number | null;
  fairness: number | null;
  transparency: number | null;
  continuousLearning: number | null;
};

export type ScoreSource = "submission" | "ai";

export type ScoreSourceChoices = {
  collaboration?: ScoreSource;
  privacy?: ScoreSource;
  accountability?: ScoreSource;
  security?: ScoreSource;
  ethicsInAI?: ScoreSource;
  fairness?: ScoreSource;
  transparency?: ScoreSource;
  continuousLearning?: ScoreSource;
};

export type CategoryScore = {
  categoryName: string;
  score: number | null;
  updatedAt: string | null;
};

export type University = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  rank: number;
  trustScore: number; // 0-100
  lastUpdated: string; // ISO date string
  metrics: RAIDimensions; // Updated to use 8 dimensions
  categoryScores?: CategoryScore[]; // Array of category scores with timestamps
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
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending';
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

export type UserRole = "admin" | "university" | "user" | "reviewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Answer {
  id: string;
  submission_id: string;
  question_id: string;
  selected_option_id: string;
  evidence_notes: string | null;
  score: number | string;
  is_approved?: boolean | null;
  // Related data from joins
  question?: {
    question_text: string;
    dimension: string;
  };
  option?: {
    option_text: string;
  };
  Questions?: {
    question_text: string;
    dimension: string;
  };
  Options?: {
    option_text: string;
  };
  submission?: {
    university_id: string;
    submitted_at: string;
  };
}

export interface AIRankingScores {
  // 8 Detailed Category Scores
  category1_score: number; // Ethics in AI (from publications) - max 2000
  category2_score: number; // Fairness (from publications) - max 1200
  category3_score: number; // Transparency (from assets) - max 1300
  category4_score: number; // Accountability (from assets) - max 1800
  category5_score: number; // Privacy (from policies) - max 600
  category6_score: number; // Security (from policies) - max 1200
  category7_score: number; // Continuous Learning (from divisions) - max 800
  category8_score: number; // Collaboration (from divisions) - max 1100
  
  // Legacy grouped scores (for backward compatibility)
  publications_grade: number; // category1 + category2
  assets_grade: number; // category3 + category4
  policies_grade: number; // category5 + category6
  divisions_grade: number; // category7 + category8
  
  total_score: number;
  rank: number;
  
  // Raw data
  total_publications: number;
  total_models: number;
  total_datasets: number;
  total_policies: number;
  total_divisions: number;
  total_assets: number;
}

export interface UniversityAnswerDetail {
  universityId: string;
  universityName: string;
  submissionId: string;
  submittedAt: string;
  answers: Answer[];
  crawlingData?: any;
  submissionDocuments?: any;
  isDataApproved?: boolean;
  aiRankingScores?: AIRankingScores | null;
  sourceChoices?: ScoreSourceChoices | null;
  metrics?: RAIDimensions | null;
}

