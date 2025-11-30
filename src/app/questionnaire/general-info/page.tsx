"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export default function GeneralInfoPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    universityName: "",
    dateEstablishment: "",
    websiteAddress: "",
    addressLocation: "",
    deanName: "",
    picName: "",
    emailAddress: "",
    aiPublicationsFile: null as File | null,
    aiOpenSourceFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [existingFiles, setExistingFiles] = useState<{
    publication: { url: string | null; path: string } | null;
    asset: { url: string | null; path: string } | null;
  }>({ publication: null, asset: null });

  const publicationRequired =
    !formData.aiPublicationsFile && !existingFiles.publication;
  const assetRequired = !formData.aiOpenSourceFile && !existingFiles.asset;

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        if (ignore) return;
        const email = data.session?.user.email;
        if (!email) {
          router.push("/login");
          return;
        }
        setCurrentUserEmail(email);

        const response = await fetch("/api/general-info", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Failed to load general info");
        }
        const payload = await response.json();
        if (ignore) return;
        if (payload?.data) {
          setFormData((prev) => ({
            ...prev,
            universityName: payload.data.name ?? "",
            dateEstablishment:
              payload.data.date_of_establishment?.slice(0, 10) ?? "",
            websiteAddress: payload.data.website ?? "",
            addressLocation: payload.data.address ?? "",
            deanName: payload.data.dean_name ?? "",
            picName: payload.data.pic_name ?? "",
            emailAddress: payload.data.pic_email ?? email,
          }));
        }
        if (payload?.files) {
          setExistingFiles({
            publication: payload.files.publication,
            asset: payload.files.asset,
          });
        }
      } catch (error) {
        if (!ignore) {
          setStatus({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to load general information",
          });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [router, supabase]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail) {
      router.push("/login");
      return;
    }

    setStatus(null);
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("universityName", formData.universityName.trim());
      payload.append("dateEstablishment", formData.dateEstablishment);
      payload.append("websiteAddress", formData.websiteAddress.trim());
      payload.append("addressLocation", formData.addressLocation.trim());
      payload.append("deanName", formData.deanName.trim());
      payload.append("picName", formData.picName.trim());
      payload.append("emailAddress", formData.emailAddress.trim());
      if (formData.aiPublicationsFile) {
        payload.append("aiPublicationsFile", formData.aiPublicationsFile);
      }
      if (formData.aiOpenSourceFile) {
        payload.append("aiOpenSourceFile", formData.aiOpenSourceFile);
      }

      const response = await fetch("/api/general-info", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save general info");
      }

      setStatus({
        type: "success",
        message: "General information saved",
      });
      router.push("/questionnaire/criteria");
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to submit data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExisting = async (type: "publication" | "asset") => {
    setStatus(null);
    try {
      const res = await fetch(`/api/general-info?type=${type}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to remove file");
      }
      setExistingFiles((prev) => ({ ...prev, [type]: null }));
      if (type === "publication") {
        setFormData((prev) => ({ ...prev, aiPublicationsFile: null }));
      } else {
        setFormData((prev) => ({ ...prev, aiOpenSourceFile: null }));
      }
      setStatus({
        type: "success",
        message: "Evidence removed. Upload a new file if needed.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to remove file",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading general information...
      </div>
    );
  }

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
              University Responsible AI Rating
            </h1>
            <p className="text-gray-600">
              Please provide general information about your university
            </p>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {status && (
                <div
                  className={`rounded-md border p-4 text-sm ${
                    status.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {status.message}
                </div>
              )}
              {/* university Name */}
              <div>
                <label
                  htmlFor="universityName"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  University Name *
                </label>
                <input
                  type="text"
                  id="universityName"
                  name="universityName"
                  value={formData.universityName}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-md text-gray-600"
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

              {/* dean Name */}
              <div>
                <label
                  htmlFor="deanName"
                  className="block text-sm font-medium text-[#5C2E2E] mb-2"
                >
                  Dean Name *
                </label>
                <input
                  type="text"
                  id="deanName"
                  name="deanName"
                  value={formData.deanName}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-md text-gray-600"
                  required
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-4">
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
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-md text-gray-600"
                  required
                />
                <div>
                  <label
                    htmlFor="emailAddress"
                    className="block text-sm font-medium text-[#5C2E2E] mb-2"
                  >
                    Contact Person Email *
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    disabled
                    placeholder="contact@university.edu"
                    className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-md text-gray-600"
                  />
                </div>
              </div>

              {/* AI Publications File Upload */}
              <div>
                <label className="block text-sm font-medium text-[#5C2E2E] mb-2 items-center gap-2">
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
                        articles, or academic publications your university has
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
                    href="https://mibkispkzpazmcyhftmv.supabase.co/storage/v1/object/public/Templates/ai-publications-template.csv"
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
                {existingFiles.publication && (
                  <div className="mb-3 rounded border border-green-200 bg-green-50 p-3 flex items-center justify-between text-sm text-green-800">
                    <div className="space-y-1">
                      <p className="font-medium">Existing upload</p>
                      {existingFiles.publication.url ? (
                        <a
                          href={existingFiles.publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-green-700"
                        >
                          Download current file
                        </a>
                      ) : (
                        <p className="text-xs text-green-700">
                          File stored (no preview)
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting("publication")}
                      className="text-red-600 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
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
                  <p className="text-xs text-gray-500">XLSX up to 10MB</p>
                </div>
                <input
                  id="aiPublicationsFile"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "aiPublicationsFile")}
                  required={publicationRequired}
                />
              </div>

              {/* AI Open-Source Assets File Upload */}
              <div>
                <label className="block text-sm font-medium text-[#5C2E2E] mb-2 items-center gap-2">
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
                        resources your university has released.
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
                    href="https://mibkispkzpazmcyhftmv.supabase.co/storage/v1/object/public/Templates/ai-assets-template.csv"
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
                {existingFiles.asset && (
                  <div className="mb-3 rounded border border-green-200 bg-green-50 p-3 flex items-center justify-between text-sm text-green-800">
                    <div className="space-y-1">
                      <p className="font-medium">Existing upload</p>
                      {existingFiles.asset.url ? (
                        <a
                          href={existingFiles.asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-green-700"
                        >
                          Download current file
                        </a>
                      ) : (
                        <p className="text-xs text-green-700">
                          File stored (no preview)
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting("asset")}
                      className="text-red-600 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
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
                  <p className="text-xs text-gray-500">XLSX up to 10MB</p>
                </div>
                <input
                  id="aiOpenSourceFile"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "aiOpenSourceFile")}
                  required={assetRequired}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#A84032] hover:bg-[#8B3528] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-md transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Continue to Questionnaire"}
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
