"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    aiPublicationsFile: null as File | null,
    aiOpenSourceFile: null as File | null,
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      router.push("/login");
      return;
    }
    setCurrentUserEmail(userEmail);

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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      [fieldName]: file,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

              {/* Contact Person */}
              <div>
                <label
                  htmlFor="picName"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Contact Person *
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

              {/* AI Publications File Upload */}
              <div>
                <label className="block text-sm font-medium text-[#5C2E2E] mb-2 flex items-center gap-2">
                  AI Publications (Last 3 Years) *
                  <span className="relative group text-gray-400 hover:text-[#A84032] cursor-help transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="font-semibold mb-2">What is this?</p>
                      <p className="mb-2">
                        Upload a document listing AI-related research papers,
                        articles, or academic publications your institution has
                        produced in the last 3 years.
                      </p>
                      <p className="text-gray-300 text-xs">
                        Include: Title, DOI, Publication Year, Publication Date,
                        Cited By Count, Authors
                      </p>
                      <div className="absolute -top-2 left-8 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                    </div>
                  </span>
                </label>
                <p className="mb-3 text-sm">
                  <a
                    href="/templates/ai-publications-template.xlsx"
                    download
                    className="text-[#c5372c] hover:text-[#a42e24] underline transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Template (Spreadsheet)
                  </a>
                </p>
                {formData.aiPublicationsFile && (
                  <p className="text-sm text-green-600 mb-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formData.aiPublicationsFile.name}
                  </p>
                )}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#A84032]/50 transition-colors"
                  onClick={() =>
                    document.getElementById("aiPublicationsFile")?.click()
                  }
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    XLSX, CSV, PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
                <input
                  id="aiPublicationsFile"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "aiPublicationsFile")}
                  required
                />
              </div>

              {/* AI Open-Source Assets File Upload */}
              <div>
                <label className="block text-sm font-medium text-[#5C2E2E] mb-2 flex items-center gap-2">
                  AI Open-Source Assets *
                  <span className="relative group text-gray-400 hover:text-[#A84032] cursor-help transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="font-semibold mb-2">What is this?</p>
                      <p className="mb-2">
                        Upload a document listing AI-related open-source
                        resources your institution has released.
                      </p>
                      <ul className="list-disc list-inside mb-2 space-y-1 text-xs">
                        <li>AI models (e.g., trained neural networks)</li>
                        <li>Datasets (e.g., labeled data for training)</li>
                        <li>Tools & frameworks (e.g., libraries, APIs)</li>
                      </ul>
                      <p className="text-gray-300 text-xs">
                        Include: Name, Link, Authors
                      </p>
                      <div className="absolute -top-2 left-8 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                    </div>
                  </span>
                </label>
                <p className="mb-3 text-sm">
                  <a
                    href="/templates/ai-assets-template.xlsx"
                    download
                    className="text-[#c5372c] hover:text-[#a42e24] underline transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Template (Spreadsheet)
                  </a>
                </p>
                {formData.aiOpenSourceFile && (
                  <p className="text-sm text-green-600 mb-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formData.aiOpenSourceFile.name}
                  </p>
                )}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#A84032]/50 transition-colors"
                  onClick={() =>
                    document.getElementById("aiOpenSourceFile")?.click()
                  }
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    XLSX, CSV, PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
                <input
                  id="aiOpenSourceFile"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "aiOpenSourceFile")}
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

      <Footer />
    </div>
  );
}
