"use client";

import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";

export default function SubmissionPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#5C2E2E] mb-6">
              Submission Successful!
            </h1>

            {/* Message */}
            <p className="text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed">
              Thank you. Your university's questionnaire has been successfully
              submitted and is now pending review. You will be notified via
              email once the review process is complete. You can monitor the
              status of your submission from your university dashboard.
            </p>

            {/* Return Button */}
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#A84032] hover:bg-[#8B3528] text-white font-medium px-8 py-3 rounded-md transition-colors"
            >
              Return to Home
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{" "}
              <a
                href="mailto:info@rai-ranking.org"
                className="text-[#A84032] hover:underline"
              >
                info@rai-ranking.org
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2E2E] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded"></div>
                <span className="text-xl font-bold">RAI</span>
              </div>
              <p className="text-sm text-white/80">
                Responsible AI Global University Ranking
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm">Contact: info@rai-ranking.org</p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="hover:text-white/80 transition-colors">
                  Twitter/X
                </a>
                <a href="#" className="hover:text-white/80 transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-white/80 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-sm text-white/60 text-center md:text-left">
              © 2025 RAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
