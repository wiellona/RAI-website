import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export function useParticipateNavigation() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const handleParticipateClick = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      router.push("/authentication/register");
      return;
    }

    const userId = user.id;

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

    if (!submission) {
      router.push("/questionnaire/general-info");
      return;
    }

    if (submission.status === "approved") {
      alert("Your submission has already been approved.");
      return;
    }

    router.push("/questionnaire/general-info");
  }, [router, supabase]);

  return { handleParticipateClick };
}
