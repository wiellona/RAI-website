import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RAI - Responsible AI Global University Ranking",
  description: "Setting the Global Standard for Responsible AI in Academia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
