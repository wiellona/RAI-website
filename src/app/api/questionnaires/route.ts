import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

type RawQuestionnaireRow = {
  id: string;
  category: string | null;
  created_at?: string | null;
};

type RawQuestionRow = {
  id: string;
  text: string | null;
  score?: number | string | null;
  options?: unknown;
  questionnaire_id: string | null;
  created_at?: string | null;
};

type ApiQuestionOption = { label: string; value: number };

type ApiQuestionnaire = {
  id: number;
  title: string;
  totalScore: number;
  questions: {
    id: string;
    text: string;
    score: number;
    type: "radio" | "likert";
    options?: ApiQuestionOption[];
  }[];
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
};

const normalizeOptions = (raw: unknown): ApiQuestionOption[] | undefined => {
  if (!raw) return undefined;

  let list: unknown[] | undefined;

  if (Array.isArray(raw)) {
    list = raw;
  } else if (typeof raw === "object" && raw !== null) {
    const maybeOptions = (raw as { options?: unknown }).options;

    if (Array.isArray(maybeOptions)) {
      list = maybeOptions;
    } else {
      list = Object.entries(raw as Record<string, unknown>).map(
        ([label, value]) => ({ label, value })
      );
    }
  }

  if (!list) return undefined;

  const normalized = list
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        const label = String(item);
        const value = toNumber(item);
        return { label, value };
      }

      if (item && typeof item === "object") {
        const labelRaw =
          (item as { label?: unknown }).label ??
          (item as { title?: unknown }).title ??
          (item as { name?: unknown }).name;

        const valueRaw =
          (item as { value?: unknown }).value ??
          (item as { score?: unknown }).score ??
          (item as { weight?: unknown }).weight;

        const label =
          typeof labelRaw === "string"
            ? labelRaw
            : typeof labelRaw === "number"
            ? String(labelRaw)
            : undefined;

        if (!label) return null;

        return {
          label,
          value: toNumber(valueRaw),
        };
      }

      return null;
    })
    .filter(
      (option): option is ApiQuestionOption =>
        option !== null && Number.isFinite(option.value)
    );

  return normalized.length ? normalized : undefined;
};

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data: questionnaireRows, error: questionnaireError } =
      await supabase
        .from("questionnaires")
        .select("id, category, created_at")
        .order("created_at", { ascending: true, nullsFirst: false });

    if (questionnaireError) {
      throw questionnaireError;
    }

    const questionnaires = (questionnaireRows ?? []) as RawQuestionnaireRow[];

    if (!questionnaires.length) {
      return NextResponse.json({ data: [] });
    }

    const questionnaireIds = questionnaires
      .map((q) => q.id)
      .filter((id): id is string => Boolean(id));

    const { data: questionRows, error: questionError } = await supabase
      .from("questions")
      .select("id, text, score, options, questionnaire_id, created_at")
      .in("questionnaire_id", questionnaireIds)
      .order("created_at", { ascending: true, nullsFirst: false });

    if (questionError) {
      throw questionError;
    }

    const byQuestionnaire = new Map<string, RawQuestionRow[]>();
    for (const row of (questionRows ?? []) as RawQuestionRow[]) {
      if (!row.questionnaire_id) continue;
      const bucket = byQuestionnaire.get(row.questionnaire_id) ?? [];
      bucket.push(row);
      byQuestionnaire.set(row.questionnaire_id, bucket);
    }

    const payload: ApiQuestionnaire[] = questionnaires.map((qset, index) => {
      const questions = (byQuestionnaire.get(qset.id) ?? []).sort((a, b) => {
        const aValue = a.created_at ?? "";
        const bValue = b.created_at ?? "";
        return aValue.localeCompare(bValue);
      });

      const uiQuestions = questions.map((question) => {
        const options = normalizeOptions(question.options);
        const score = toNumber(question.score, 0);

        return {
          id: question.id,
          text: question.text ?? "Untitled question",
          score,
          type:
            options && options.length
              ? ("radio" as const)
              : ("likert" as const),
          options,
        };
      });

      const totalScore = uiQuestions.reduce(
        (sum, questionnaire) => sum + questionnaire.score,
        0
      );

      return {
        id: index + 1,
        title: qset.category ?? `Section ${index + 1}`,
        totalScore,
        questions: uiQuestions,
      };
    });

    return NextResponse.json({ data: payload });
  } catch (error) {
    console.error("[api/questionnaires]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while loading questionnaire data.",
      },
      { status: 500 }
    );
  }
}
