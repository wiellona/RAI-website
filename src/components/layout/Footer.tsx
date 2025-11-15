import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#511715] text-white py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          {/* Left - Branding */}
          <div className="mb-8 md:mb-0">
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
          <div className="text-left md:text-right">
            <p className="text-[14px] text-white/80 mb-2">
              Contact: info@rai-ranking.org
            </p>
            <div className="flex gap-4 md:justify-end">
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
  );
}
