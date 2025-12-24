"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  AIRankingScores,
  Answer,
  RAIDimensions,
  ScoreSourceChoices,
} from "@/lib/types";

interface ScoreSourceSelectorProps {
  answers: Answer[];
  aiRankingScores: AIRankingScores | null;
  universityId: string;
  initialSourceChoices?: ScoreSourceChoices | null;
  persistedMetrics?: RAIDimensions | null;
}

const RAI_DIMENSIONS: (keyof RAIDimensions)[] = [
  "ethicsInAI",
  "fairness",
  "transparency",
  "accountability",
  "privacy",
  "security",
  "continuousLearning",
  "collaboration",
];

const RAI_LABELS: Record<keyof RAIDimensions, string> = {
  ethicsInAI: "Ethics in AI",
  fairness: "Fairness",
  transparency: "Transparency",
  accountability: "Accountability",
  privacy: "Privacy",
  security: "Security",
  continuousLearning: "Continuous Learning",
  collaboration: "Collaboration",
};

function parseScore(score: Answer["score"]): number {
  if (typeof score === "number") return score;
  const parsed = Number(score ?? 0);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function ScoreSourceSelector({
  answers,
  aiRankingScores,
  universityId,
  initialSourceChoices,
  persistedMetrics,
}: ScoreSourceSelectorProps) {
  const questionnaireTotals = useMemo<RAIDimensions>(() => {
    const totals: RAIDimensions = {
      collaboration: 0,
      privacy: 0,
      accountability: 0,
      security: 0,
      ethicsInAI: 0,
      fairness: 0,
      transparency: 0,
      continuousLearning: 0,
    };

    answers.forEach((answer) => {
      // Ikuti logika finalize-submission dan QuestionnaireAnswers:
      // hanya jawaban yang sudah disetujui yang dihitung.
      if (answer.is_approved === false) return;

      const dimension =
        answer.Questions?.dimension || answer.question?.dimension;
      if (!dimension) return;
      const normalized = dimension.toLowerCase().replace(/\s+/g, "");
      const scoreValue = parseScore(answer.score);

      if (normalized.includes("ethics")) totals.ethicsInAI! += scoreValue;
      else if (normalized === "fairness") totals.fairness! += scoreValue;
      else if (normalized === "transparency")
        totals.transparency! += scoreValue;
      else if (normalized === "accountability")
        totals.accountability! += scoreValue;
      else if (normalized === "privacy" || normalized.includes("dataprivacy"))
        totals.privacy! += scoreValue;
      else if (normalized === "security") totals.security! += scoreValue;
      else if (
        normalized.includes("learning") ||
        normalized.includes("continous")
      )
        totals.continuousLearning! += scoreValue;
      else if (normalized === "collaboration")
        totals.collaboration! += scoreValue;
    });

    return totals;
  }, [answers]);

  const aiTotals = useMemo<RAIDimensions>(() => {
    if (!aiRankingScores) {
      return {
        collaboration: 0,
        privacy: 0,
        accountability: 0,
        security: 0,
        ethicsInAI: 0,
        fairness: 0,
        transparency: 0,
        continuousLearning: 0,
      };
    }
    return {
      ethicsInAI: aiRankingScores.category1_score,
      fairness: aiRankingScores.category2_score,
      transparency: aiRankingScores.category3_score,
      accountability: aiRankingScores.category4_score,
      privacy: aiRankingScores.category5_score,
      security: aiRankingScores.category6_score,
      continuousLearning: aiRankingScores.category7_score,
      collaboration: aiRankingScores.category8_score,
    };
  }, [aiRankingScores]);

  const [sources, setSources] = useState<ScoreSourceChoices>(() => {
    const base: ScoreSourceChoices = {};

    const isClose = (
      a: number | null | undefined,
      b: number | null | undefined
    ) => {
      if (a == null || b == null) return false;
      return Math.abs(a - b) < 0.5; // small tolerance for rounding
    };

    RAI_DIMENSIONS.forEach((dim) => {
      const explicitChoice = initialSourceChoices?.[dim];
      if (explicitChoice) {
        base[dim] = explicitChoice;
        return;
      }

      if (aiRankingScores && (persistedMetrics as RAIDimensions | null)) {
        const persisted = (persistedMetrics as RAIDimensions)[dim];
        const qVal = questionnaireTotals[dim] ?? 0;
        const aiVal = aiTotals[dim] ?? 0;

        if (isClose(persisted, aiVal)) {
          base[dim] = "ai";
          return;
        }
        if (isClose(persisted, qVal)) {
          base[dim] = "submission";
          return;
        }
      }

      base[dim] = "submission";
    });

    return base;
  });

  // Sinkronkan state lokal jika pilihan sumber atau metrics dari backend berubah
  useEffect(() => {
    const isClose = (
      a: number | null | undefined,
      b: number | null | undefined
    ) => {
      if (a == null || b == null) return false;
      return Math.abs(a - b) < 0.5;
    };

    setSources((prev) => {
      const next: ScoreSourceChoices = { ...prev };

      RAI_DIMENSIONS.forEach((dim) => {
        const explicitChoice = initialSourceChoices?.[dim];
        if (explicitChoice) {
          next[dim] = explicitChoice;
          return;
        }

        if (aiRankingScores && (persistedMetrics as RAIDimensions | null)) {
          const persisted = (persistedMetrics as RAIDimensions)[dim];
          const qVal = questionnaireTotals[dim] ?? 0;
          const aiVal = aiTotals[dim] ?? 0;

          if (isClose(persisted, aiVal)) {
            next[dim] = "ai";
            return;
          }
          if (isClose(persisted, qVal)) {
            next[dim] = "submission";
            return;
          }
        }
      });

      return next;
    });
  }, [
    initialSourceChoices,
    persistedMetrics,
    questionnaireTotals,
    aiTotals,
    aiRankingScores,
  ]);

  const finalMetrics = useMemo<RAIDimensions>(() => {
    const result: RAIDimensions = {
      collaboration: 0,
      privacy: 0,
      accountability: 0,
      security: 0,
      ethicsInAI: 0,
      fairness: 0,
      transparency: 0,
      continuousLearning: 0,
    };

    RAI_DIMENSIONS.forEach((dim) => {
      const source = sources[dim] ?? "submission";
      const qVal = questionnaireTotals[dim] ?? 0;
      const aiVal = aiTotals[dim] ?? 0;
      result[dim] = source === "ai" ? aiVal : qVal;
    });

    return result;
  }, [sources, questionnaireTotals, aiTotals]);

  const [isSaving, setIsSaving] = useState(false);

  const handleChangeSource = (
    dim: keyof RAIDimensions,
    value: "submission" | "ai"
  ) => {
    setSources((prev) => ({ ...prev, [dim]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/admin/university-answers/${universityId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceChoices: sources,
            finalMetrics,
          }),
        }
      );

      if (!response.ok) {
        let details = "";
        try {
          const body = await response.json();
          details =
            typeof body?.error === "string" ? body.error : JSON.stringify(body);
        } catch {
          // ignore
        }
        console.error(
          "Failed to save score sources:",
          response.status,
          details
        );
        throw new Error("Failed to save score sources");
      }

      alert("Score source choices saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to save score source choices.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!aiRankingScores) {
    return null;
  }

  return (
    <div className="card p-6 border-2 border-[#0047AB]/20 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#000080]">
        Source Selection: Questionnaire vs AI
      </h2>
      <p className="text-gray-600 mb-4 text-sm">
        For each RAI dimension, choose whether the official score should come
        from the approved questionnaire submission or from AI-based crawling
        scores.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gradient-to-r from-[#000080] to-[#0047AB] text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Dimension</th>
              <th className="py-3 px-4 text-center font-semibold">
                Questionnaire Score
              </th>
              <th className="py-3 px-4 text-center font-semibold">AI Score</th>
              <th className="py-3 px-4 text-center font-semibold">Use</th>
              <th className="py-3 px-4 text-center font-semibold">
                Final Score
              </th>
            </tr>
          </thead>
          <tbody>
            {RAI_DIMENSIONS.map((dim) => {
              const qVal = questionnaireTotals[dim] ?? 0;
              const aiVal = aiTotals[dim] ?? 0;
              const finalVal = finalMetrics[dim] ?? 0;
              const source = sources[dim] ?? "submission";

              return (
                <tr
                  key={dim}
                  className="border-b last:border-b-0 hover:bg-[#f0f4ff] transition-colors"
                >
                  <td className="py-3 px-4 text-[#000080] font-medium">
                    {RAI_LABELS[dim]}
                  </td>
                  <td className="py-3 px-4 text-center text-[#000080] font-semibold">
                    {qVal.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center text-[#000080] font-semibold">
                    {aiVal.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div
                      className="inline-flex rounded-md shadow-sm"
                      role="group"
                    >
                      <button
                        type="button"
                        onClick={() => handleChangeSource(dim, "submission")}
                        className={`px-3 py-1 text-sm font-medium border border-gray-300 rounded-l-md ${
                          source === "submission"
                            ? "bg-[#0047AB] text-white border-[#0047AB]"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Submission
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeSource(dim, "ai")}
                        disabled={!aiRankingScores}
                        className={`px-3 py-1 text-sm font-medium border border-gray-300 rounded-r-md ${
                          source === "ai"
                            ? "bg-[#0099ED] text-white border-[#0099ED]"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        } ${
                          !aiRankingScores
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        AI
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-[#000080]">
                    {finalVal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white rounded-lg hover:from-[#0099ED] hover:to-[#0047AB] disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
        >
          {isSaving ? "Saving..." : "Save Source Choices"}
        </button>
      </div>
    </div>
  );
}
