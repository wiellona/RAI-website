"use client";

import { useMemo, useState } from "react";
import { Answer } from "@/lib/types";

interface QuestionnaireAnswersProps {
  answers: Answer[];
  universityId: string;
}

const CATEGORY_ORDER = [
  "Ethics in AI",
  "Fairness",
  "Transparency",
  "Accountability",
  "Privacy",
  "Security",
  "Continuous Learning",
  "Collaboration",
];

const parseScore = (score: Answer["score"]) => {
  if (typeof score === "number") {
    return score;
  }
  const parsed = Number(score ?? 0);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function QuestionnaireAnswers({
  answers,
  universityId,
}: QuestionnaireAnswersProps) {
  const [approvalState, setApprovalState] = useState<Record<string, boolean>>(
    () =>
      answers.reduce((acc, answer) => {
        const initial =
          typeof answer.is_approved === "boolean" ? answer.is_approved : true;
        acc[answer.id] = initial;
        return acc;
      }, {} as Record<string, boolean>)
  );
  const [isSaving, setIsSaving] = useState(false);

  const groupedAnswers = useMemo(
    () =>
      answers.reduce((acc, answer) => {
        const dimension = answer.Questions?.dimension || "Other";
        if (!acc[dimension]) {
          acc[dimension] = [];
        }
        acc[dimension].push(answer);
        return acc;
      }, {} as Record<string, Answer[]>),
    [answers]
  );

  const sortedGroupedAnswers = useMemo(
    () =>
      Object.entries(groupedAnswers).sort(
        ([firstDimension], [secondDimension]) => {
          const firstIndex = CATEGORY_ORDER.indexOf(firstDimension);
          const secondIndex = CATEGORY_ORDER.indexOf(secondDimension);
          if (firstIndex === -1) return 1;
          if (secondIndex === -1) return -1;
          return firstIndex - secondIndex;
        }
      ),
    [groupedAnswers]
  );

  const calculateDimensionTotal = (dimensionAnswers: Answer[]) =>
    dimensionAnswers.reduce((total, answer) => {
      const isApproved = approvalState[answer.id];
      const scoreValue = parseScore(answer.score);
      return total + (isApproved ? scoreValue : 0);
    }, 0);

  const toggleApproval = (answerId: string) => {
    setApprovalState((previous) => ({
      ...previous,
      [answerId]: !previous[answerId],
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/admin/university-answers/${universityId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approvals: approvalState }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save approvals");
      }

      alert("Changes saved successfully!");
    } catch (error) {
      alert("Failed to save changes");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {sortedGroupedAnswers.map(([dimension, dimensionAnswers]) => {
        const dimensionTotal = calculateDimensionTotal(dimensionAnswers);

        return (
          <div
            key={dimension}
            className="card p-6 border-2 border-[#0047AB]/20"
          >
            <h2 className="text-2xl font-semibold mb-4 text-[#000080]">
              {dimension}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gradient-to-r from-[#000080] to-[#0047AB] text-white">
                  <tr>
                    <th className="text-center py-3 px-4 font-semibold w-20">
                      Approve
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Question
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Answer
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Score
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Final Score
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Evidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dimensionAnswers.map((answer, index) => {
                    const isApproved = approvalState[answer.id];
                    const scoreValue = parseScore(answer.score);
                    const finalScore = isApproved ? scoreValue : 0;

                    return (
                      <tr
                        key={answer.id}
                        className={`border-b ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-[#f0f4ff]`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isApproved}
                            onChange={() => toggleApproval(answer.id)}
                            className="w-5 h-5 text-[#0047AB] border-2 border-[#0047AB]/30 rounded focus:ring-2 focus:ring-[#0047AB] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-[#000080]">
                          {answer.Questions?.question_text || "-"}
                        </td>
                        <td className="py-3 px-4 text-[#000080]/70">
                          {answer.Options?.option_text || "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 rounded font-medium bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30">
                            {scoreValue}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-1 rounded font-bold ${
                              isApproved
                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-400"
                                : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-400"
                            }`}
                          >
                            {finalScore}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {answer.evidence_notes ? (
                            <a
                              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/evidence_uploads/${answer.evidence_notes}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0047AB] hover:underline"
                            >
                              View Evidence
                            </a>
                          ) : (
                            "No evidence"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-[#0047AB] to-[#0099ED] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold text-lg">
                  Total Score for {dimension}:
                </span>
                <span className="text-white font-bold text-2xl">
                  {dimensionTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="sticky bottom-0 bg-white border-2 border-[#0047AB]/30 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p className="font-semibold text-[#000080]">
              ⚠️ Remember to save your changes!
            </p>
            <p>
              Review all approvals before saving. Unapproved answers will have a
              score of 0.
            </p>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-8 py-3 bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white rounded-lg hover:from-[#0099ED] hover:to-[#0047AB] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
