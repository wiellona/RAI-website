import { useCallback, useMemo, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export function useParticipateNavigation() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const handleParticipateClick = useCallback(
    async (event?: MouseEvent<HTMLAnchorElement>) => {
      event?.preventDefault();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/authentication/register");
        return;
      }

      const { data: submission, error: submissionError } = await supabase
        .from("Submissions")
        .select("status, submitted_at")
        .eq("submitted_by_user_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (submissionError && submissionError.code !== "PGRST116") {
        console.error("Unable to check submission", submissionError);
        router.push("/questionnaire/general-info");
        return;
      }

      const status = submission?.status ?? "draft";
      const lockedStatuses = new Set([
        "submitted",
        "on_review",
        "completed",
        "approved",
        "pending",
      ]);

      if (lockedStatuses.has(status)) {
        router.push("/questionnaire/submission");
        return;
      }

      // Allow editing only for draft or rejected submissions
      router.push("/questionnaire/general-info");
    },
    [router, supabase]
  );

  return { handleParticipateClick };
}
