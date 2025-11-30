"use client";

import Navbar from "@/app/components/layout/Header";
import { useCriteriaPage } from "@/hooks/useCriteriaPage";

export default function CriteriaPage() {
  const {
    answers,
    completionPercent,
    criteriaData,
    currentCriteria,
    currentCriteriaData,
    goToCriteria,
    handleAnswer,
    handleBack,
    handleFileInputChange,
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
    fileInputs,
    getSignedUrl,
  } = useCriteriaPage();

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
                <p className="text-sm text-gray-600">{completionPercent} %</p>
              </div>
              <div className="w-full h-3 bg-[#FFE5E5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A84032] transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleSaveAndExit()}
              disabled={saving || !isSubmissionReady}
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
                    onClick={() => goToCriteria(criteria.id)}
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

                    {answers[question.id]?.evidence && (
                      <div className="mb-3 rounded border border-green-200 bg-green-50 p-3 flex items-center justify-between text-sm text-green-800">
                        <div className="space-y-1">
                          <p className="font-medium">Evidence uploaded</p>
                          <a
                            href={getSignedUrl(answers[question.id]?.evidence)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-green-700"
                          >
                            Download current file
                          </a>
                        </div>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700 text-xs font-medium"
                          onClick={() => handleRemoveEvidence(question.id)}
                          disabled={uploadingQuestionId === question.id}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    <input
                      id={`evidence-${question.id}`}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                      onChange={(event) =>
                        handleFileInputChange(
                          event,
                          question.id,
                          currentCriteriaData.title
                        )
                      }
                    />

                    <label
                      htmlFor={`evidence-${question.id}`}
                      className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-[#A84032]/50 transition-colors text-center px-4"
                    >
                      {uploadingQuestionId === question.id ? (
                        <p className="text-sm text-gray-600">Uploading...</p>
                      ) : (
                        <>
                          <p className="text-base text-[#A84032] mb-1">
                            Upload Document
                          </p>
                          <p className="text-xs text-gray-500">
                            Drag and drop or click to upload
                          </p>
                        </>
                      )}
                    </label>
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
