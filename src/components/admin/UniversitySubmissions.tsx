"use client";

import { Submission } from "@/lib/types";

interface UniversitySubmissionsProps {
  submissions: Submission[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function UniversitySubmissions({ submissions, onAccept, onReject }: UniversitySubmissionsProps) {
  return (
  <div className="card p-6">
      <h2 className="text-2xl font-semibold mb-4">University Submissions</h2>
      <p className="text-gray-600 mb-4">Accept or reject new university submissions.</p>
      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <p className="font-medium">{submission.name}</p>
              <div className="flex gap-2">
                <button onClick={() => onAccept(submission.id)} className="btn btn-primary">Accept</button>
                <button onClick={() => onReject(submission.id)} className="btn btn-accent">Reject</button>
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
