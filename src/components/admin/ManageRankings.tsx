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

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#5C2E2E]">University Rankings - RAI Dimensions</h2>
            <p className="text-gray-600 mb-4">
                View all university rankings across 8 Responsible AI dimensions. NULL values indicate scores that haven't been calculated yet.
            </p>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-[#5C2E2E] text-white">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold">Rank</th>
                            <th className="text-left py-3 px-4 font-semibold">University</th>
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
                        {rankings.map((uni, index) => (
                            <tr 
                                key={uni.id} 
                                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#FAF9F6]`}
                            >
                                <td className="py-3 px-4 font-medium text-[#5C2E2E]">{uni.rank}</td>
                                <td className="py-3 px-4 font-medium text-[#5C2E2E]">{uni.name}</td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded font-medium ${
                                        uni.metrics.collaboration === null 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]'
                                    }`}>
                                        {formatScore(uni.metrics.collaboration)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded font-medium ${
                                        uni.metrics.privacy === null 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]'
                                    }`}>
                                        {formatScore(uni.metrics.privacy)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded font-medium ${
                                        uni.metrics.accountability === null 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]'
                                    }`}>
                                        {formatScore(uni.metrics.accountability)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded font-medium ${
                                        uni.metrics.security === null 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]'
                                    }`}>
                                        {formatScore(uni.metrics.security)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded font-medium ${
                                        uni.metrics.ethicsInAI === null 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]'
                                    }`}>
                                        {formatScore(uni.metrics.ethicsInAI)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded font-medium ${
                                        uni.metrics.fairness === null 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]'
                                    }`}>
                                        {formatScore(uni.metrics.fairness)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded font-medium ${
                                        uni.metrics.transparency === null 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]'
                                    }`}>
                                        {formatScore(uni.metrics.transparency)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded font-medium ${
                                        uni.metrics.continuousLearning === null 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032]'
                                    }`}>
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
            <div className="mt-4 p-3 bg-[#FAF9F6] border border-[#A84032] rounded-lg">
                <p className="text-sm text-[#5C2E2E]">
                    <strong>Note:</strong> This displays all 8 RAI (Responsible AI) dimensions: Collaboration, Privacy, Accountability, Security, Ethics in AI, Fairness, Transparency, and Continuous Learning. 
                    NULL values indicate dimensions that haven't been scored yet.
                </p>
            </div>
        </div>
    );
}
