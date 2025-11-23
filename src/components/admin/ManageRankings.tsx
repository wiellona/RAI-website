"use client";

import { University } from "@/lib/types";

interface ManageRankingsProps {
    rankings: University[];
}

export default function ManageRankings({ rankings }: ManageRankingsProps) {
    return (
        <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">University Rankings</h2>
            <p className="text-gray-600 mb-4">
                View all university rankings and metrics. This is a read-only view displaying data from the database.
            </p>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">University</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Transparency</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Auditability</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Data Privacy</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Policy Maturity</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Trust Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map((uni, index) => (
                            <tr 
                                key={uni.id} 
                                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                            >
                                <td className="py-3 px-4 font-medium">{uni.rank}</td>
                                <td className="py-3 px-4 font-medium">{uni.name}</td>
                                <td className="py-3 px-4 text-gray-600">{uni.country}</td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-1 bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032] rounded font-medium">
                                        {uni.metrics.transparency}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-1 bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032] rounded font-medium">
                                        {uni.metrics.auditability}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-1 bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032] rounded font-medium">
                                        {uni.metrics.dataPrivacy}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-1 bg-[#FAF9F6] text-[#5C2E2E] border border-[#A84032] rounded font-medium">
                                        {uni.metrics.policyMaturity}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="px-3 py-1 bg-[#5C2E2E] text-white rounded-full font-bold">
                                        {uni.trustScore}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 p-3 bg-[#FAF9F6] border border-[#A84032] rounded-lg">
                <p className="text-sm text-[#5C2E2E]">
                    <strong>Note:</strong> This data is read-only and fetched directly from the database. 
                    Rankings are automatically calculated based on university metrics.
                </p>
            </div>
        </div>
    );
}
