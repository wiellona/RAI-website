"use client";

import { University } from "@/lib/types";
import { useMemo, useState } from "react";

interface ManageRankingsProps {
    rankings: University[];
    onUpdateScore: (id: string, score: number) => void;
    onUpdateMetrics?: (id: string, metrics: { transparency: number; auditability: number; dataPrivacy: number; policyMaturity: number }) => void;
}

export default function ManageRankings({ rankings, onUpdateScore, onUpdateMetrics }: ManageRankingsProps) {
    const [metrics, setMetrics] = useState<Record<string, { transparency: number; auditability: number; dataPrivacy: number; policyMaturity: number }>>(() =>
        Object.fromEntries(
            rankings.map(r => [r.id, { ...r.metrics }])
        )
    );

    const computedTrustScore: Record<string, number> = useMemo(() => {
        const out: Record<string, number> = {};
        for (const id of Object.keys(metrics)) {
            const m = metrics[id];
            out[id] = Math.round((m.transparency + m.auditability + m.dataPrivacy + m.policyMaturity) / 4);
        }
        return out;
    }, [metrics]);

    const handleMetricChange = (id: string, field: keyof (typeof metrics)[string], value: string) => {
        const v = Math.max(0, Math.min(100, Number(value)));
        setMetrics(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: v }
        }));
    };

    return (
    <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Manage Rankings</h2>
            <p className="text-gray-600 mb-4">Manually adjust university metrics; trust score is auto-calculated as the average.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-2 px-4">Rank</th>
                            <th className="text-left py-2 px-4">University</th>
                            <th className="text-left py-2 px-4">Transparency</th>
                            <th className="text-left py-2 px-4">Auditability</th>
                            <th className="text-left py-2 px-4">Data Privacy</th>
                            <th className="text-left py-2 px-4">Policy Maturity</th>
                            <th className="text-left py-2 px-4">Trust Score</th>
                            <th className="text-left py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map(uni => (
                            <tr key={uni.id} className="border-b">
                                <td className="py-2 px-4">{uni.rank}</td>
                                <td className="py-2 px-4">{uni.name}</td>
                                <td className="py-2 px-4">
                                    <input
                                        type="number"
                                        value={metrics[uni.id]?.transparency ?? ''}
                                        onChange={(e) => handleMetricChange(uni.id, 'transparency', e.target.value)}
                                        className="w-24 border border-gray-300 rounded p-1"
                                        min={0}
                                        max={100}
                                    />
                                </td>
                                <td className="py-2 px-4">
                                    <input
                                        type="number"
                                        value={metrics[uni.id]?.auditability ?? ''}
                                        onChange={(e) => handleMetricChange(uni.id, 'auditability', e.target.value)}
                                        className="w-24 border border-gray-300 rounded p-1"
                                        min={0}
                                        max={100}
                                    />
                                </td>
                                <td className="py-2 px-4">
                                    <input
                                        type="number"
                                        value={metrics[uni.id]?.dataPrivacy ?? ''}
                                        onChange={(e) => handleMetricChange(uni.id, 'dataPrivacy', e.target.value)}
                                        className="w-24 border border-gray-300 rounded p-1"
                                        min={0}
                                        max={100}
                                    />
                                </td>
                                <td className="py-2 px-4">
                                    <input
                                        type="number"
                                        value={metrics[uni.id]?.policyMaturity ?? ''}
                                        onChange={(e) => handleMetricChange(uni.id, 'policyMaturity', e.target.value)}
                                        className="w-24 border border-gray-300 rounded p-1"
                                        min={0}
                                        max={100}
                                    />
                                </td>
                                <td className="py-2 px-4 font-semibold">{computedTrustScore[uni.id] ?? uni.trustScore}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => {
                                            onUpdateScore(uni.id, computedTrustScore[uni.id]);
                                            onUpdateMetrics?.(uni.id, metrics[uni.id]);
                                        }}
                                        className="btn btn-outline"
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
