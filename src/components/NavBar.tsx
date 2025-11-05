"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const auth = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--background) shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logoRAI.png"
              alt="RAI Logo"
              width={148}
              height={148}
              className="rounded"
            />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-[var(--foreground)] hover:text-[var(--accent)]">
              Home
            </Link>
            <Link href="/methodology" className="text-[var(--foreground)] hover:text-[var(--accent)]">
              Methodology
            </Link>
            <Link href="/about" className="text-[var(--foreground)] hover:text-[var(--accent)]">
              About
            </Link>
            {auth.user && auth.user.role === 'admin' && (
              <Link href="/admin" className="btn btn-outline text-sm">
                Admin
              </Link>
            )}

            {auth.isLoading ? null : auth.user ? (
              <>
                <span className="text-sm">Welcome, {auth.user.name}</span>
                <button onClick={auth.logout} className="btn btn-accent text-sm">Logout</button>
              </>
            ) : (
              <Link href="/login" className="btn btn-accent text-sm">
                Login
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}