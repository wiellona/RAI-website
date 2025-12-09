"use client";

import { useState } from "react";

interface ProcessScoresProps {
    onProcess: () => Promise<{success: boolean, message: string}>;
}

export default function ProcessScores({ onProcess }: ProcessScoresProps) {
    const [status, setStatus] = useState("Idle");
    const [isLoading, setIsLoading] = useState(false);

    const handleProcess = async () => {
        setIsLoading(true);
        setStatus("Processing...");
        const result = await onProcess();
        setStatus(result.message);
        setIsLoading(false);
    };

    return (
    <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Process Scores</h2>
            <p className="text-gray-600 mb-4">Process scores from AI Scraper and user forms.</p>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleProcess}
                    disabled={isLoading}
                    className="btn btn-primary"
                >
                    {isLoading ? "Processing..." : "Start Score Processing"}
                </button>
                <p className="text-sm text-gray-500">Status: {status}</p>
            </div>
        </div>
    );
}
