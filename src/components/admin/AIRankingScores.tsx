"use client";

import type { AIRankingScores } from "@/lib/types";

interface AIRankingScoresProps {
  scores: AIRankingScores;
}

const CATEGORY_DETAILS = [
  {
    key: "category1_score" as const,
    label: "Category 1: Ethics in AI",
    maxScore: 2000,
    description: "Based on publications",
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700"
  },
  {
    key: "category2_score" as const,
    label: "Category 2: Fairness",
    maxScore: 1200,
    description: "Based on publications",
    color: "from-indigo-600 to-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700"
  },
  {
    key: "category3_score" as const,
    label: "Category 3: Transparency",
    maxScore: 1300,
    description: "Based on assets (models & datasets)",
    color: "from-purple-600 to-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700"
  },
  {
    key: "category4_score" as const,
    label: "Category 4: Accountability",
    maxScore: 1800,
    description: "Based on assets (models & datasets)",
    color: "from-pink-600 to-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-700"
  },
  {
    key: "category5_score" as const,
    label: "Category 5: Privacy",
    maxScore: 600,
    description: "Based on policies",
    color: "from-green-600 to-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700"
  },
  {
    key: "category6_score" as const,
    label: "Category 6: Security",
    maxScore: 1200,
    description: "Based on policies",
    color: "from-teal-600 to-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-700"
  },
  {
    key: "category7_score" as const,
    label: "Category 7: Continuous Learning",
    maxScore: 800,
    description: "Based on divisions",
    color: "from-orange-600 to-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700"
  },
  {
    key: "category8_score" as const,
    label: "Category 8: Collaboration",
    maxScore: 1100,
    description: "Based on divisions",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700"
  }
];

export default function AIRankingScores({ scores }: AIRankingScoresProps) {
  const getPercentage = (score: number, maxScore: number) => {
    return ((score / maxScore) * 100).toFixed(1);
  };

  return (
    <div className="card p-6 border-2 border-[#0047AB]/20 bg-linear-to-br from-white to-blue-50">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-[#000080]">
            🤖 AI Automated Ranking Scores
          </h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Overall Rank</div>
            <div className="text-3xl font-bold text-[#0047AB]">
              #{scores.rank}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Automatically calculated based on crawled data - 8 detailed categories
        </p>
      </div>

      {/* Total Score Card */}
      <div className="mb-6 p-6 bg-linear-to-r from-[#0047AB] to-[#0099ED] rounded-lg shadow-lg">
        <div className="flex justify-between items-center text-white">
          <div>
            <div className="text-sm opacity-90 mb-1">Total AI Score</div>
            <div className="text-4xl font-bold">{scores.total_score.toFixed(2)}</div>
            <div className="text-sm opacity-90 mt-1">out of 10,000 points</div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold opacity-20">
              {((scores.total_score / 10000) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 8 Detailed Category Scores */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#000080] mb-4">📊 Detailed Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORY_DETAILS.map((category) => {
            const score = scores[category.key];
            const percentage = getPercentage(score, category.maxScore);

            return (
              <div key={category.key} className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#000080] text-base">{category.label}</h4>
                    <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-[#0047AB]">{score.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">/ {category.maxScore}</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-linear-to-r ${category.color} transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${percentage}%` }}
                  >
                    {parseFloat(percentage) > 15 && (
                      <span className="text-xs font-semibold text-white">{percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grouped Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#000080] mb-4">📈 Grouped Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-xs text-gray-600 mb-1">Publications</div>
            <div className="text-2xl font-bold text-blue-700">{scores.publications_grade.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Cat 1+2 / 3200</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="text-xs text-gray-600 mb-1">Assets</div>
            <div className="text-2xl font-bold text-purple-700">{scores.assets_grade.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Cat 3+4 / 3100</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-xs text-gray-600 mb-1">Policies</div>
            <div className="text-2xl font-bold text-green-700">{scores.policies_grade.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Cat 5+6 / 1800</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
            <div className="text-xs text-gray-600 mb-1">Divisions</div>
            <div className="text-2xl font-bold text-orange-700">{scores.divisions_grade.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Cat 7+8 / 1900</div>
          </div>
        </div>
      </div>

      {/* Raw Data Summary */}
      <div className="border-t-2 border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-[#000080] mb-3">📊 Raw Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{scores.total_publications}</div>
            <div className="text-xs text-gray-600 mt-1">Publications</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-200">
            <div className="text-2xl font-bold text-purple-700">{scores.total_models}</div>
            <div className="text-xs text-gray-600 mt-1">Models</div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-center border border-indigo-200">
            <div className="text-2xl font-bold text-indigo-700">{scores.total_datasets}</div>
            <div className="text-xs text-gray-600 mt-1">Datasets</div>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg text-center border border-pink-200">
            <div className="text-2xl font-bold text-pink-700">{scores.total_assets}</div>
            <div className="text-xs text-gray-600 mt-1">Total Assets</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
            <div className="text-2xl font-bold text-green-700">{scores.total_policies}</div>
            <div className="text-xs text-gray-600 mt-1">Policies</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{scores.total_divisions}</div>
            <div className="text-xs text-gray-600 mt-1">Divisions</div>
          </div>
        </div>
      </div>

      {/* Scoring Methodology Note */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Scoring Methodology:</strong> Scores calculated using percentile ranking. 
          <strong> 8 Categories:</strong> Ethics in AI (2000), Fairness (1200), Transparency (1300), 
          Accountability (1800), Privacy (600), Security (1200), Continuous Learning (800), Collaboration (1100). 
          <strong> Total: 10,000 points.</strong>
        </p>
      </div>
    </div>
  );
}
