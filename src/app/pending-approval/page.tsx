"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";
import { useAuthProfile } from "@/app/providers/AuthProfile";

export default function UniversityInfoPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const { profile, loading: profileLoading } = useAuthProfile();
  const [loading, setLoading] = useState(true);
  const [universityData, setUniversityData] = useState({
    universityName: "",
    addressLocation: "",
    deanName: "",
    picName: "",
    emailAddress: "",
    status: "Pending",
    lastUpdated: "",
    aiPublicationsFile: null as { url: string | null; path: string } | null,
    aiOpenSourceFile: null as { url: string | null; path: string } | null,
  });

  const [formData, setFormData] = useState({
    universityName: "",
    addressLocation: "",
    deanName: "",
    picName: "",
    emailAddress: "",
  });

  const [existingFiles, setExistingFiles] = useState<{
    publication: { url: string | null; path: string } | null;
    asset: { url: string | null; path: string } | null;
  }>({ publication: null, asset: null });

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (ignore) return;

        if (!authUser) {
          router.push("/login");
          return;
        }

        // Load university data using profile from hook
        if (profile?.university_id) {
          const { data: uniData } = await supabase
            .from("Universities")
            .select("*")
            .eq("id", profile.university_id)
            .single();

          if (uniData && !ignore) {
            setUniversityData({
              universityName: uniData.name || "",
              addressLocation: uniData.address || "",
              deanName: uniData.dean_name || "",
              picName: uniData.pic_name || "",
              emailAddress: uniData.pic_email || "",
              status: uniData.is_approved ? "Approved" : "Pending",
              lastUpdated: uniData.updated_at || "",
              aiPublicationsFile: null,
              aiOpenSourceFile: null,
            });
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error loading university data:", error);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [router, supabase, profile]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-gradient-to-r from-[#0047AB]/20 to-[#0099ED]/20 text-[#0047AB] border-[#0047AB]/40";
      case "pending":
        return "bg-gradient-to-r from-[#000080]/20 to-[#0047AB]/20 text-[#000080] border-[#000080]/40";
      case "rejected":
        return "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "pending":
        return (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A84032] mb-4"></div>
            <p>Loading university information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-600">
          <div className="text-center">
            <p className="text-lg text-gray-800">
              Profile not found. Please contact the admin.
            </p>
          </div>
        </div>
        <Footer />
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
            <h1 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
              University Responsible AI Rating's Waiting Room
            </h1>
            <p className="text-gray-600">General information</p>
          </div>

          {/* Status Banner */}
          <div className="mb-8">
            <div
              className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg border ${getStatusColor(
                universityData.status
              )}`}
            >
              {getStatusIcon(universityData.status)}
              <div>
                <p className="font-medium">Status: {universityData.status}</p>
                <p className="text-sm opacity-80">
                  Last updated: {universityData.lastUpdated}
                </p>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 space-y-8">
            {/* University Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">
                University Name
              </label>
              <div className="text-lg font-semibold text-[#000080]">
                {universityData.universityName || "Not provided"}
              </div>
            </div>

            {/* Address of Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">
                Address of Location
              </label>
              <div className="text-lg text-[#000080]">
                {universityData.addressLocation || "Not provided"}
              </div>
            </div>

            {/* Dean Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">
                Dean Name
              </label>
              <div className="text-lg text-[#000080]">
                {universityData.deanName || "Not provided"}
              </div>
            </div>

            {/* Contact Person Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-[#000080] mb-6">
                Contact Person
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Person Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Contact Person Name
                  </label>
                  <div className="text-lg text-[#000080]">
                    {universityData.picName || "Not provided"}
                  </div>
                </div>

                {/* Contact Person Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Contact Person Email
                  </label>
                  {universityData.emailAddress ? (
                    <a
                      href={`mailto:${universityData.emailAddress}`}
                      className="text-lg text-[#000080] hover:text-[#000080] underline transition-colors break-all"
                    >
                      {universityData.emailAddress}
                    </a>
                  ) : (
                    <div className="text-lg text-gray-500 italic">
                      Not provided
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors"
              >
                Go To dashboard
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Need to make changes? Please contact the admin.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
