import Image from "next/image";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] py-12 text-white shadow-2xl border-t-4 border-[#0099ED]">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logoRAI.png"
                alt="RAI Logo"
                width={256}
                height={256}
                className="rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-white/90 text-sm max-w-md font-medium">
              Responsible AI Global University Ranking
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h3 className="font-bold mb-2 text-[#0099ED]">Contact</h3>
              <p className="text-white/80 text-sm">info@ai-ranking.org</p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-[#0099ED]">Links</h3>
              <div className="flex flex-col gap-1 text-sm text-white/80">
                <a
                  href="#"
                  className="hover:text-[#0099ED] transition-colors duration-300"
                >
                  Twitter/X
                </a>
                <a
                  href="#"
                  className="hover:text-[#0099ED] transition-colors duration-300"
                >
                  LinkedIn
                </a>
                <a
                  href="#"
                  className="hover:text-[#0099ED] transition-colors duration-300"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[#0099ED]/30 text-sm text-white/70">
          © {new Date().getFullYear()} RAI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
