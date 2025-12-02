export type UICriteria = {
  id: number; // 1-based index for sidebar
  title: string;
  totalScore: number;
  questions: {
    id: string;
    text: string;
    type: "radio" | "likert";
    options?: { id: string; label: string; value: number }[];
    score: number;
  }[];
};
type ApiResponse = {
  data?: UICriteria[];
  questionnaireId?: string | null;
  error?: string;
};

export type QuestionnairePayload = {
  questionnaireId: string | null;
  criteria: UICriteria[];
};

export type QuestionnaireResponse = {
  questionnaireId: string | null;
  data: UICriteria[];
};

export async function getCriteriaData(): Promise<QuestionnaireResponse> {
  const response = await fetch("/api/questionnaries", { cache: "no-store" });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to load questionnaire data via /api/questionnaries ${response.status} ${response.statusText} ${message}`
    );
  }
  return (await response.json()) as QuestionnaireResponse;
}
