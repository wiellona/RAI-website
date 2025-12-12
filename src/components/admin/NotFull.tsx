"use client";

import { University } from "@/lib/types";

interface NotFullProps {
    rankings: University[];
}

export default function NotFull({ rankings }: NotFullProps) {
    // Helper function to format score display
    const formatScore = (score: number | null): string => {
        return score === null ? 'NULL' : score.toFixed(2);
    };

    // Helper function to format timestamp
    const formatTimestamp = (timestamp: string | null): string => {
        if (!timestamp) return '';
        return new Date(timestamp).toISOString().replace('T', ' ').substring(0, 19) + '+00';
    };

    // Filter universities - hanya tampilkan yang memiliki score tidak lengkap (ada yang NULL)
    const incompleteRankings = rankings.filter(uni => {
        const metrics = uni.metrics;
        return metrics.collaboration === null ||
               metrics.privacy === null ||
               metrics.accountability === null ||
               metrics.security === null ||
               metrics.ethicsInAI === null ||
               metrics.fairness === null ||
               metrics.transparency === null ||
               metrics.continuousLearning === null;
    });

    return (
        <div className="card p-6 border-2 border-[#0047AB]/20">
            <h2 className="text-2xl font-semibold mb-4 text-[#000080]">Incomplete Universities - Pending Completion</h2>
            <p className="text-gray-600 mb-4">
                Universities that have not completed all 8 RAI dimensions. These will be hidden from public rankings until all scores are available.
            </p>
            {incompleteRankings.length === 0 ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-700">✓ All universities have completed their scoring dimensions!</p>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gradient-to-r from-[#000080] to-[#0047AB] text-white">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold">University</th>
                                <th className="text-center py-3 px-4 font-semibold">Details</th>
                                <th className="text-left py-3 px-4 font-semibold">Ethics in AI</th>
                                <th className="text-left py-3 px-4 font-semibold">Fairness</th>
                                <th className="text-left py-3 px-4 font-semibold">Transparency</th>
                                <th className="text-left py-3 px-4 font-semibold">Accountability</th>
                                <th className="text-left py-3 px-4 font-semibold">Privacy</th>
                                <th className="text-left py-3 px-4 font-semibold">Security</th>
                                <th className="text-left py-3 px-4 font-semibold">Continuous Learning</th>
                                <th className="text-left py-3 px-4 font-semibold">Collaboration</th>
                                <th className="text-left py-3 px-4 font-semibold">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incompleteRankings.map((uni, index) => (
                                <tr 
                                    key={uni.id} 
                                    className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#f0f4ff]`}
                                >
                                    <td className="py-3 px-4 font-medium text-[#000080]">{uni.name}</td>
                                    <td className="py-3 px-4 text-center">
                                        <a
                                            href={`/admin/university-answers/${uni.id}`}
                                            className="inline-block w-6 h-6 rounded-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] text-white hover:from-[#0099ED] hover:to-[#0047AB] flex items-center justify-center text-sm"
                                            title="View questionnaire answers"
                                        >
                                            ?
                                        </a>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded font-medium ${
                                            uni.metrics.ethicsInAI === null 
                                                ? 'bg-gray-100 text-gray-500 border border-gray-300' 
                                                : 'bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30'
                                        }`}>
                                            {formatScore(uni.metrics.ethicsInAI)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded font-medium ${
                                            uni.metrics.fairness === null 
                                                ? 'bg-gray-100 text-gray-500 border border-gray-300' 
                                                : 'bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30'
                                        }`}>
                                            {formatScore(uni.metrics.fairness)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded font-medium ${
                                            uni.metrics.transparency === null 
                                                ? 'bg-gray-100 text-gray-500 border border-gray-300' 
                                                : 'bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30'
                                        }`}>
                                            {formatScore(uni.metrics.transparency)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded font-medium ${
                                            uni.metrics.accountability === null 
                                                ? 'bg-gray-100 text-gray-500 border border-gray-300' 
                                                : 'bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30'
                                        }`}>
                                            {formatScore(uni.metrics.accountability)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded font-medium ${
                                            uni.metrics.privacy === null 
                                                ? 'bg-gray-100 text-gray-500 border border-gray-300' 
                                                : 'bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30'
                                        }`}>
                                            {formatScore(uni.metrics.privacy)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded font-medium ${
                                            uni.metrics.security === null 
                                                ? 'bg-gray-100 text-gray-500 border border-gray-300' 
                                                : 'bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30'
                                        }`}>
                                            {formatScore(uni.metrics.security)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded font-medium ${
                                            uni.metrics.continuousLearning === null 
                                                ? 'bg-gray-100 text-gray-500 border border-gray-300' 
                                                : 'bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30'
                                        }`}>
                                            {formatScore(uni.metrics.continuousLearning)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded font-medium ${
                                            uni.metrics.collaboration === null 
                                                ? 'bg-gray-100 text-gray-500 border border-gray-300' 
                                                : 'bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30'
                                        }`}>
                                            {formatScore(uni.metrics.collaboration)}
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
            <div className="mt-4 p-3 bg-gradient-to-r from-[#f0f4ff] to-white border-2 border-[#0047AB]/30 rounded-lg">
                <p className="text-sm text-[#000080]">
                    <strong>Status Legend:</strong>
                    <span className="ml-2 inline-block px-2 py-1 bg-gray-100 text-gray-500 border border-gray-300 rounded text-xs">NULL</span> = Not yet scored
                    <span className="ml-2 inline-block px-2 py-1 bg-gradient-to-r from-[#f0f4ff] to-white text-[#000080] border-2 border-[#0047AB]/30 rounded text-xs">Score</span> = Completed
                </p>
                <p className="text-sm text-[#000080] mt-2">
                    <strong>Total incomplete:</strong> {incompleteRankings.length} of {rankings.length} universities
                </p>
            </div>
        </div>
    );
}