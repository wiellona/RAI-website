"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApprovalActionsProps {
  universityId: string;
  universityName: string;
  isDataApproved: boolean;
}

export default function ApprovalActions({ 
  universityId, 
  universityName, 
  isDataApproved 
}: ApprovalActionsProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproval = async (approved: boolean) => {
    const action = approved ? 'approve' : 'reject';
    const confirmMessage = approved
      ? `Are you sure you want to APPROVE the data for ${universityName}? The questionnaire scores will be kept.`
      : `Are you sure you want to REJECT the data for ${universityName}? This will set ALL metrics to NULL and the university will be removed from rankings.`;

    if (!confirm(confirmMessage)) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/universities/${universityId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });

      if (!response.ok) {
        throw new Error('Failed to update approval status');
      }

      const result = await response.json();
      alert(result.message);
      router.refresh();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#5C2E2E]">Data Approval</h2>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
        <div>
          <p className="font-semibold text-[#5C2E2E]">Current Status:</p>
          <p className={`text-lg font-bold ${isDataApproved ? 'text-green-600' : 'text-red-600'}`}>
            {isDataApproved ? '✓ APPROVED' : '✗ NOT APPROVED'}
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Warning:</strong> 
          {isDataApproved 
            ? ' If you reject this data, all metrics will be set to NULL and the university will be hidden from public rankings.'
            : ' Approving this data will keep the current questionnaire scores and display the university in public rankings.'}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleApproval(true)}
          disabled={isProcessing || isDataApproved}
          className={`flex-1 py-3 px-6 rounded font-semibold transition-colors ${
            isDataApproved
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#5C2E2E] text-white hover:bg-[#7C3E3E]'
          }`}
        >
          {isProcessing ? 'Processing...' : '✓ Approve Data'}
        </button>
        
        <button
          onClick={() => handleApproval(false)}
          disabled={isProcessing || !isDataApproved}
          className={`flex-1 py-3 px-6 rounded font-semibold transition-colors ${
            !isDataApproved
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isProcessing ? 'Processing...' : '✗ Reject Data'}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note:</strong></p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Review all submission documents, crawling data, and questionnaire answers before making a decision</li>
          <li>Approved universities will appear in public rankings with their current scores</li>
          <li>Rejected universities will have all metrics set to NULL and be hidden from rankings</li>
          <li>You can change the approval status at any time</li>
        </ul>
      </div>
    </div>
  );
}