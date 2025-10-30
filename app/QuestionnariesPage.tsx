"use client";

import Link from "next/link";
import { useState } from "react";

export default function QuizPage() {
    const [currentSection, setCurrentSection] = useState(1);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [likertValue, setLikertValue] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);

    const sections = [
        { id: 1, title: "1. Governance & Policy" },
        { id: 2, title: "2. Infrastructure & Data" },
        { id: 3, title: "3. Curriculum & Research" },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/60 border-b border-black/10">
                <div className="max-w-[1400px] mx-auto px-8 h-[65px] flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#511715] rounded"></div>
                        <span className="font-bold text-[20px] text-[#511715] tracking-[0.5px]">
                            RAI
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-8">
                        <Link
                            href="#about"
                            className="font-medium text-[14px] text-black hover:text-[#511715] transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="#ranking"
                            className="font-medium text-[14px] text-black hover:text-[#511715] transition-colors"
                        >
                            The Ranking
                        </Link>
                        <Link
                            href="#participate"
                            className="font-medium text-[14px] text-black hover:text-[#511715] transition-colors"
                        >
                            Participate
                        </Link>
                        <button className="bg-[#c5372c] hover:bg-[#a42e24] text-white font-medium text-[14px] px-6 h-[40px] rounded-md transition-colors">
                            Login
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-[65px]">
                <div className="max-w-[1400px] mx-auto px-8 py-8">
                    {/* Top Info Bar */}
                    <div className="flex items-end justify-between mb-12">
                        {/* University Name */}
                        <div>
                            <p className="text-[14px] text-black/70 mb-1">
                                University
                            </p>
                            <h1 className="font-bold text-[20px] text-[#511715]">
                                Example University
                            </h1>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 mx-16">
                            <div className="flex items-end justify-between mb-2">
                                <p className="text-[14px] text-black/70">
                                    Completion
                                </p>
                                <p className="text-[14px] text-black/70">
                                    {progress} %
                                </p>
                            </div>
                            <div className="w-full h-4 bg-[#f3d5d3] rounded-full overflow-hidden">
                                <div className="h-full bg-[#c5372c] transition-all duration-300"></div>
                            </div>
                        </div>

                        {/* Save and Exit Button */}
                        <button className="bg-white border border-[#c5372c] text-[#c5372c] font-medium text-[14px] px-6 h-[40px] rounded-md hover:bg-[#c5372c]/5 transition-colors">
                            Save and Exit
                        </button>
                    </div>

                    <div className="flex gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="w-[280px] flex-shrink-0">
                            <nav className="border border-[#ded1cf] rounded-lg p-3">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() =>
                                            setCurrentSection(section.id)
                                        }
                                        className={`w-full text-left px-3 py-2 rounded-md font-medium text-[14px] mb-1 transition-colors ${
                                            currentSection === section.id
                                                ? "bg-[#c5372c]/10 text-[#c5372c]"
                                                : "text-black hover:bg-gray-50"
                                        }`}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            {/* Section Title */}
                            <h2 className="font-bold text-[24px] text-[#511715] mb-8">
                                1. Governance & Policy
                            </h2>

                            {/* Question 1: Multiple Choice */}
                            <div className="border border-[#ded1cf] rounded-lg p-6 mb-6">
                                <h3 className="font-semibold text-[16px] text-black mb-6">
                                    Does your university have a formal
                                    Responsible AI policy?
                                </h3>

                                <div className="space-y-3 mb-6">
                                    {[
                                        "Yes, institution-wide",
                                        "Yes, at department level",
                                        "In progress",
                                        "No",
                                    ].map((option) => (
                                        <label
                                            key={option}
                                            className="flex items-center gap-3 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="policy"
                                                value={option}
                                                checked={
                                                    selectedOption === option
                                                }
                                                onChange={(e) =>
                                                    setSelectedOption(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-5 h-5 text-[#c5372c] accent-[#c5372c]"
                                            />
                                            <span className="text-[14px] text-black">
                                                {option}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {/* Evidence Upload */}
                                <div>
                                    <p className="font-medium text-[14px] text-black mb-3">
                                        Evidence Upload
                                    </p>
                                    <div className="border-2 border-dashed border-[#ded1cf] rounded-lg h-[92px] flex flex-col items-center justify-center cursor-pointer hover:border-[#c5372c]/50 transition-colors">
                                        <p className="text-[16px] text-[#c5372c] mb-1">
                                            + Upload Document
                                        </p>
                                        <p className="text-[12px] text-black/70">
                                            Drag and drop or click to upload
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Question 2: Likert Scale */}
                            <div className="border border-[#ded1cf] rounded-lg p-6 mb-6">
                                <h3 className="font-semibold text-[16px] text-black mb-6">
                                    Our governance structure effectively
                                    oversees AI ethics across the institution.
                                </h3>

                                {/* Scale Labels */}
                                <div className="flex justify-between mb-4">
                                    <p className="text-[12px] text-black/70">
                                        Strongly Disagree
                                    </p>
                                    <p className="text-[12px] text-black/70">
                                        Strongly Agree
                                    </p>
                                </div>

                                {/* Likert Scale Buttons */}
                                <div className="grid grid-cols-5 gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() =>
                                                setLikertValue(value)
                                            }
                                            className={`h-[40px] rounded-md font-normal text-[14px] text-black transition-all ${
                                                likertValue === value
                                                    ? "border-2 border-[#c5372c] bg-[#c5372c]/5"
                                                    : "border border-gray-300 hover:border-[#c5372c]/50"
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>

                                {/* Evidence Upload */}
                                <div>
                                    <p className="font-medium text-[14px] text-black mb-3">
                                        Evidence Upload
                                    </p>
                                    <div className="border-2 border-dashed border-[#ded1cf] rounded-lg h-[92px] flex flex-col items-center justify-center cursor-pointer hover:border-[#c5372c]/50 transition-colors">
                                        <p className="text-[16px] text-[#c5372c] mb-1">
                                            + Upload Document
                                        </p>
                                        <p className="text-[12px] text-black/70">
                                            Drag and drop or click to upload
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center mt-8">
                                <button
                                    className="bg-white border border-transparent text-black font-medium text-[14px] px-6 h-[40px] rounded-md hover:border-gray-300 transition-colors disabled:opacity-50"
                                    disabled={currentSection === 1}
                                >
                                    Back
                                </button>
                                <button className="bg-[#c5372c] hover:bg-[#a42e24] text-white font-medium text-[14px] px-8 h-[40px] rounded-md transition-colors">
                                    Next Section
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#511715] text-white py-16 mt-20">
                <div className="max-w-[1400px] mx-auto px-8">
                    <div className="flex justify-between items-start mb-12">
                        {/* Left - Branding */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-white/20 rounded"></div>
                                <span className="font-bold text-[24px] tracking-[0.6px]">
                                    RAI
                                </span>
                            </div>
                            <p className="text-[14px] text-white/80">
                                Responsible AI Global University Ranking
                            </p>
                        </div>

                        {/* Right - Contact & Social */}
                        <div className="text-right">
                            <p className="text-[14px] text-white/80 mb-2">
                                Contact: info@rai-ranking.org
                            </p>
                            <div className="flex gap-4 justify-end">
                                <Link
                                    href="#"
                                    className="text-[14px] text-white/80 hover:text-white transition-colors"
                                >
                                    Twitter/X
                                </Link>
                                <Link
                                    href="#"
                                    className="text-[14px] text-white/80 hover:text-white transition-colors"
                                >
                                    LinkedIn
                                </Link>
                                <Link
                                    href="#"
                                    className="text-[14px] text-white/80 hover:text-white transition-colors"
                                >
                                    GitHub
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-6 border-t border-white/20">
                        <p className="text-[12px] text-white/70">
                            © 2025 RAI. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}