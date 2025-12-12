import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getCriteriaData,
  type UICriteria,
} from "@/app/api/questionnaries/questionnaire";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";
import type { SubmissionStatus } from "@/lib/types";

export interface Answer {
  [key: string]: {
    value: number;
    optionId: string | null;
    evidence?: string;
  };
}

export type AnswerValue = Answer[string];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();

const EVIDENCE_BUCKET = "evidence_uploads";

export function useCriteriaPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [criteriaData, setCriteriaData] = useState<UICriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCriteria, setCurrentCriteria] = useState(1);
  const [answers, setAnswers] = useState<Answer>({});
  const [questionnaireId, setQuestionnaireId] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [institutionName, setInstitutionName] = useState("Example University");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusLevel, setStatusLevel] = useState<"info" | "error" | null>(null);
  const [uploadingQuestionId, setUploadingQuestionId] = useState<string | null>(
    null
  );
  const [dirtyQuestions, setDirtyQuestions] = useState<Set<string>>(new Set());
  const getSignedUrl = useCallback(
    async (path?: string): Promise<string | null> => {
      if (!path) return null;
      try {
        // Use getPublicUrl for public bucket
        const { data } = supabase.storage
          .from(EVIDENCE_BUCKET)
          .getPublicUrl(path);
        return data.publicUrl;
      } catch (err) {
        console.error("[getSignedUrl] unexpected", err);
        return null;
      }
    },
    [supabase]
  );
  const CURRENT_CRITERIA_KEY = "criteriaPage.currentCriteria";
  const EDITABLE_STATUSES = useMemo(
    () => new Set<SubmissionStatus>(["draft", "rejected"]),
    []
  );

  const markQuestionDirty = useCallback((questionId: string) => {
    setDirtyQuestions((prev) => {
      if (prev.has(questionId)) return prev;
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
  }, []);

  const markQuestionClean = useCallback((questionId: string) => {
    setDirtyQuestions((prev) => {
      if (!prev.has(questionId)) return prev;
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_CRITERIA_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) {
        setCurrentCriteria(parsed);
      }
    }
    let ignore = false;
    const load = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (ignore) return;
      const email = user?.email ?? "";
      if (!user || !email) {
        router.push("/authentication/login");
        return;
      }

      setCurrentUserEmail(email);
      setCurrentUserId(user.id);

      const answersKey = `questionnaireAnswers_${email}`;
      const savedAnswers = localStorage.getItem(answersKey);
      if (savedAnswers) {
        try {
          const parsed = JSON.parse(savedAnswers) as Answer;
          setAnswers(parsed);
          setDirtyQuestions((prev) => {
            const next = new Set(prev);
            Object.entries(parsed).forEach(([questionId, answer]) => {
              if (answer?.optionId) {
                next.add(questionId);
              }
            });
            return next;
          });
        } catch (error) {
          console.warn("Failed to parse cached questionnaire answers", error);
          localStorage.removeItem(answersKey);
        }
      }

      try {
        const response = await fetch("/api/general-info", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const payload = await response.json();
          const universityName =
            payload?.data?.name || payload?.data?.universityName;
          if (universityName) {
            setInstitutionName(universityName);
          }
          const universityIdentifier =
            payload?.data?.id ?? payload?.data?.university_id ?? null;
          if (universityIdentifier) {
            setUniversityId(universityIdentifier);
          }
        }
      } catch (error) {
        console.error("Failed to fetch general info for criteria page", error);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [router, supabase]);

  useEffect(() => {
    localStorage.setItem(CURRENT_CRITERIA_KEY, currentCriteria.toString());
  }, [currentCriteria]);

  useEffect(() => {
    let cancelled = false;

    async function loadCriteria() {
      try {
        setLoading(true);
        const payload = await getCriteriaData();
        if (cancelled) return;

        setCriteriaData(payload.data ?? []);
        setQuestionnaireId(payload.questionnaireId ?? null);
      } catch (error) {
        console.error("Failed to fetch criteria data", error);
        if (!cancelled) {
          setCriteriaData([]);
          setQuestionnaireId(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCriteria();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!currentUserEmail) return;
    const answersKey = `questionnaireAnswers_${currentUserEmail}`;
    localStorage.setItem(answersKey, JSON.stringify(answers));
  }, [answers, currentUserEmail]);

  useEffect(() => {
    if (!currentUserId || !questionnaireId || !universityId) return;
    let cancelled = false;
    const ensureSubmission = async () => {
      try {
        const { data, error } = await supabase
          .from("Submissions")
          .select("id, status")
          .eq("university_id", universityId)
          .eq("questionnaire_id", questionnaireId)
          .limit(1)
          .maybeSingle();

        if (cancelled) return;

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data?.id) {
          const status = (data.status as SubmissionStatus | null) ?? "draft";
          setSubmissionId(data.id);
          setSubmissionStatus(status);

          if (!EDITABLE_STATUSES.has(status)) {
            setStatusLevel("info");
            setStatusMessage(
              "Pengisian kuisioner sudah dikirim. Mengarahkan ke halaman status."
            );
            router.push("/questionnaire/submission");
            return;
          }

          return;
        }

        const { data: inserted, error: insertError } = await supabase
          .from("Submissions")
          .insert({
            questionnaire_id: questionnaireId,
            university_id: universityId,
            submitted_by_user_id: currentUserId,
            status: "draft",
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        if (!cancelled) {
          setSubmissionId(inserted.id);
          setSubmissionStatus("draft");
        }
      } catch (error) {
        console.error("Failed to prepare questionnaire submission", error);
        if (!cancelled) {
          setStatusLevel("error");
          setStatusMessage(
            "Unable to prepare your questionnaire session. Please refresh the page."
          );
        }
      }
    };

    ensureSubmission();

    return () => {
      cancelled = true;
    };
  }, [
    EDITABLE_STATUSES,
    currentUserId,
    questionnaireId,
    router,
    supabase,
    universityId,
  ]);

  const optionLookup = useMemo(() => {
    const lookup: Record<string, Record<string, number>> = {};
    criteriaData.forEach((criteria) => {
      criteria.questions.forEach((question) => {
        if (!question.options) return;
        lookup[question.id] = lookup[question.id] ?? {};
        question.options.forEach((option) => {
          lookup[question.id][option.id] = option.value;
        });
      });
    });
    return lookup;
  }, [criteriaData]);

  useEffect(() => {
    if (
      !submissionId ||
      !criteriaData.length ||
      !Object.keys(optionLookup).length
    )
      return;
    let cancelled = false;

    const hydrateAnswers = async () => {
      try {
        const { data, error } = await supabase
          .from("Answers")
          .select("question_id, selected_option_id, evidence_notes")
          .eq("submission_id", submissionId);

        if (error) throw error;
        if (cancelled) return;

        const restored: Answer = {};
        if (data && data.length > 0) {
          data.forEach((row) => {
            if (!row.question_id) return;
            const optionId = row.selected_option_id ?? null;
            const optionValue =
              optionId &&
              optionLookup[row.question_id]?.[optionId] !== undefined
                ? optionLookup[row.question_id][optionId]
                : 0;

            restored[row.question_id] = {
              value: optionValue,
              optionId,
              evidence: row.evidence_notes ?? undefined,
            };
          });

          console.log(
            `[hydrateAnswers] Restored ${
              Object.keys(restored).length
            } answers from DB`
          );
        }

        if (!cancelled) {
          setAnswers((prev) => {
            // Merge with localStorage data, giving DB priority
            return { ...prev, ...restored };
          });
          if (Object.keys(restored).length) {
            setDirtyQuestions((prev) => {
              if (!prev.size) return prev;
              const next = new Set(prev);
              Object.keys(restored).forEach((questionId) =>
                next.delete(questionId)
              );
              return next;
            });
          }
        }
      } catch (error) {
        console.error("Failed to load saved answers", error);
        if (!cancelled) {
          setStatusLevel("error");
          setStatusMessage("Some saved answers could not be loaded.");
        }
      }
    };

    hydrateAnswers();

    return () => {
      cancelled = true;
    };
  }, [criteriaData, optionLookup, submissionId, supabase]);

  const saveAnswer = useCallback(
    async (
      questionId: string,
      optionId: string | null,
      evidenceNotes: string | null = null
    ) => {
      if (!submissionId) {
        throw new Error("Submission is not ready yet.");
      }

      if (!optionId) {
        throw new Error(
          "Please select an option before saving so the score can be calculated."
        );
      }

      const payload = {
        submission_id: submissionId,
        question_id: questionId,
        selected_option_id: optionId,
        evidence_notes: evidenceNotes,
      };

      console.log("[saveAnswer] Payload:", payload);

      const { data, error } = await supabase.functions.invoke("submit-answer", {
        body: payload,
      });

      console.log("[saveAnswer] Response:", { data, error });

      if (error) {
        throw new Error(error.message || "Failed to save answer.");
      }
    },
    [submissionId, supabase]
  );

  useEffect(() => {
    if (!criteriaData.length) return;
    setAnswers((prev) => {
      let mutated = false;
      const next: Answer = { ...prev };

      criteriaData.forEach((criteria) => {
        criteria.questions.forEach((question) => {
          const answer = prev[question.id];
          if (!answer || answer.optionId || !question.options) return;
          const replacement = question.options.find(
            (option) => option.value === answer.value
          );
          if (replacement) {
            next[question.id] = { ...answer, optionId: replacement.id };
            mutated = true;
          }
        });
      });

      return mutated ? next : prev;
    });
  }, [criteriaData]);

  const currentCriteriaData = useMemo(
    () => criteriaData.find((c) => c.id === currentCriteria),
    [criteriaData, currentCriteria]
  );

  const completionPercent = useMemo(() => {
    const totalQuestions = criteriaData.reduce(
      (sum, criteria) => sum + criteria.questions.length,
      0
    );

    if (!totalQuestions) return 0;

    const answeredQuestions = criteriaData.reduce((count, criteria) => {
      const answeredInCriteria = criteria.questions.filter((question) =>
        Number.isFinite(answers[question.id]?.value)
      ).length;
      return count + answeredInCriteria;
    }, 0);

    return Math.round((answeredQuestions / totalQuestions) * 100);
  }, [answers, criteriaData]);

  const totalScore = useMemo(() => {
    let score = 0;
    criteriaData.forEach((criteria) => {
      criteria.questions.forEach((question) => {
        const answer = answers[question.id];
        if (answer) score += (question.score * answer.value) / 100;
      });
    });
    return Math.round(score);
  }, [answers, criteriaData]);

  const handleAnswer = useCallback(
    (questionId: string, optionId: string | null, value: number) => {
      setStatusMessage(null);
      setStatusLevel(null);
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          value,
          optionId,
          evidence: prev[questionId]?.evidence,
        },
      }));

      if (!optionId) {
        console.warn(
          `[handleAnswer] No option selected for question ${questionId}. Skipping save.`
        );
        return;
      }

      const evidenceNotes = answers[questionId]?.evidence ?? null;

      markQuestionDirty(questionId);
      void saveAnswer(questionId, optionId, evidenceNotes)
        .then(() => {
          markQuestionClean(questionId);
        })
        .catch((error) => {
          console.error("[handleAnswer] Failed to save answer", error);
          setStatusLevel("error");
          setStatusMessage(
            error instanceof Error
              ? error.message
              : "Failed to save answer. Please try again."
          );
        });
    },
    [answers, markQuestionClean, markQuestionDirty, saveAnswer]
  );

  const persistAnswers = useCallback(
    async (override?: Answer) => {
      if (!submissionId) throw new Error("Submission is not ready yet.");

      const source = override ?? answers;

      const entries = Object.entries(source).filter(
        ([questionId, answer]) =>
          dirtyQuestions.has(questionId) && Boolean(answer?.optionId)
      );

      if (!entries.length) {
        console.log("[persistAnswers] No dirty answers to save");
        return;
      }

      console.log(
        `[persistAnswers] Saving ${entries.length} answers via submit-answer`
      );

      for (const [questionId, answer] of entries) {
        const optionId = answer?.optionId;
        if (!optionId) continue;
        try {
          await saveAnswer(questionId, optionId, answer?.evidence ?? null);
          markQuestionClean(questionId);
        } catch (err) {
          console.error("[persistAnswers] Failed while saving", err);
          throw err;
        }
      }
    },
    [answers, dirtyQuestions, markQuestionClean, saveAnswer, submissionId]
  );

  const handleNext = useCallback(async () => {
    if (currentCriteria < criteriaData.length) {
      setCurrentCriteria((prev) => prev + 1);
      return;
    }

    try {
      await persistAnswers();
      router.push("/questionnaire/review");
    } catch (error) {
      console.error("Unable to save answers before review", error);
      setStatusLevel("error");
      setStatusMessage(
        "Unable to save your answers before review. Please try again."
      );
    }
  }, [criteriaData.length, currentCriteria, persistAnswers, router]);

  const handleSaveAndExit = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setStatusMessage(null);
    setStatusLevel(null);

    try {
      await persistAnswers();
      setStatusLevel("info");
      setStatusMessage("Progress saved successfully.");
      router.push("/");
    } catch (error) {
      console.error("Failed to save questionnaire progress", error);
      setStatusLevel("error");
      setStatusMessage("Failed to save your progress. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [persistAnswers, router, saving]);

  const handleFileUpload = useCallback(
    async (questionId: string, categoryTitle: string, file: File | null) => {
      if (!file || !submissionId || !universityId) return;

      setUploadingQuestionId(questionId);
      try {
        const previousPath = answers[questionId]?.evidence ?? null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("submissionId", submissionId);
        formData.append("universityId", universityId);
        formData.append(
          "categorySlug",
          slugify(categoryTitle || "uncategorized")
        );
        formData.append("questionId", questionId);
        if (previousPath) formData.append("previousPath", previousPath);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const rawText = await response.text();
        console.log(
          "upload response",
          response.status,
          response.statusText,
          rawText
        );

        let payload: { path?: string; error?: string } = {};
        try {
          payload = rawText ? (JSON.parse(rawText) as typeof payload) : {};
        } catch (parseError) {
          console.error("[handleFileUpload] failed to parse JSON", parseError);
        }

        // const payload = (await response.json().catch(() => ({}))) as {
        //   path?: string;
        //   error?: string;
        // };

        if (!response.ok || !payload.path) {
          throw new Error(payload.error || "Failed to upload evidence");
        }

        const updated = {
          ...answers,
          [questionId]: { ...answers[questionId], evidence: payload.path },
        };
        setAnswers(updated);

        const optionId = updated[questionId]?.optionId ?? null;
        if (!optionId) {
          throw new Error(
            "Please select an answer before uploading evidence so scoring can run."
          );
        }

        markQuestionDirty(questionId);
        await saveAnswer(questionId, optionId, payload.path);
        markQuestionClean(questionId);
        setStatusLevel("info");
        setStatusMessage("Evidence uploaded.");
      } catch (error) {
        console.error("Failed to upload evidence", error);
        setStatusLevel("error");
        setStatusMessage(
          error instanceof Error ? error.message : "Evidence upload failed."
        );
      } finally {
        setUploadingQuestionId(null);
      }
    },
    [
      answers,
      markQuestionClean,
      markQuestionDirty,
      saveAnswer,
      submissionId,
      universityId,
    ]
  );

  const handleRemoveEvidence = useCallback(
    async (questionId: string, explicitPath?: string | null) => {
      const path = explicitPath ?? answers[questionId]?.evidence;
      if (!submissionId || !path) {
        setStatusMessage("No evidence to remove.");
        setStatusLevel("error");
        return;
      }

      try {
        const params = new URLSearchParams({
          submissionId,
          questionId,
          path,
        });
        const response = await fetch(`/api/upload?${params.toString()}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || "Failed to remove evidence");
        }

        const updated = {
          ...answers,
          [questionId]: { ...answers[questionId], evidence: undefined },
        };
        setAnswers(updated);

        const optionId = updated[questionId]?.optionId ?? null;
        if (optionId) {
          markQuestionDirty(questionId);
          await saveAnswer(questionId, optionId, null);
          markQuestionClean(questionId);
        } else {
          console.warn(
            `[handleRemoveEvidence] No option selected for question ${questionId}; skipping submit-answer call.`
          );
        }
      } catch (error) {
        console.error("Failed to remove evidence", error);
        setStatusLevel("error");
        setStatusMessage(
          error instanceof Error ? error.message : "Failed to remove evidence"
        );
      }
    },
    [answers, markQuestionClean, markQuestionDirty, saveAnswer, submissionId]
  );

  const handleEvidenceSelect = useCallback(
    (questionId: string, categoryTitle: string, file: File | null) => {
      if (!file) {
        setStatusMessage("No file selected");
        setStatusLevel("error");
        return;
      }
      if (!submissionId || !universityId) {
        setStatusMessage("Session not ready. Please refresh the page.");
        setStatusLevel("error");
        return;
      }

      const optionId = answers[questionId]?.optionId;
      if (!optionId) {
        setStatusMessage(
          "Please choose an answer before uploading supporting evidence."
        );
        setStatusLevel("error");
        return;
      }
      void handleFileUpload(questionId, categoryTitle, file);
    },
    [answers, handleFileUpload, submissionId, universityId]
  );

  const handleBack = useCallback(() => {
    setCurrentCriteria((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const isCriteriaCompleted = useCallback(
    (criteriaId: number) => {
      const criteria = criteriaData.find((c) => c.id === criteriaId);
      if (!criteria) return false;
      return criteria.questions.every((q) =>
        Number.isFinite(answers[q.id]?.value)
      );
    },
    [answers, criteriaData]
  );

  const goToCriteria = useCallback((criteriaId: number) => {
    setCurrentCriteria(criteriaId);
  }, []);

  return {
    answers,
    completionPercent,
    criteriaData,
    currentCriteria,
    currentCriteriaData,
    goToCriteria,
    handleAnswer,
    handleBack,
    handleEvidenceSelect,
    handleNext,
    handleSaveAndExit,
    isSubmissionReady:
      Boolean(submissionId) &&
      (submissionStatus === null || EDITABLE_STATUSES.has(submissionStatus)),
    institutionName,
    isCriteriaCompleted,
    loading,
    saving,
    statusLevel,
    statusMessage,
    totalScore,
    uploadingQuestionId,
    handleRemoveEvidence,
    getSignedUrl,
  };
}
