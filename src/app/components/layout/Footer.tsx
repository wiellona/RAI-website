import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] text-white py-16 border-t-4 border-[#0099ED] shadow-2xl">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          {/* Left - Branding */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#0047AB] to-[#0099ED] rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"></div>
              <span className="font-bold text-[24px] tracking-[0.6px]">
                RAI
              </span>
            </div>
            <p className="text-[14px] text-white/90 font-medium">
              Responsible AI Global University Ranking
            </p>
          </div>

          {/* Right - Contact & Social */}
          <div className="text-left md:text-right">
            <p className="text-[14px] text-white/90 mb-2 font-medium">
              Contact: info@rai-ranking.org
            </p>
            <div className="flex gap-4 md:justify-end">
              <Link
                href="#"
                className="text-[14px] text-white/80 hover:text-[#0099ED] transition-colors duration-300 font-medium"
              >
                Twitter/X
              </Link>
              <Link
                href="#"
                className="text-[14px] text-white/80 hover:text-[#0099ED] transition-colors duration-300 font-medium"
              >
                LinkedIn
              </Link>
              <Link
                href="#"
                className="text-[14px] text-white/80 hover:text-[#0099ED] transition-colors duration-300 font-medium"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[#0099ED]/30">
          <p className="text-[12px] text-white/70">
            © 2025 RAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
