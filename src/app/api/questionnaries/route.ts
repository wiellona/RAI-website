import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/supabase/supabaseServer";

type RawQuestionnaire = {
  id: string;
  title: string | null;
  version?: number | null;
  created_at?: string | null;
};

type RawCategory = {
  id: string;
  name: string | null;
  sort_index?: number | null;
  created_at?: string | null;
};

type RawQuestion = {
  id: string;
  category_id: string | null;
  text: string | null;
  max_score?: number | string | null;
  sort_index?: number | null;
  created_at?: string | null;
};

type RawOption = {
  id: string;
  question_id: string | null;
  text: string | null;
  value: number | string | null;
  sort_index?: number | null;
  created_at?: string | null;
};

type ApiQuestionOption = { id: string; label: string; value: number };

type ApiCriteria = {
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

const toOrderKey = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return Number.MAX_SAFE_INTEGER;
};

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data: questionnaireRows, error: questionnaireError } =
      await supabase
<<<<<<< HEAD
        .from("Questionnaries")
=======
        .from("Questionnaires")
>>>>>>> kuisioner-final
        .select("id, title, version, created_at")
        .order("version", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false, nullsFirst: false })
        .limit(1);

    if (questionnaireError) {
      console.error(
        "[api/questionnaries] questionnaire query failed",
        questionnaireError
      );
      return NextResponse.json(
        {
          error: questionnaireError.message,
          details: questionnaireError.details,
          hint: questionnaireError.hint,
          code: questionnaireError.code,
        },
        { status: 500 }
      );
    }

    const activeQuestionnaire = (questionnaireRows ?? [])[0] as
      | RawQuestionnaire
      | undefined;

    if (!activeQuestionnaire?.id) {
      return NextResponse.json({ questionnaireId: null, data: [] });
    }

    const { data: categoryRows, error: categoryError } = await supabase
      .from("Categories")
      .select('id, name, sort_index:"order", created_at')
      .eq("questionnaire_id", activeQuestionnaire.id);

    if (categoryError) {
      console.error(
        "[api/questionnaries] categories query failed",
        categoryError
      );
      return NextResponse.json(
        {
          error: categoryError.message,
          details: categoryError.details,
          hint: categoryError.hint,
          code: categoryError.code,
        },
        { status: 500 }
      );
    }

    const categories = (categoryRows ?? []) as RawCategory[];

    if (!categories.length) {
      return NextResponse.json({
        questionnaireId: activeQuestionnaire.id,
        data: [],
      });
    }

    const categoryIds = categories
      .map((category) => category.id)
      .filter((id): id is string => Boolean(id));

    let questions: RawQuestion[] = [];
    if (categoryIds.length) {
      const { data: questionRows, error: questionError } = await supabase
        .from("Questions")
        .select(
          'id, category_id, text, max_score, sort_index:"order", created_at'
        )
        .in("category_id", categoryIds);

      if (questionError) {
        console.error(
          "[api/questionnaries] questions query failed",
          questionError
        );
        return NextResponse.json(
          {
            error: questionError.message,
            details: questionError.details,
            hint: questionError.hint,
            code: questionError.code,
          },
          { status: 500 }
        );
      }

      questions = (questionRows ?? []) as RawQuestion[];
    }

    const questionIds = questions
      .map((question) => question.id)
      .filter((id): id is string => Boolean(id));

    const optionsByQuestion = new Map<string, ApiQuestionOption[]>();

    if (questionIds.length) {
      const { data: optionRows, error: optionError } = await supabase
        .from("Options")
        .select('id, question_id, text, value, sort_index:"order", created_at')
        .in("question_id", questionIds);

      if (optionError) {
        console.error("[api/questionnaries] options query failed", optionError);
        return NextResponse.json(
          {
            error: optionError.message,
            details: optionError.details,
            hint: optionError.hint,
            code: optionError.code,
          },
          { status: 500 }
        );
      }

      for (const option of (optionRows ?? []) as RawOption[]) {
        if (!option.question_id) continue;

        const bucket = optionsByQuestion.get(option.question_id) ?? [];
        bucket.push({
          id: option.id,
          label: option.text ?? "Untitled option",
          value: toNumber(option.value, 0),
        });
        optionsByQuestion.set(option.question_id, bucket);
      }
    }

    const questionsByCategory = new Map<string, RawQuestion[]>();
    for (const question of questions) {
      if (!question.category_id) continue;
      const bucket = questionsByCategory.get(question.category_id) ?? [];
      bucket.push(question);
      questionsByCategory.set(question.category_id, bucket);
    }

    const payload: ApiCriteria[] = categories
      .slice()
      .sort((a, b) =>
        toOrderKey(a.sort_index) === toOrderKey(b.sort_index)
          ? (a.created_at ?? "").localeCompare(b.created_at ?? "")
          : toOrderKey(a.sort_index) - toOrderKey(b.sort_index)
      )
      .map((category, index) => {
        const categoryQuestions = (
          questionsByCategory.get(category.id) ?? []
        ).sort((a, b) =>
          toOrderKey(a.sort_index) === toOrderKey(b.sort_index)
            ? (a.created_at ?? "").localeCompare(b.created_at ?? "")
            : toOrderKey(a.sort_index) - toOrderKey(b.sort_index)
        );

        const formattedQuestions = categoryQuestions.map((question) => {
          const options = optionsByQuestion.get(question.id);
          const score = toNumber(question.max_score, 0);

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

        const totalScore = formattedQuestions.reduce(
          (sum, question) => sum + question.score,
          0
        );

        return {
          id: index + 1,
          title: category.name ?? `Section ${index + 1}`,
          totalScore,
          questions: formattedQuestions,
        };
      });

    return NextResponse.json({
      questionnaireId: activeQuestionnaire.id,
      data: payload,
    });
  } catch (error) {
    console.error("[api/questionnaries]", error);

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
