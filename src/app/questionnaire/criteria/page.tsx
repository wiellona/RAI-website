"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/layout/Header";
import {
  DragDropFileUpload,
  type DragDropAccept,
} from "@/app/components/inputs/DragDropFileUpload";
import { useCriteriaPage } from "@/hooks/useCriteriaPage";

const MAX_EVIDENCE_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const EVIDENCE_ACCEPT: DragDropAccept = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/csv": [".csv"],
};

const deriveEvidenceName = (path?: string) =>
  path?.split("/").pop() ?? "Stored file";

export default function CriteriaPage() {
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const {
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
    institutionName,
    isCriteriaCompleted,
    isSubmissionReady,
    loading,
    saving,
    statusLevel,
    statusMessage,
    uploadingQuestionId,
    handleRemoveEvidence,
    getSignedUrl,
  } = useCriteriaPage();

  // Fetch signed URLs for evidence files
  useEffect(() => {
    const fetchUrls = async () => {
      const paths = Object.values(answers)
        .map((a) => a?.evidence)
        .filter((p): p is string => Boolean(p));

      const newUrls: Record<string, string> = {};
      for (const path of paths) {
        if (!signedUrls[path]) {
          const url = await getSignedUrl(path);
          if (url) {
            newUrls[path] = url;
          }
        }
      }

      if (Object.keys(newUrls).length > 0) {
        setSignedUrls((prev) => ({ ...prev, ...newUrls }));
      }
    };
    void fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, getSignedUrl]); // Remove signedUrls from deps

  if (loading || !isSubmissionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        {loading ? "Loading questionnaire..." : "Preparing your session..."}
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
              <h1 className="font-bold text-xl text-[#000080]">
                {institutionName}
              </h1>
            </div>

            <div className="flex-1 w-full lg:max-w-md">
              <div className="flex items-end justify-between mb-2">
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-sm text-gray-600">{completionPercent} %</p>
              </div>
              <div className="w-full h-3 bg-gradient-to-r from-[#0047AB]/10 to-[#0099ED]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleSaveAndExit()}
              disabled={saving || !isSubmissionReady}
              className="bg-white border-2 border-[#0047AB] text-[#0047AB] hover:bg-[#0047AB]/10 font-semibold text-sm px-6 py-2 rounded-lg transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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

          <div className="flex flex-col lg:flex-row gap-8 ">
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-8 lg:self-start">
              <nav className="bg-white border border-gray-200 rounded-lg p-3">
                {criteriaData.map((criteria) => (
                  <button
                    key={criteria.id}
                    onClick={() => goToCriteria(criteria.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm mb-2 transition-colors flex items-center justify-between cursor-pointer ${
                      currentCriteria === criteria.id
                        ? "bg-gradient-to-r from-[#0047AB]/10 to-[#0099ED]/10 text-[#0047AB] border-2 border-[#0047AB]/20"
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
              <h2 className="font-bold text-2xl text-[#000080] mb-6">
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
                            className="w-5 h-5 text-[#0047AB] accent-[#0047AB] cursor-pointer"
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
                              className={`h-10 rounded-lg font-normal text-sm transition-all ${
                                isSelected
                                  ? "border-2 border-[#0047AB] bg-gradient-to-r from-[#0047AB]/10 to-[#0099ED]/10 text-[#0047AB] font-semibold"
                                  : "border border-gray-300 text-gray-700 hover:border-[#0047AB]/50"
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
                    <DragDropFileUpload
                      currentFile={null}
                      onFileSelect={(file) =>
                        handleEvidenceSelect(
                          question.id,
                          currentCriteriaData.title,
                          file
                        )
                      }
                      accept={EVIDENCE_ACCEPT}
                      helperText={
                        uploadingQuestionId === question.id
                          ? "Uploading evidence..."
                          : "PDF, DOC/DOCX, XLS/XLSX, CSV · up to 10 MB"
                      }
                      maxSize={MAX_EVIDENCE_FILE_SIZE}
                      disabled={uploadingQuestionId === question.id}
                      existingFile={
                        answers[question.id]?.evidence
                          ? {
                              name: deriveEvidenceName(
                                answers[question.id]?.evidence
                              ),
                              downloadUrl:
                                signedUrls[answers[question.id]?.evidence!] ??
                                null,
                            }
                          : undefined
                      }
                      onRemoveExisting={
                        answers[question.id]?.evidence
                          ? () =>
                              handleRemoveEvidence(
                                question.id,
                                answers[question.id]?.evidence ?? null
                              )
                          : undefined
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentCriteria === 1}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={async () => {
                    await handleNext();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white font-semibold text-sm px-8 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
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
