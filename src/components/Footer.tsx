import Image from "next/image";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[var(--footer-bg)] py-12 text-white">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logoRAI.png"
                alt="RAI Logo"
                width={256}
                height={256}
                className="rounded"
              />
            </div>
            <p className="text-white/70 text-sm max-w-md">
              Responsible AI Global University Ranking
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-white/70 text-sm">info@ai-ranking.org</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Links</h3>
              <div className="flex flex-col gap-1 text-sm text-white/70">
                <a href="#" className="hover:text-white">Twitter/X</a>
                <a href="#" className="hover:text-white">LinkedIn</a>
                <a href="#" className="hover:text-white">GitHub</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-sm text-white/60">
          © {new Date().getFullYear()} RAI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
