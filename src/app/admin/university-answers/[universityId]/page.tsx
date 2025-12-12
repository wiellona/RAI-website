"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import SubmissionDocuments from "@/components/admin/SubmissionDocuments";
import CrawlingDocuments from "@/components/admin/CrawlingDocuments";
import QuestionnaireAnswers from "@/components/admin/QuestionnaireAnswers";
import { UniversityAnswerDetail } from "@/lib/types";

export default function UniversityAnswersPage() {
  const params = useParams();
  const router = useRouter();
  const universityId = params.universityId as string;
  const [data, setData] = useState<UniversityAnswerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnswers() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/university-answers/${universityId}`);
        if (!response.ok) throw new Error('Failed to fetch answers');
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (universityId) {
      fetchAnswers();
    }
  }, [universityId]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#000080]">Loading...</h1>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error || 'No data found'}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white rounded hover:from-[#0099ED] hover:to-[#0047AB]"
            >
              Go Back
            </button>
          </div>
        </Container>
      </div>
    );
  }

  if (!data.answers || data.answers.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#000080] mb-4">{data.universityName}</h1>
            <p className="text-gray-600">No questionnaire answers found for this university.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white rounded hover:from-[#0099ED] hover:to-[#0047AB]"
            >
              Go Back
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen py-12">
      <Container>
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-[#000080] hover:text-[#0047AB] mb-4 flex items-center"
          >
            ← Back to Rankings
          </button>
          <h1 className="text-4xl font-bold text-[#000080]">{data.universityName}</h1>
          <p className="text-gray-600 mt-2">
            Questionnaire Answers - Submitted: {new Date(data.submittedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Submission Documents Component */}
        <SubmissionDocuments
          universityName={data.universityName}
          letterPath={data.submissionDocuments?.letterPath || null}
          assetEvidencePath={data.submissionDocuments?.assetEvidencePath || null}
          publicationEvidencePath={data.submissionDocuments?.publicationEvidencePath || null}
        />

        {/* Crawling Documents Component */}
        <CrawlingDocuments
          universityName={data.universityName}
          crawlingData={data.crawlingData}
        />

        {/* Questionnaire Answers Component */}
        <QuestionnaireAnswers answers={data.answers} />
      </Container>
    </div>
  );
}