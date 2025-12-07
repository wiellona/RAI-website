"use client";

import { Answer } from "@/lib/types";

interface QuestionnaireAnswersProps {
  answers: Answer[];
}

export default function QuestionnaireAnswers({ answers }: QuestionnaireAnswersProps) {
  // Group answers by dimension
  const groupedAnswers = answers.reduce((acc, answer) => {
    const dimension = answer.Questions?.dimension || 'Other';
    if (!acc[dimension]) {
      acc[dimension] = [];
    }
    acc[dimension].push(answer);
    return acc;
  }, {} as Record<string, Answer[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedAnswers).map(([dimension, dimensionAnswers]) => (
        <div key={dimension} className="card p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#5C2E2E] capitalize">
            {dimension.replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-[#5C2E2E] text-white">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Question</th>
                  <th className="text-left py-3 px-4 font-semibold">Answer</th>
                  <th className="text-left py-3 px-4 font-semibold">Score</th>
                  <th className="text-left py-3 px-4 font-semibold">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {dimensionAnswers.map((answer, index) => (
                  <tr
                    key={answer.id}
                    className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#FAF9F6]`}
                  >
                    <td className="py-3 px-4 text-[#5C2E2E]">
                      {answer.Questions?.question_text || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {answer.Options?.option_text || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                        {answer.score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {answer.evidence_notes ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/evidence_uploads/${answer.evidence_notes}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5C2E2E] hover:underline"
                        >
                          View Evidence
                        </a>
                      ) : (
                        'No evidence'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}