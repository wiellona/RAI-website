"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Select, {
  components as selectComponents,
  type SingleValue,
  type StylesConfig,
  type DropdownIndicatorProps,
} from "react-select";
import countryList from "react-select-country-list";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type Option = { label: string; value: string };
type CountryOption = Option;

type RegistrationFormData = {
  universityName: string;
  country: string | null;
  directorName: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  username: string;
  password: string;
  statusRelation: string;
  officialLetter: File | null;
};

const EMAIL_REGEX = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;

const createInitialFormState = (): RegistrationFormData => ({
  universityName: "",
  country: null,
  directorName: "",
  address: "",
  contactPerson: "",
  contactEmail: "",
  username: "",
  password: "",
  statusRelation: "",
  officialLetter: null,
});

export default function RegistrationPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const countryOptions = useMemo<CountryOption[]>(
    () => countryList().getData(),
    []
  );
  const statusOptions = useMemo<Option[]>(
    () => [
      { value: "Dean", label: "Dean" },
      { value: "Department Head", label: "Department Head" },
      { value: "Administrator", label: "Administrator" },
      { value: "Faculty Member", label: "Faculty Member" },
      { value: "Other", label: "Other" },
    ],
    []
  );
  const reactSelectStyles: StylesConfig<CountryOption, false> = useMemo(
    () => ({
      control: (provided, state) => ({
        ...provided,
        minHeight: 44,
        borderColor: state.isFocused ? "#CD5C5C" : "#d1d5db",
        boxShadow: state.isFocused ? "0 0 0 1px #CD5C5C" : provided.boxShadow,
        "&:hover": {
          borderColor: state.isFocused ? "#CD5C5C" : "#9ca3af",
        },
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: "0 16px",
      }),
      input: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
      }),
      indicatorsContainer: (provided) => ({
        ...provided,
        height: 44,
        color: "#374151",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        padding: "0 12px",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#6b7280",
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "#111827",
      }),
      option: (provided, state) => ({
        ...provided,
        color: state.isDisabled ? "#9ca3af" : "#111827",
        backgroundColor: state.isSelected
          ? "#c5372c"
          : state.isFocused
          ? "rgba(197, 55, 44, 0.08)"
          : "#fff",
        ":active": {
          backgroundColor: "rgba(197, 55, 44, 0.12)",
        },
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 30,
      }),
    }),
    []
  );
  const DropdownIndicator = (
    props: DropdownIndicatorProps<CountryOption, false>
  ) => (
    <selectComponents.DropdownIndicator {...props}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9l6 6 6-6"
          stroke="#374151"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </selectComponents.DropdownIndicator>
  );
  const baseInputClass =
    "w-full h-11 px-4 border border-gray-300 rounded-md focus:ring-[#CD5C5C] focus:border-[#CD5C5C] text-gray-900 outline-none";

  const [formData, setFormData] = useState<RegistrationFormData>(
    createInitialFormState
  );

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const letterInputRef = useRef<HTMLInputElement | null>(null);
  const openLetterPicker = () => letterInputRef.current?.click();

  const handleLetterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    const MAX_SIZE = 1 * 1024 * 1024;
    if (file.type !== "application/pdf") {
      alert("Please upload PDF files only.");
      return;
    }
    if (file.size > MAX_SIZE) {
      alert("File too large. Max 1MB");
      return;
    }
    setFormData((prev) => ({ ...prev, officialLetter: file }));
  };

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = event.target as HTMLInputElement;
    if (name === "officialLetter" && files?.length) {
      const file = files[0];
      const MAX_SIZE = 1 * 1024 * 1024; // 1MB
      if (file.type !== "application/pdf") {
        alert("Please upload PDF files only.");
        return;
      }
      if (file.size > MAX_SIZE) {
        alert("File too large. Max 1MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        officialLetter: file,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      if (!formData.officialLetter) {
        throw new Error("Official letter PDF must be attached");
      }

      // Change this in production
      const normalizedEmail = formData.contactEmail.trim().toLowerCase();
      if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw new Error("Please enter a valid email address.");
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            universityName: formData.universityName,
          },
        },
      });
      if (error || !data.user)
        throw error ?? new Error("Supabase sign-up failed");

      const payload = new FormData();
      payload.append("universityName", formData.universityName.trim());
      payload.append("directorName", formData.directorName.trim());
      payload.append("address", formData.address.trim());
      payload.append("contactPerson", formData.contactPerson.trim());
      payload.append("contactEmail", normalizedEmail); // Change to normalizedEmail in production
      payload.append("username", formData.username.trim());
      payload.append("statusRelation", formData.statusRelation);
      payload.append("officialLetter", formData.officialLetter);

      const countryCode = formData.country
        ? formData.country.toUpperCase()
        : null;
      if (countryCode) payload.append("country_code", countryCode);
      const relationMap: Record<string, string> = {
        "Faculty Member": "faculty",
        Administrator: "staff",
        Dean: "representative",
        "Department Head": "representative",
        Other: "other",
      };
      const mappedRelation = relationMap[formData.statusRelation];
      if (mappedRelation) payload.append("pic_relation", mappedRelation);
      payload.append("supabaseUserId", data.user.id);

      const registerUrl = `${window.location.origin}/api/register`;
      const response = await fetch(registerUrl, {
        method: "POST",
        body: payload,
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Failed to store university profile");
      }

      setStatus({
        type: "success",
        message:
          "Registration submitted. Check your inbox to verify the account while we review your documents.",
      });
      setFormData(createInitialFormState());
      await supabase.auth.signOut();

      setTimeout(() => {
        router.push("/authentication/login");
      }, 5000);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCountryChange = (selectedOption: SingleValue<CountryOption>) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleStatusChange = (selectedOption: SingleValue<Option>) => {
    setFormData((prev) => ({
      ...prev,
      statusRelation: selectedOption?.value ?? "",
    }));
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        const MAX_SIZE = 1 * 1024 * 1024; // 1MB
        if (file.size > MAX_SIZE) {
          alert("File too large. Max 1MB");
        } else {
          setFormData((prev) => ({
            ...prev,
            officialLetter: file,
          }));
        }
      } else {
        alert("Please upload PDF files only.");
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

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {status && (
                <div
                  className={`rounded-md border p-4 text-sm ${
                    status.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {status.message}
                </div>
              )}

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
                    className={baseInputClass}
                    required
                  />
                </div>

                {/* Country Dropdown */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Country
                  </label>
                  <Select
                    id="country"
                    name="country"
                    styles={reactSelectStyles}
                    classNamePrefix="country-select"
                    options={countryOptions}
                    value={
                      countryOptions.find(
                        (option) => option.value === formData.country
                      ) || null
                    }
                    onChange={handleCountryChange}
                    placeholder="Select a country"
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator,
                    }}
                    instanceId="country-select"
                  />
                </div>

                {/* Director Name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="directorName"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Dean Name
                  </label>
                  <input
                    type="text"
                    id="directorName"
                    name="directorName"
                    value={formData.directorName}
                    onChange={handleChange}
                    className={baseInputClass}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CD5C5C] focus:border-[#CD5C5C] text-gray-900 outline-none"
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
                    className={baseInputClass}
                    required
                  />
                </div>

                {/* Contact Person's Email */}
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Contact Person&apos;s Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={baseInputClass}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={baseInputClass}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={baseInputClass}
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
                  <Select
                    inputId="statusRelation"
                    name="statusRelation"
                    styles={reactSelectStyles}
                    classNamePrefix="status-select"
                    placeholder="Select your status/relation"
                    options={statusOptions}
                    value={
                      statusOptions.find(
                        (option) => option.value === formData.statusRelation
                      ) || null
                    }
                    onChange={handleStatusChange}
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator,
                    }}
                    instanceId="status-select"
                  />
                </div>

                {/* Official Letter - Enhanced File Upload */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="officialLetter"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Official letter of Request that signed by the dean
                  </label>
                  <p className="mb-2 text-sm">
                    <a
                      href="https://mibkispkzpazmcyhftmv.supabase.co/storage/v1/object/public/Official%20Request%20Letter/Official%20Request%20Letter.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c5372c] hover:text-[#a42e24] underline transition-colors duration-200"
                    >
                      For template example, click here
                    </a>
                  </p>
                  <input
                    ref={letterInputRef}
                    id="officialLetter"
                    name="officialLetter"
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleLetterChange}
                    required
                  />
                  <div
                    className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#A84032]/50 transition-colors"
                    onClick={openLetterPicker}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openLetterPicker();
                      }
                    }}
                    aria-label="Upload official letter PDF"
                  >
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
                    <p className="mt-3 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF up to 1MB</p>
                    {formData.officialLetter && (
                      <p className="mt-3 text-sm text-green-700">
                        ✓ File selected: {formData.officialLetter.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#c5372c] hover:bg-[#a42e24] text-white font-medium py-3 px-8 rounded-md transition-colors focus:ring-2 focus:ring-[#CD5C5C] focus:ring-offset-2 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Register University"}
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
