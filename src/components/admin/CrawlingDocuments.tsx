"use client";

import { UniversityCrawling } from "@/lib/types";

interface CrawlingDocumentsProps {
  universityName: string;
  crawlingData: UniversityCrawling | null | undefined;
}

export default function CrawlingDocuments({ universityName, crawlingData }: CrawlingDocumentsProps) {
  return (
    <div className="card p-6 mb-6 border-2 border-[#0047AB]/20">
      <h2 className="text-2xl font-semibold mb-4 text-[#000080]">Download Crawling Documents</h2>
      {!crawlingData ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p className="text-gray-600">No crawling data found for {universityName}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {crawlingData.publications_csv_url && (
            <a
              href={crawlingData.publications_csv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border-2 border-[#0047AB]/30 rounded hover:bg-[#f0f4ff] transition-colors"
            >
              <span className="font-medium text-[#000080]">📄 Publications CSV</span>
              <span className="text-sm text-gray-600">Download</span>
            </a>
          )}
          {crawlingData.huggingface_csv_url && (
            <a
              href={crawlingData.huggingface_csv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border-2 border-[#0047AB]/30 rounded hover:bg-[#f0f4ff] transition-colors"
            >
              <span className="font-medium text-[#000080]">🤗 HuggingFace CSV</span>
              <span className="text-sm text-gray-600">Download</span>
            </a>
          )}
          {crawlingData.policies_csv_url && (
            <a
              href={crawlingData.policies_csv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border-2 border-[#0047AB]/30 rounded hover:bg-[#f0f4ff] transition-colors"
            >
              <span className="font-medium text-[#000080]">📋 Policies CSV</span>
              <span className="text-sm text-gray-600">Download</span>
            </a>
          )}
          {crawlingData.organigram_csv_url && (
            <a
              href={crawlingData.organigram_csv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border-2 border-[#0047AB]/30 rounded hover:bg-[#f0f4ff] transition-colors"
            >
              <span className="font-medium text-[#000080]">🏛️ Organigram CSV</span>
              <span className="text-sm text-gray-600">Download</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}