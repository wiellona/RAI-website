import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type {
  QuestionnaireResponse,
  UICriteria,
} from "@/app/api/questionnaries/questionnaire";

async function getSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );
}

interface SectionStatus {
  id: number;
  title: string;
  completed: boolean;
  totalQuestions: number;
  answeredQuestions: number;
}

interface ReviewDataPayload {
  submissionId: string;
  questionnaireId: string;
  sections: SectionStatus[];
  completedCount: number;
  totalCount: number;
  allCompleted: boolean;
  submissionStatus: string | null;
}

class ApiError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

async function fetchInternalJson<T>(
  req: Request,
  pathname: string
): Promise<T> {
  const url = new URL(req.url);
  url.pathname = pathname;
  url.search = "";
  const res = await fetch(url.toString(), {
    headers: { cookie: req.headers.get("cookie") ?? "" },
    cache: "no-store",
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (payload as { error?: string })?.error ??
      ((typeof payload === "string" ? payload : "") || res.statusText);
    throw new ApiError(`Failed to load ${pathname}: ${message}`, res.status);
  }

  return payload as T;
}

async function buildReviewData(
  req: Request,
  supabase: SupabaseClient
): Promise<ReviewDataPayload> {
  const questionnaireResponse = await fetchInternalJson<QuestionnaireResponse>(
    req,
    "/api/questionnaries"
  );
  const criteria = questionnaireResponse.data ?? [];
  const questionnaireId = questionnaireResponse.questionnaireId;
  if (!questionnaireId) {
    throw new ApiError("Questionnaire is not available.", 404);
  }
  if (criteria.length === 0) {
    throw new ApiError("No criteria were found for this questionnaire.", 404);
  }

  const generalInfo = await fetchInternalJson<{
    data?: { id?: string; university_id?: string; universityId?: string };
  }>(req, "/api/general-info");

  const universityId =
    generalInfo?.data?.university_id ??
    generalInfo?.data?.universityId ??
    generalInfo?.data?.id ??
    null;

  if (!universityId) {
    throw new ApiError("Unable to determine your university record.", 404);
  }

  const { data: submission, error: submissionError } = await supabase
    .from("Submissions")
    .select("id,status")
    .eq("questionnaire_id", questionnaireId)
    .eq("university_id", universityId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (submissionError && submissionError.code !== "PGRST116") {
    throw new ApiError(submissionError.message, 500);
  }
  if (!submission?.id) {
    throw new ApiError("No submission was found for this questionnaire.", 404);
  }

  const { data: answers, error: answersError } = await supabase
    .from("Answers")
    .select("question_id, selected_option_id")
    .eq("submission_id", submission.id);

  if (answersError) {
    throw new ApiError(answersError.message, 500);
  }

  const questionToCriterion = new Map<string, UICriteria["id"]>();
  criteria.forEach((criterion) =>
    criterion.questions.forEach((question) =>
      questionToCriterion.set(question.id, criterion.id)
    )
  );

  const answeredCountByCriterion = new Map<number, number>();
  (answers ?? []).forEach((answer) => {
    if (!answer.question_id || !answer.selected_option_id) return;
    const criterionId = questionToCriterion.get(answer.question_id);
    if (!criterionId) return;
    answeredCountByCriterion.set(
      criterionId,
      (answeredCountByCriterion.get(criterionId) ?? 0) + 1
    );
  });

  const sections: SectionStatus[] = criteria.map((criterion) => {
    const totalQuestions = criterion.questions.length;
    const answeredQuestions = answeredCountByCriterion.get(criterion.id) ?? 0;
    return {
      id: criterion.id,
      title: `${criterion.id}. ${criterion.title}`,
      totalQuestions,
      answeredQuestions,
      completed: totalQuestions > 0 && answeredQuestions === totalQuestions,
    };
  });

  const completedCount = sections.filter((section) => section.completed).length;
  const totalCount = sections.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return {
    submissionId: submission.id,
    questionnaireId,
    sections,
    completedCount,
    totalCount,
    allCompleted,
    submissionStatus: submission.status ?? null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new ApiError(error.message, 401);
    if (!user) throw new ApiError("Not authenticated.", 401);

    const payload = await buildReviewData(req, supabase);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[GET /api/review-data]", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: "Unable to load review data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new ApiError(error.message, 401);
    if (!user) throw new ApiError("Not authenticated.", 401);

    const payload = await buildReviewData(req, supabase);
    // if (!payload.allCompleted) {
    //   throw new ApiError(
    //     "Please complete every section before submitting.",
    //     400
    //   );
    // }

    const { error: updateError } = await supabase
      .from("Submissions")
      .update({
        status: "on_review",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", payload.submissionId);

    if (updateError) {
      throw new ApiError(updateError.message, 500);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/review-data]", error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit the questionnaire." },
      { status: 500 }
    );
  }
}
