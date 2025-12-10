"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import { Submission } from "@/lib/types";
import AdminGuard from "@/components/auth/AdminGuard";

function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all submissions and find the one matching the ID
    fetch('/api/admin/submissions')
      .then(res => res.json())
      .then((data: Submission[]) => {
        const found = data.find(s => s.id === submissionId);
        setSubmission(found || null);
        if (!found) {
          setError('Submission not found');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching submission:', err);
        setError('Failed to load submission');
        setIsLoading(false);
      });
  }, [submissionId]);

  const handleAccept = async () => {
    if (!submission) return;
    
    const confirmed = confirm(`Are you sure you want to APPROVE "${submission.university?.name || 'this submission'}"? This will set is_approved to true in Profiles table.`);
    if (!confirmed) return;
    
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/accept`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to accept submission');
      }

      alert(`Submission has been approved successfully!`);
      router.push("/admin");
    } catch (err) {
      console.error('Error accepting submission:', err);
      alert('Failed to accept submission');
    }
  };

  const handleDecline = async () => {
    if (!submission) return;
    
    const confirmed = confirm(`Are you sure you want to REJECT "${submission.university?.name || 'this submission'}"? This will set is_approved to false in Profiles table.`);
    if (!confirmed) return;
    
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reject submission');
      }

      alert(`Submission has been rejected.`);
      router.push("/admin");
    } catch (err) {
      console.error('Error rejecting submission:', err);
      alert('Failed to reject submission');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#5C2E2E]">Loading submission details...</h1>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-600">Error</h1>
            <p className="mt-2 text-gray-700">{error}</p>
            <button
              onClick={() => router.push("/admin")}
              className="mt-4 px-6 py-2 bg-[#A84032] text-white rounded hover:bg-[#8B3528] transition-colors"
            >
              Back to Admin Dashboard
            </button>
          </div>
        </Container>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-600">Submission not found</h1>
            <button
              onClick={() => router.push("/admin")}
              className="mt-4 px-6 py-2 bg-[#A84032] text-white rounded hover:bg-[#8B3528] transition-colors"
            >
              Back to Admin Dashboard
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/admin")}
              className="text-[#5C2E2E] hover:text-[#A84032] mb-4 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-[#5C2E2E]">Submission Details</h1>
          </div>

        {/* Submission Metadata */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Submission ID</h3>
              <p className="text-lg text-gray-900 font-mono">{submission.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Submitted Date</h3>
              <p className="text-lg text-gray-900">
                {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Status</h3>
              <p className="text-lg">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                  submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* University Information */}
        {submission.university && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-[#5C2E2E] mb-6">University Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">University Name</h3>
                <p className="text-xl font-semibold text-gray-900">{submission.university.name}</p>
              </div>

              {submission.university.website && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Website</h3>
                  <p className="text-lg text-gray-900">
                    <a href={submission.university.website} target="_blank" rel="noopener noreferrer" className="text-[#A84032] hover:underline">
                      {submission.university.website}
                    </a>
                  </p>
                </div>
              )}

              {submission.university.address && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Address</h3>
                  <p className="text-lg text-gray-900">{submission.university.address}</p>
                </div>
              )}

              {submission.university.country_code && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Country Code</h3>
                  <p className="text-lg text-gray-900">{submission.university.country_code}</p>
                </div>
              )}

              {submission.university.date_of_establishment && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Date of Establishment</h3>
                  <p className="text-lg text-gray-900">
                    {new Date(submission.university.date_of_establishment).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {submission.university.dean_name && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Dean Name</h3>
                  <p className="text-lg text-gray-900">{submission.university.dean_name}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {submission.university && (submission.university.pic_name || submission.university.pic_email) && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-[#5C2E2E] mb-6">Contact Person (PIC)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submission.university.pic_name && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">PIC Name</h3>
                  <p className="text-lg text-gray-900">{submission.university.pic_name}</p>
                </div>
              )}

              {submission.university.pic_email && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">PIC Email</h3>
                  <p className="text-lg text-gray-900">
                    <a href={`mailto:${submission.university.pic_email}`} className="text-[#A84032] hover:underline">
                      {submission.university.pic_email}
                    </a>
                  </p>
                </div>
              )}

              {submission.university.pic_relation && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">PIC Relation</h3>
                  <p className="text-lg text-gray-900">{submission.university.pic_relation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evidence Documents */}
        {submission.university && (submission.university.publication_evidence_path || submission.university.asset_evidence_path || submission.university.letter_path) && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-[#5C2E2E] mb-6">Evidence Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {submission.university.publication_evidence_path && (
                <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Publication Evidence</h3>
                  <a 
                    href={submission.university.publication_evidence_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#A84032] hover:text-[#8B3528] font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Document
                  </a>
                </div>
              )}

              {submission.university.asset_evidence_path && (
                <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Asset Evidence</h3>
                  <a 
                    href={submission.university.asset_evidence_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#A84032] hover:text-[#8B3528] font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Document
                  </a>
                </div>
              )}

              {submission.university.letter_path && (
                <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Official Letter</h3>
                  <a 
                    href={submission.university.letter_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#A84032] hover:text-[#8B3528] font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questionnaire Information */}
        {submission.questionnaire && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-[#5C2E2E] mb-6">Questionnaire Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Title</h3>
                <p className="text-lg text-gray-900">{submission.questionnaire.title}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Version</h3>
                <p className="text-lg text-gray-900">{submission.questionnaire.version}</p>
              </div>

              {submission.questionnaire.description && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                  <p className="text-gray-900 leading-relaxed">{submission.questionnaire.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submitted By Information */}
        {submission.submittedBy && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-[#5C2E2E] mb-6">Submitted By</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Name</h3>
                <p className="text-lg text-gray-900">{submission.submittedBy.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Email</h3>
                <p className="text-lg text-gray-900">
                  <a href={`mailto:${submission.submittedBy.email}`} className="text-[#A84032] hover:underline">
                    {submission.submittedBy.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleDecline}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            Decline Submission
          </button>
          <button
            onClick={handleAccept}
            className="px-8 py-3 bg-[#A84032] text-white rounded-lg hover:bg-[#8B3528] transition-colors font-semibold"
          >
            Approve Submission
          </button>
        </div>

        {/* Read-only Notice */}
        <div className="mt-8 p-4 bg-[#FAF9F6] border border-[#A84032] rounded-lg">
          <p className="text-sm text-[#5C2E2E]">
            <strong>Note:</strong> This is a frontend demo with mock data. No database connection required.
            Click the action buttons above to simulate approval/decline actions.
          </p>
        </div>
        </div>
      </Container>
    </div>
  );
}

export default function SubmissionDetailPageWithGuard() {
  return (
    <AdminGuard>
      <SubmissionDetailPage />
    </AdminGuard>
  );
}
