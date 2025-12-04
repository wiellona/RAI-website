import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export function useParticipateNavigation() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const handleParticipateClick = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      router.push("/authentication/register");
      return;
    }

    const userId = data.session.user.id;

    const { data: submission, error: submissionError } = await supabase
      .from("Submissions")
      .select("status, submitted_at")
      .eq("submitted_by_user_id", userId)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (submissionError) {
      console.error("Unable to check submission", submissionError);
      router.push("/questionnaire/general-info");
      return;
    }

    const destination =
      submission?.status === "completed"
        ? "/questionnaire/submission"
        : "/questionnaire/general-info";

    router.push(destination);
  }, [router, supabase]);

  return { handleParticipateClick };
}
