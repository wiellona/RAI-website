"use client";

import { University } from "@/lib/types";

interface ManageRankingsProps {
    rankings: University[];
}

export default function ManageRankings({ rankings }: ManageRankingsProps) {
    // Helper function to format score display
    const formatScore = (score: number | null): string => {
        return score === null ? 'NULL' : score.toFixed(2);
    };

    // Helper function to format timestamp
    const formatTimestamp = (timestamp: string | null): string => {
        if (!timestamp) return '';
        return new Date(timestamp).toISOString().replace('T', ' ').substring(0, 19) + '+00';
    };

    // Filter universities - hanya tampilkan yang sudah memiliki semua score (tidak ada NULL)
    const filteredRankings = rankings.filter(uni => {
        const metrics = uni.metrics;
        return metrics.collaboration !== null &&
               metrics.privacy !== null &&
               metrics.accountability !== null &&
               metrics.security !== null &&
               metrics.ethicsInAI !== null &&
               metrics.fairness !== null &&
               metrics.transparency !== null &&
               metrics.continuousLearning !== null;
    });

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#5C2E2E]">University Rankings - RAI Dimensions</h2>
            <p className="text-gray-600 mb-4">
                View all university rankings across 8 Responsible AI dimensions. Only universities with complete scores are displayed.
            </p>
            {filteredRankings.length === 0 ? (
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-gray-600">No universities have completed all scoring dimensions yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-[#5C2E2E] text-white">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold">Rank</th>
                                <th className="text-left py-3 px-4 font-semibold">University</th>
                                <th className="text-center py-3 px-4 font-semibold">Details</th>
                                <th className="text-left py-3 px-4 font-semibold">Collaboration</th>
                                <th className="text-left py-3 px-4 font-semibold">Privacy</th>
                                <th className="text-left py-3 px-4 font-semibold">Accountability</th>
                                <th className="text-left py-3 px-4 font-semibold">Security</th>
                                <th className="text-left py-3 px-4 font-semibold">Ethics in AI</th>
                                <th className="text-left py-3 px-4 font-semibold">Fairness</th>
                                <th className="text-left py-3 px-4 font-semibold">Transparency</th>
                                <th className="text-left py-3 px-4 font-semibold">Continuous Learning</th>
                                <th className="text-left py-3 px-4 font-semibold">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRankings.map((uni, index) => (
                                <tr 
                                    key={uni.id} 
                                    className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#FAF9F6]`}
                                >
                                    <td className="py-3 px-4 font-medium text-[#5C2E2E]">{uni.rank}</td>
                                    <td className="py-3 px-4 font-medium text-[#5C2E2E]">{uni.name}</td>
                                    <td className="py-3 px-4 text-center">
                                        <a
                                            href={`/admin/university-answers/${uni.id}`}
                                            className="inline-block w-6 h-6 rounded-full bg-[#5C2E2E] text-white hover:bg-[#7C3E3E] flex items-center justify-center text-sm"
                                            title="View questionnaire answers"
                                        >
                                            ?
                                        </a>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                                            {formatScore(uni.metrics.collaboration)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                                            {formatScore(uni.metrics.privacy)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                                            {formatScore(uni.metrics.accountability)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                                            {formatScore(uni.metrics.security)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                                            {formatScore(uni.metrics.ethicsInAI)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                                            {formatScore(uni.metrics.fairness)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                                            {formatScore(uni.metrics.transparency)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="px-2 py-1 rounded font-medium bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]">
                                            {formatScore(uni.metrics.continuousLearning)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-gray-600">
                                        {formatTimestamp(uni.lastUpdated)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="mt-4 p-3 bg-[#FAF9F6] border border-[#A84032] rounded-lg">
                <p className="text-sm text-[#5C2E2E]">
                    <strong>Note:</strong> This displays only universities that have completed all 8 RAI (Responsible AI) dimensions: Collaboration, Privacy, Accountability, Security, Ethics in AI, Fairness, Transparency, and Continuous Learning. 
                    Universities with incomplete scoring are hidden until all dimensions are evaluated.
                </p>
                <p className="text-sm text-[#5C2E2E] mt-2">
                    <strong>Total displayed:</strong> {filteredRankings.length} of {rankings.length} universities
                </p>
            </div>
        </div>
    );
}
