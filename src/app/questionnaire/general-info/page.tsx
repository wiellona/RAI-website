"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";
import type { SubmissionStatus } from "@/lib/types";

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

type GeneralInfoForm = {
  universityName: string;
  dateEstablishment: string;
  websiteAddress: string;
  addressLocation: string;
  deanName: string;
  picName: string;
  emailAddress: string;
  numberOfPublications: string;
  numberOfAssets: string;
};

const defaultFormState: GeneralInfoForm = {
  universityName: "",
  dateEstablishment: "",
  websiteAddress: "",
  addressLocation: "",
  deanName: "",
  picName: "",
  emailAddress: "",
  numberOfPublications: "",
  numberOfAssets: "",
};

const LOCKED_STATUSES = new Set<SubmissionStatus>([
  "submitted",
  "on_review",
  "completed",
  "approved",
  "pending",
]);

const formatDateForInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export default function GeneralInfoPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [formData, setFormData] = useState<GeneralInfoForm>(defaultFormState);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusMessage>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setStatus(null);
      let universityId: string | null = null;

      try {
        const [{ data: userData }, response] = await Promise.all([
          supabase.auth.getUser(),
          fetch("/api/general-info"),
        ]);

        const userEmail = userData.user?.email ?? "";

        if (response.ok) {
          const payload = await response.json();
          const record = payload.data;
          universityId =
            record?.id ?? record?.university_id ?? record?.universityId ?? null;
          setFormData({
            universityName: record?.name ?? "",
            dateEstablishment: formatDateForInput(
              record?.date_of_establishment
            ),
            websiteAddress: record?.website ?? "",
            addressLocation: record?.address ?? "",
            deanName: record?.dean_name ?? "",
            picName: record?.pic_name ?? "",
            emailAddress: record?.pic_email ?? userEmail,
            numberOfPublications:
              typeof record?.publication_count === "number"
                ? String(record.publication_count)
                : "",
            numberOfAssets:
              typeof record?.asset_count === "number"
                ? String(record.asset_count)
                : "",
          });
        } else if (response.status === 404) {
          setFormData((prev) => ({ ...prev, emailAddress: userEmail }));
        } else {
          const body = await response.json().catch(() => ({}));
          setStatus({
            type: "error",
            message: body.error || "Failed to load general information",
          });
          setFormData((prev) => ({ ...prev, emailAddress: userEmail }));
        }

        if (universityId) {
          const { data: submissionRow, error: submissionError } = await supabase
            .from("Submissions")
            .select("status")
            .eq("university_id", universityId)
            .order("submitted_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (submissionError && submissionError.code !== "PGRST116") {
            console.error(
              "Failed to verify submission status before editing",
              submissionError
            );
          } else {
            const status =
              (submissionRow?.status as SubmissionStatus | null) ?? null;
            if (status && LOCKED_STATUSES.has(status)) {
              router.replace("/questionnaire/submission");
              return;
            }
          }
        }
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error instanceof Error ? error.message : "Failed to load data",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadInitialData();
  }, [router, supabase]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setStatus(null);

    const publicationCount = Number(formData.numberOfPublications);
    const assetCount = Number(formData.numberOfAssets);

    if (
      Number.isNaN(publicationCount) ||
      Number.isNaN(assetCount) ||
      publicationCount < 0 ||
      assetCount < 0
    ) {
      setStatus({
        type: "error",
        message: "Publication and asset counts must be zero or higher",
      });
      return;
    }

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
      payload.append("numberOfPublications", String(publicationCount));
      payload.append("numberOfAssets", String(assetCount));

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading general information...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              University Responsible AI Rating
            </h1>
            <p className="text-gray-600">
              Please provide general information about your university
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {status && (
                <div
                  className={`rounded-md border p-4 text-sm ${
                    status.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div>
                <label
                  htmlFor="universityName"
                  className="block text-sm font-medium text-[#000080] mb-2"
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

              <div>
                <label
                  htmlFor="dateEstablishment"
                  className="block text-sm font-medium text-[#000080] mb-2"
                >
                  Date of Establishment *
                </label>
                <input
                  type="date"
                  id="dateEstablishment"
                  name="dateEstablishment"
                  value={formData.dateEstablishment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="websiteAddress"
                  className="block text-sm font-medium text-[#000080] mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="addressLocation"
                  className="block text-sm font-medium text-[#000080] mb-2"
                >
                  Address of Location *
                </label>
                <input
                  type="text"
                  id="addressLocation"
                  name="addressLocation"
                  value={formData.addressLocation}
                  readOnly
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-md text-gray-600"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="deanName"
                  className="block text-sm font-medium text-[#000080] mb-2"
                >
                  Dean Name *
                </label>
                <input
                  type="text"
                  id="deanName"
                  name="deanName"
                  value={formData.deanName}
                  readOnly
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-md text-gray-600"
                  required
                />
              </div>

              <div className="space-y-4">
                <label
                  htmlFor="picName"
                  className="block text-sm font-medium text-[#000080] mb-2"
                >
                  Contact Person *
                </label>
                <input
                  type="text"
                  id="picName"
                  name="picName"
                  value={formData.picName}
                  readOnly
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-md text-gray-600"
                  required
                />
                <div>
                  <label
                    htmlFor="emailAddress"
                    className="block text-sm font-medium text-[#000080] mb-2"
                  >
                    Contact Person Email *
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    readOnly
                    placeholder="contact@university.edu"
                    className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="numberOfPublications"
                  className="block text-sm font-medium text-[#000080] mb-2"
                >
                  AI Publications (last 3 years) *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Count each distinct AI-related publication produced by your
                  university during the last three calendar years.
                </p>
                <input
                  type="number"
                  min={0}
                  step={1}
                  id="numberOfPublications"
                  name="numberOfPublications"
                  value={formData.numberOfPublications}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="numberOfAssets"
                  className="block text-sm font-medium text-[#000080] mb-2"
                >
                  AI Open-Source Assets *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Provide the total number of open-source AI assets (datasets,
                  models, tools) currently maintained by your university.
                </p>
                <input
                  type="number"
                  min={0}
                  step={1}
                  id="numberOfAssets"
                  name="numberOfAssets"
                  value={formData.numberOfAssets}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                  required
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
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
