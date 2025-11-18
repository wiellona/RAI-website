export type UICriteria = {
  id: number; // 1-based index for sidebar
  title: string;
  totalScore: number;
  questions: {
    id: string;
    text: string;
    type: "radio" | "likert";
    options?: { label: string; value: number }[];
    score: number;
  }[];
};
type ApiResponse = {
  data?: UICriteria[];
  error?: string;
};

export async function getCriteriaData(): Promise<UICriteria[]> {
  try {
    const response = await fetch("/api/questionnaires", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorDetails: unknown;
      try {
        errorDetails = await response.json();
      } catch (jsonError) {
        errorDetails = undefined;
      }

      console.error(
        "Failed to load questionnaire data via /api/questionnaires",
        response.status,
        response.statusText,
        errorDetails
      );
      return [];
    }

    const payload = (await response.json()) as ApiResponse;
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    console.error(
      "Unexpected error while requesting /api/questionnaires",
      error
    );
    return [];
  }
}
