"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    universityName: "",
    country: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy register - save data and redirect to login
    localStorage.setItem("userEmail", formData.email);
    localStorage.setItem("universityName", formData.universityName);
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-2xl">
          {/* RAI Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center text-[#5C2E2E] mb-12">
            RAI
          </h1>

          {/* Registration Form Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#5C2E2E] mb-6">
              Register your University
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {/* University Name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="universityName"
                    className="block text-sm font-medium text-[#5C2E2E] mb-2"
                  >
                    University Name
                  </label>
                  <input
                    type="text"
                    id="universityName"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    placeholder="Enter university name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Country */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-[#5C2E2E] mb-2"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select country</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>

                {/* Contact Name */}
                <div>
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-medium text-[#5C2E2E] mb-2"
                  >
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#5C2E2E] mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@university.edu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#5C2E2E] mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#5C2E2E] mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-[#A84032] hover:bg-[#8B3528] text-white font-medium py-3 rounded-md transition-colors mt-6"
              >
                Register University
              </button>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#A84032] hover:text-[#8B3528] transition-colors font-medium"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2E2E] text-white py-8">
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
