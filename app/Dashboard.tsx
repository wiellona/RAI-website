import Image from "next/image";
import Link from "next/link";

export default function RaiLandingPage() {
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

            {/* Hero Section */}
            <section className="relative pt-[65px]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 top-[65px] h-[544px]">
                    <div className="absolute inset-0 bg-gray-200">
                        {/* Placeholder for background image */}
                    </div>
                    <div className="absolute inset-0 bg-white/70"></div>
                </div>

                {/* Hero Content */}
                <div className="relative max-w-[1400px] mx-auto px-8 pt-24 pb-32">
                    <div className="max-w-[887px]">
                        <h1 className="font-bold text-[60px] leading-[60px] text-[#511715] mb-8">
                            Setting the Global Standard for Responsible AI in
                            Academia.
                        </h1>
                        <p className="font-normal text-[20px] leading-[28px] text-black/80 mb-12 max-w-[762px]">
                            An independent framework to assess, benchmark, and
                            guide universities in the ethical implementation of
                            artificial intelligence.
                        </p>
                        <div className="flex items-center gap-6">
                            <button className="bg-[#c5372c] hover:bg-[#a42e24] text-white font-medium text-[14px] px-8 h-[48px] rounded-md flex items-center gap-2 transition-colors">
                                Explore the 2025 Ranking
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </button>
                            <Link
                                href="#participate"
                                className="text-[#c5372c] hover:text-[#a42e24] font-normal text-[16px] transition-colors"
                            >
                                Participate
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="max-w-[1400px] mx-auto px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div>
                        <h2 className="font-bold text-[30px] leading-[36px] text-[#511715] mb-8">
                            Our Mission
                        </h2>
                        <p className="font-normal text-[16px] leading-[26px] text-black/80">
                            RAI (Responsible AI Global University Ranking)
                            provides an authoritative, transparent, and rigorous
                            assessment of how universities develop and deploy AI
                            responsibly. We empower administrators, researchers,
                            and the public with credible benchmarks and
                            actionable insights.
                        </p>
                    </div>

                    {/* Right Column - Stats Card */}
                    <div className="bg-[#f3d5d3] border border-[#ded1cf] rounded-lg p-8">
                        <p className="font-semibold text-[20px] leading-[28px] text-[#511715] mb-8">
                            &quot;What gets measured, gets improved. RAI sets
                            the standard for ethics in academic AI.&quot;
                        </p>
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="font-bold text-[30px] leading-[36px] text-[#511715]">
                                    150+
                                </p>
                                <p className="font-normal text-[14px] leading-[20px] text-black/70 mt-2">
                                    Institutions
                                </p>
                            </div>
                            <div>
                                <p className="font-bold text-[30px] leading-[36px] text-[#511715]">
                                    30
                                </p>
                                <p className="font-normal text-[14px] leading-[20px] text-black/70 mt-2">
                                    Countries
                                </p>
                            </div>
                            <div>
                                <p className="font-bold text-[30px] leading-[36px] text-[#511715]">
                                    2025
                                </p>
                                <p className="font-normal text-[14px] leading-[20px] text-black/70 mt-2">
                                    Latest Edition
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="max-w-[1400px] mx-auto px-8 py-20">
                <h2 className="font-bold text-[40px] leading-[36px] text-[#511715] text-center mb-16">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="border border-[#ded1cf] rounded-lg p-8">
                        <div className="w-12 h-12 bg-[#c5372c]/10 rounded-md flex items-center justify-center mb-8">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#c5372c"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" x2="12" y1="15" y2="3" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-[20px] leading-[28px] text-[#511715] mb-4">
                            1. Submit Data
                        </h3>
                        <p className="font-normal text-[16px] leading-[24px] text-black/80">
                            Universities provide standardized information and
                            evidence across key domains.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="border border-[#ded1cf] rounded-lg p-8">
                        <div className="w-12 h-12 bg-[#c5372c]/10 rounded-md flex items-center justify-center mb-8">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#c5372c"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-[20px] leading-[28px] text-[#511715] mb-4">
                            2. Independent Assessment
                        </h3>
                        <p className="font-normal text-[16px] leading-[24px] text-black/80">
                            Our methodology evaluates governance,
                            infrastructure, curriculum, research, and impact.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="border border-[#ded1cf] rounded-lg p-8">
                        <div className="w-12 h-12 bg-[#c5372c]/10 rounded-md flex items-center justify-center mb-8">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#c5372c"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-[20px] leading-[28px] text-[#511715] mb-4">
                            3. Receive Your Score & Insights
                        </h3>
                        <p className="font-normal text-[16px] leading-[24px] text-black/80">
                            Access detailed feedback, benchmarking, and guidance
                            to improve responsible AI practice.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#511715] text-white py-16">
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