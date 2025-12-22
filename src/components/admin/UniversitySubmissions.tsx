"use client";

import { Submission } from "@/lib/types";
import Link from "next/link";

interface UniversitySubmissionsProps {
  submissions: Submission[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function UniversitySubmissions({ submissions, onAccept, onReject }: UniversitySubmissionsProps) {
  return (
    <div className="card p-6 border-2 border-[#0047AB]/20">
      <h2 className="text-2xl font-semibold mb-4 text-[#000080]">University Submissions</h2>
      <p className="text-gray-600 mb-4">Review and manage new university submissions.</p>
      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200">
              <div className="flex-1">
                <p className="font-medium text-lg">{submission.university?.name || 'Unknown University'}</p>
                {submission.university?.country_code && (
                  <p className="text-sm text-gray-500 mt-1">{submission.university.country_code}</p>
                )}
                {submission.submitted_at && (
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/submissions/${submission.id}`}
                  className="btn btn-outline text-sm px-4 py-2 border-2 border-[#0047AB] text-[#0047AB] rounded hover:bg-[#f0f4ff] transition-colors"
                >
                  View Details
                </Link>
                <button 
                  onClick={() => onAccept(submission.id)} 
                  className="btn btn-primary px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded hover:from-green-700 hover:to-green-800 transition-colors"
                >
                  Accept
                </button>
                <button 
                  onClick={() => onReject(submission.id)} 
                  className="btn btn-accent px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded hover:from-red-700 hover:to-red-800 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pending submissions.</p>
      )}
    </div>
  );
}
