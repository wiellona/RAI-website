"use client";

interface SubmissionDocumentsProps {
  universityName: string;
  letterPath: string | null;
  assetEvidencePath: string | null;
  publicationEvidencePath: string | null;
}

export default function SubmissionDocuments({
  universityName,
  letterPath,
  assetEvidencePath,
  publicationEvidencePath
}: SubmissionDocumentsProps) {
  const hasAnyDocument = letterPath || assetEvidencePath || publicationEvidencePath;

  return (
    <div className="card p-6 mb-6 border-2 border-[#0047AB]/20">
      <h2 className="text-2xl font-semibold mb-4 text-[#000080]">Submission Documents</h2>
      {!hasAnyDocument ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No submission documents found for {universityName}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {letterPath && (
            <a
              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/evidence_uploads/${letterPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border-2 border-[#0047AB]/30 rounded hover:bg-[#f0f4ff] transition-colors"
            >
              <span className="font-medium text-[#000080]">📄 Official Request Letter</span>
              <span className="text-sm text-gray-600">Download</span>
            </a>
          )}
          {assetEvidencePath && (
            <a
              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/evidence_uploads/${assetEvidencePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border-2 border-[#0047AB]/30 rounded hover:bg-[#f0f4ff] transition-colors"
            >
              <span className="font-medium text-[#000080]">💼 Asset Evidence</span>
              <span className="text-sm text-gray-600">Download</span>
            </a>
          )}
          {publicationEvidencePath && (
            <a
              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/evidence_uploads/${publicationEvidencePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border-2 border-[#0047AB]/30 rounded hover:bg-[#f0f4ff] transition-colors"
            >
              <span className="font-medium text-[#000080]">📚 Publication Evidence</span>
              <span className="text-sm text-gray-600">Download</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}