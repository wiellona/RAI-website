"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/Header";
import { getCriteriaData, type UICriteria } from "@/lib/api/questionnaire";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

interface Answer {
  [key: string]: {
    value: number;
    optionId: string | null;
    evidence?: string;
  };
}

type AnswerValue = Answer[string];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();

export default function CriteriaPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [criteriaData, setCriteriaData] = useState<UICriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCriteria, setCurrentCriteria] = useState(1);
  const [answers, setAnswers] = useState<Answer>({});
  const [questionnaireId, setQuestionnaireId] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
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

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (ignore) return;
      const user = data.session?.user;
      const email = user?.email ?? "";
      if (!user || !email) {
        router.push("/login");
        return;
      }

      setCurrentUserEmail(email);
      setCurrentUserId(user.id);

      const answersKey = `questionnaireAnswers_${email}`;
      const savedAnswers = localStorage.getItem(answersKey);
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
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
    let mounted = true;
    (async () => {
      try {
        const payload = await getCriteriaData();
        if (mounted) {
          setCriteriaData(payload.criteria);
          setQuestionnaireId(payload.questionnaireId);
          setLoading(false);
          if (payload.criteria.length > 0) {
            setCurrentCriteria(payload.criteria[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load questionnaires:", e);
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
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
          .select("id")
          .eq("university_id", universityId)
          .eq("questionnaire_id", questionnaireId)
          .limit(1)
          .maybeSingle();

        if (cancelled) return;

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data?.id) {
          setSubmissionId(data.id);
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
  }, [currentUserId, questionnaireId, supabase, universityId]);

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
    if (!submissionId || !criteriaData.length) return;
    let cancelled = false;

    const hydrateAnswers = async () => {
      try {
        const { data, error } = await supabase
          .from("Answers")
          .select("question_id, selected_option_id, evidence_notes")
          .eq("submission_id", submissionId);

        if (error) throw error;
        if (cancelled || !data?.length) return;

        const restored: Answer = {};
        data.forEach((row) => {
          if (!row.question_id) return;
          const optionId = row.selected_option_id ?? null;
          const optionValue =
            optionId && optionLookup[row.question_id]?.[optionId] !== undefined
              ? optionLookup[row.question_id][optionId]
              : 0;

          restored[row.question_id] = {
            value: optionValue,
            optionId,
            evidence: row.evidence_notes ?? undefined,
          };
        });

        if (!cancelled && Object.keys(restored).length) {
          setAnswers((prev) => ({ ...prev, ...restored }));
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

  const currentCriteriaData = useMemo(
    () => criteriaData.find((c) => c.id === currentCriteria),
    [criteriaData, currentCriteria]
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

  const calculateProgress = () => {
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
  };

  const calculateScore = () => {
    let totalScore = 0;
    criteriaData.forEach((criteria) => {
      criteria.questions.forEach((question) => {
        const answer = answers[question.id];
        if (answer) totalScore += (question.score * answer.value) / 100;
      });
    });
    return Math.round(totalScore);
  };

  const handleAnswer = (
    questionId: string,
    optionId: string | null,
    value: number
  ) => {
    setStatusMessage(null);
    setStatusLevel(null);
    const newAnswers = {
      ...answers,
      [questionId]: {
        value,
        optionId,
        evidence: answers[questionId]?.evidence,
      },
    };
    setAnswers(newAnswers);
  };

  const persistAnswers = useCallback(
    async (override?: Answer) => {
      if (!submissionId) throw new Error("Submission is not ready yet.");

      const source = override ?? answers;

      const rows = Object.entries(source)
        .map(([questionId, answer]) => ({
          questionId,
          answer,
        }))
        .filter(
          ({ answer }) =>
            Boolean(answer?.optionId) || Boolean(answer?.evidence?.length)
        )
        .map(({ questionId, answer }) => ({
          submission_id: submissionId,
          question_id: questionId,
          selected_option_id: answer.optionId,
          evidence_notes: answer.evidence ?? null,
        }));

      if (!rows.length) return;

      const { error } = await supabase
        .from("Answers")
        .upsert(rows, { onConflict: "submission_id,question_id" });

      if (error) throw error;
    },
    [answers, submissionId, supabase]
  );

  const handleNext = async () => {
    if (currentCriteria < criteriaData.length) {
      setCurrentCriteria(currentCriteria + 1);
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
  };

  const handleSaveAndExit = async () => {
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
  };

  const handleFileUpload = async (
    questionId: string,
    categoryTitle: string,
    file: File | null
  ) => {
    if (!file) return;
    if (!submissionId || !universityId) {
      setStatusLevel("error");
      setStatusMessage("Please wait while we prepare your questionnaire.");
      return;
    }

    setUploadingQuestionId(questionId);
    setStatusMessage(null);
    setStatusLevel(null);

    try {
      const categorySlug = slugify(categoryTitle || "uncategorized");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("universityId", universityId);
      formData.append("categorySlug", categorySlug);
      formData.append("questionId", questionId);

      const response = await fetch("/api/questionnaire/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Failed to upload evidence");
      }

      const { path } = (await response.json()) as { path: string };

      const nextAnswer: AnswerValue = {
        value: answers[questionId]?.value ?? 0,
        optionId: answers[questionId]?.optionId ?? null,
        evidence: path,
      };

      const nextAnswers = {
        ...answers,
        [questionId]: nextAnswer,
      };

      setAnswers(nextAnswers);
      await persistAnswers(nextAnswers);

      setStatusLevel("info");
      setStatusMessage("Evidence uploaded successfully.");
    } catch (error) {
      console.error("Failed to upload evidence", error);
      setStatusLevel("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Evidence upload failed."
      );
    } finally {
      setUploadingQuestionId(null);
    }
  };

  const handleFileInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    questionId: string,
    categoryTitle: string
  ) => {
    const file = event.target.files?.[0] ?? null;
    void handleFileUpload(questionId, categoryTitle, file);
    // Reset the input so the same file can be uploaded again if needed
    // eslint-disable-next-line no-param-reassign
    event.target.value = "";
  };

  const handleBack = () => {
    if (currentCriteria > 1) setCurrentCriteria(currentCriteria - 1);
  };

  const isCriteriaCompleted = (criteriaId: number) => {
    const criteria = criteriaData.find((c) => c.id === criteriaId);
    if (!criteria) return false;
    return criteria.questions.every((q) =>
      Number.isFinite(answers[q.id]?.value)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading questionnaire...
      </div>
    );
  }

  if (!currentCriteriaData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No questionnaire data found.
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">University</p>
              <h1 className="font-bold text-xl text-[#5C2E2E]">
                {institutionName}
              </h1>
            </div>

            <div className="flex-1 w-full lg:max-w-md">
              <div className="flex items-end justify-between mb-2">
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-sm text-gray-600">{calculateProgress()} %</p>
              </div>
              <div className="w-full h-3 bg-[#FFE5E5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A84032] transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleSaveAndExit()}
              disabled={saving || !submissionId}
              className="bg-white border border-[#A84032] text-[#A84032] hover:bg-[#A84032]/5 font-medium text-sm px-6 py-2 rounded-md transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save and Exit"}
            </button>
          </div>

          {statusMessage && (
            <div
              className={`mb-6 rounded-md border px-4 py-3 text-sm ${
                statusLevel === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {statusMessage}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 shrink-0">
              <nav className="bg-white border border-gray-200 rounded-lg p-3">
                {criteriaData.map((criteria) => (
                  <button
                    key={criteria.id}
                    onClick={() => setCurrentCriteria(criteria.id)}
                    className={`w-full text-left px-4 py-3 rounded-md font-medium text-sm mb-2 transition-colors flex items-center justify-between ${
                      currentCriteria === criteria.id
                        ? "bg-[#FFE5E5] text-[#A84032]"
                        : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span>
                      {criteria.id}. {criteria.title}
                    </span>
                    {isCriteriaCompleted(criteria.id) && (
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </nav>
            </aside>

            <div className="flex-1">
              <h2 className="font-bold text-2xl text-[#5C2E2E] mb-6">
                {currentCriteria}. {currentCriteriaData.title}
              </h2>

              {currentCriteriaData.questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
                >
                  <h3 className="font-semibold text-base text-gray-900 mb-4">
                    {question.text}
                  </h3>

                  {question.type === "radio" && question.options && (
                    <div className="space-y-3 mb-6">
                      {question.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={
                              answers[question.id]?.optionId === option.id
                            }
                            onChange={() =>
                              handleAnswer(question.id, option.id, option.value)
                            }
                            className="w-5 h-5 text-[#A84032] accent-[#A84032] cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "likert" && question.options && (
                    <div>
                      <div className="flex justify-between mb-3">
                        <p className="text-xs text-gray-500">
                          Strongly Disagree
                        </p>
                        <p className="text-xs text-gray-500">Strongly Agree</p>
                      </div>
                      <div className="grid grid-cols-5 gap-2 mb-6">
                        {question.options.map((option, idx) => {
                          const isSelected =
                            answers[question.id]?.optionId === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                handleAnswer(
                                  question.id,
                                  option.id,
                                  option.value
                                )
                              }
                              className={`h-10 rounded-md font-normal text-sm transition-all ${
                                isSelected
                                  ? "border-2 border-[#A84032] bg-[#A84032]/5 text-[#A84032] font-medium"
                                  : "border border-gray-300 text-gray-700 hover:border-[#A84032]/50"
                              }`}
                            >
                              {option.label || idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {question.type === "likert" && !question.options && (
                    <p className="text-sm text-gray-500 mb-6">
                      Likert options are not configured for this question yet.
                    </p>
                  )}

                  <div>
                    <p className="font-medium text-sm text-gray-900 mb-3">
                      Evidence Upload
                    </p>
                    <label className="relative border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-[#A84032]/50 transition-colors text-center px-4">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploadingQuestionId === question.id}
                        onChange={(event) =>
                          handleFileInputChange(
                            event,
                            question.id,
                            currentCriteriaData.title
                          )
                        }
                      />
                      {uploadingQuestionId === question.id ? (
                        <p className="text-sm text-gray-600">Uploading...</p>
                      ) : (
                        <>
                          <p className="text-base text-[#A84032] mb-1">
                            + Upload Document
                          </p>
                          <p className="text-xs text-gray-500">
                            Drag and drop or click to upload
                          </p>
                        </>
                      )}
                    </label>
                    {answers[question.id]?.evidence && (
                      <p className="text-xs text-gray-600 mt-2 break-all">
                        Uploaded: {answers[question.id]?.evidence}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentCriteria === 1}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                <button
                  onClick={() => void handleNext()}
                  className="bg-[#A84032] hover:bg-[#8B3528] text-white font-medium text-sm px-8 py-2 rounded-md transition-colors"
                >
                  {currentCriteria < criteriaData.length
                    ? "Next Question →"
                    : "Review & Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
