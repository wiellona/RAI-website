'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/60 border-b border-black/10">
            <div className="max-w-[1400px] mx-auto px-8 h-[65px] flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#511715] rounded"></div>
                    <span className="font-bold text-[20px] text-[#511715] tracking-[0.5px]">
                        RAI
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-8">
                    <Link
                        href="/"
                        className="font-medium text-[14px] text-black hover:text-[#511715] transition-colors"
                    >
                        Home
                    </Link>
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
                        href="/registration"
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
    );
}