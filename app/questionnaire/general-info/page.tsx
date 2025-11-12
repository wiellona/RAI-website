"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function GeneralInfoPage() {
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [formData, setFormData] = useState({
    institutionName: "",
    dateEstablishment: "",
    websiteAddress: "",
    addressLocation: "",
    directorName: "",
    picName: "",
    emailAddress: "",
    aiPublications: "",
    aiOpenSource: "",
  });

  useEffect(() => {
    // Get current user email
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      // If no user logged in, redirect to login
      router.push("/login");
      return;
    }
    setCurrentUserEmail(userEmail);

    // Load general info for this user if exists
    const generalInfoKey = `generalInfo_${userEmail}`;
    const savedInfo = localStorage.getItem(generalInfoKey);
    if (savedInfo) {
      setFormData(JSON.parse(savedInfo));
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save with user-specific key
    const generalInfoKey = `generalInfo_${currentUserEmail}`;
    localStorage.setItem(generalInfoKey, JSON.stringify(formData));
    window.location.href = "/questionnaire/criteria";
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5C2E2E] mb-4">
              Institution Responsible AI Rating
            </h1>
            <p className="text-gray-600">
              Please provide general information about your institution
            </p>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Institution Name */}
              <div>
                <label
                  htmlFor="institutionName"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Institution Name *
                </label>
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* Date of Establishment */}
              <div>
                <label
                  htmlFor="dateEstablishment"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Date of Establishment *
                </label>
                <input
                  type="date"
                  id="dateEstablishment"
                  name="dateEstablishment"
                  value={formData.dateEstablishment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* Website Address */}
              <div>
                <label
                  htmlFor="websiteAddress"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Website Address *
                </label>
                <input
                  type="url"
                  id="websiteAddress"
                  name="websiteAddress"
                  value={formData.websiteAddress}
                  onChange={handleChange}
                  placeholder="https://example.edu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* Address of Location */}
              <div>
                <label
                  htmlFor="addressLocation"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Address of Location *
                </label>
                <input
                  type="text"
                  id="addressLocation"
                  name="addressLocation"
                  value={formData.addressLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* Director Name */}
              <div>
                <label
                  htmlFor="directorName"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Director Name *
                </label>
                <input
                  type="text"
                  id="directorName"
                  name="directorName"
                  value={formData.directorName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* PiC Name */}
              <div>
                <label
                  htmlFor="picName"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  PiC Name *
                </label>
                <input
                  type="text"
                  id="picName"
                  name="picName"
                  value={formData.picName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="emailAddress"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="contact@university.edu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* Number of AI Publications */}
              <div>
                <label
                  htmlFor="aiPublications"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Number of AI publications in the last 3 years *
                </label>
                <input
                  type="number"
                  id="aiPublications"
                  name="aiPublications"
                  value={formData.aiPublications}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* Number of AI Open-Source Assets */}
              <div>
                <label
                  htmlFor="aiOpenSource"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Number of AI open-source assets (models, datasets, or tools)
                  released *
                </label>
                <input
                  type="number"
                  id="aiOpenSource"
                  name="aiOpenSource"
                  value={formData.aiOpenSource}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A84032] focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-[#A84032] hover:bg-[#8B3528] text-white font-medium py-3 rounded-md transition-colors"
                >
                  Continue to Questionnaire
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2E2E] text-white py-12 mt-20">
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
