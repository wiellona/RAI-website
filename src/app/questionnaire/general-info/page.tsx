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
    aiPublications: "",
    aiOpenSource: "",
    aiPublicationsFile: null,
    aiOpenSourceFile: null,
  });

  // State untuk menampilkan nama file yang diupload
  const [fileNames, setFileNames] = useState({
    aiPublicationsFileName: "",
    aiOpenSourceFileName: "",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      [fieldName]: file,
    });

    // Update state dengan nama file yang diupload
    if (file) {
      if (fieldName === "aiPublicationsFile") {
        setFileNames((prev) => ({ ...prev, aiPublicationsFileName: file.name }));
      } else if (fieldName === "aiOpenSourceFile") {
        setFileNames((prev) => ({ ...prev, aiOpenSourceFileName: file.name }));
      }
    }
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

              {/* AI Publications File */}
              <div>
                <label className="block text-sm font-medium text-[#5C2E2E] mb-2">
                  Upload AI Publications File Statement
                </label>
                  <p className="mb-2 text-sm">
                    <a
                      href="https://mibkispkzpazmcyhftmv.supabase.co/storage/v1/object/public/Open%20Source%20Statement%20Letter/Open%20Source%20Statement%20Letter.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c5372c] hover:text-[#a42e24] underline transition-colors duration-200"
                    >
                      For template example, click here
                    </a>
                  </p>
                {fileNames.aiPublicationsFileName && (
                  <p className="text-sm text-gray-600">
                    Uploaded File: {fileNames.aiPublicationsFileName}
                  </p>
                )}
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-[#CD5C5C] focus-within:border-[#CD5C5C]"
                  onClick={() => {
                    const fileInput = document.getElementById("aiPublicationsFile") as HTMLInputElement;
                    fileInput?.click();
                  }}
                >
                  <div className="space-y-1 text-center">
                    {/* SVG icon */}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span>Upload a file</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>
                <input
                  id="aiPublicationsFile"
                  name="aiPublicationsFile"
                  type="file"
                  className="sr-only"
                  onChange={(e) => handleFileChange(e, "aiPublicationsFile")}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>

              {/* AI Open Source File */}
              <div>
                <label className="block text-sm font-medium text-[#5C2E2E] mb-2">
                  Upload AI Open-Source Assets File Statement
                </label>
                  <p className="mb-2 text-sm">
                    <a
                      href="https://mibkispkzpazmcyhftmv.supabase.co/storage/v1/object/public/Open%20Source%20Statement%20Letter/Open%20Source%20Statement%20Letter.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c5372c] hover:text-[#a42e24] underline transition-colors duration-200"
                    >
                      For template example, click here
                    </a>
                  </p>
                {fileNames.aiOpenSourceFileName && (
                  <p className="text-sm text-gray-600">
                    Uploaded File: {fileNames.aiOpenSourceFileName}
                  </p>
                )}
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-[#CD5C5C] focus-within:border-[#CD5C5C]"
                  onClick={() => {
                    const fileInput = document.getElementById("aiOpenSourceFile") as HTMLInputElement;
                    fileInput?.click();
                  }}
                >
                  <div className="space-y-1 text-center">
                    {/* SVG icon */}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span>Upload a file</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>
                <input
                  id="aiOpenSourceFile"
                  name="aiOpenSourceFile"
                  type="file"
                  className="sr-only"
                  onChange={(e) => handleFileChange(e, "aiOpenSourceFile")}
                  accept=".pdf,.doc,.docx"
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
