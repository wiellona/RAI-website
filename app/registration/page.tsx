"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../component/header";
import Footer from "../component/footer";

interface FormData {
  universityName: string;
  directorName: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  statusRelation: string;
  officialLetter: File | null;
}

export default function RegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    universityName: "",
    directorName: "",
    address: "",
    contactPerson: "",
    contactEmail: "",
    statusRelation: "",
    officialLetter: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (name === "officialLetter" && files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create FormData for file upload
    const submitData = new FormData();
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const value = formData[key];
      if (value) {
        submitData.append(
          key,
          value instanceof File ? value : value.toString()
        );
      }
    });

    try {
      // ENDPOINT ENDPOINT ENDPOINT ENDPOINT
      const response = await fetch("ENDPOINT ENDPOINT ENDPOINT ENDPOINT", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        console.log("Form submitted successfully:", formData);
        alert("Registration submitted successfully!");
        // Reset form after successful submission
        setFormData({
          universityName: "",
          directorName: "",
          address: "",
          contactPerson: "",
          contactEmail: "",
          statusRelation: "",
          officialLetter: null,
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFormData((prev) => ({
          ...prev,
          officialLetter: file,
        }));
      } else {
        alert("Please upload only PDF, DOC, or DOCX files.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Registration Section */}
      <section className="pt-[65px] min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-4xl w-full mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-[#511715] text-white p-6">
              <h1 className="text-2xl font-bold">
                RAI University Registration
              </h1>
              <p className="text-white/80 mt-2">
                Register your university for the Responsible AI Global
                University Ranking
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* University Name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="universityName"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    University Name
                  </label>
                  <input
                    type="text"
                    id="universityName"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CD5C5C] focus:border-[#CD5C5C] text-gray-900 outline-[#CD5C5C]"
                    required
                  />
                </div>

                {/* Director Name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="directorName"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Director Name
                  </label>
                  <input
                    type="text"
                    id="directorName"
                    name="directorName"
                    value={formData.directorName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CD5C5C] focus:border-[#CD5C5C] text-gray-900 outline-[#CD5C5C]"
                    required
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CD5C5C] focus:border-[#CD5C5C] text-gray-900 outline-[#CD5C5C]"
                    required
                  ></textarea>
                </div>

                {/* Contact Person */}
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CD5C5C] focus:border-[#CD5C5C] text-gray-900 outline-[#CD5C5C]"
                    required
                  />
                </div>

                {/* Contact Person's Email */}
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Contact Person's Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CD5C5C] focus:border-[#CD5C5C] text-gray-900 outline-[#CD5C5C]"
                    required
                  />
                </div>

                {/* Status/Relation */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="statusRelation"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Status/Relation
                  </label>
                  <select
                    id="statusRelation"
                    name="statusRelation"
                    value={formData.statusRelation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CD5C5C] focus:border-[#CD5C5C] text-gray-900 outline-[#CD5C5C]"
                    required
                  >
                    <option value="">Select your status/relation</option>
                    <option value="Dean">Dean</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Faculty Member">Faculty Member</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Official Letter - Enhanced File Upload */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="officialLetter"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Official letter of Request that signed by the dean
                  </label>
                  <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-[#CD5C5C] focus-within:border-[#CD5C5C]"
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onClick={() => {
                      const fileInput = document.getElementById(
                        "officialLetter"
                      ) as HTMLInputElement;
                      fileInput?.click();
                    }}
                  >
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="officialLetter"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#511715] hover:text-[#a42e24] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#CD5C5C]"
                        >
                          <span>Upload a file</span>
                          <input
                            id="officialLetter"
                            name="officialLetter"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                  {formData.officialLetter && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800 font-medium">
                        ✓ File selected: {formData.officialLetter.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Size:{" "}
                        {(formData.officialLetter.size / 1024 / 1024).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#c5372c] hover:bg-[#a42e24] text-white font-medium py-3 px-8 rounded-md transition-colors focus:ring-2 focus:ring-[#CD5C5C] focus:ring-offset-2 focus:outline-none"
                >
                  Register University
                </button>
                <Link
                  href="/"
                  className="w-full sm:w-auto text-center border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-md transition-colors focus:ring-2 focus:ring-[#CD5C5C] focus:ring-offset-2 focus:outline-none"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
