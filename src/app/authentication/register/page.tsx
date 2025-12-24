"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
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
import { DragDropFileUpload } from "@/app/components/inputs/DragDropFileUpload";

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
        minHeight: 48,
        borderRadius: "0.75rem",
        borderWidth: "2px",
        borderColor: state.isFocused ? "#0047AB" : "rgba(0, 71, 171, 0.2)",
        background: state.isFocused
          ? "#ffffff"
          : "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
        boxShadow: state.isFocused
          ? "0 0 0 4px rgba(0, 71, 171, 0.1)"
          : provided.boxShadow,
        "&:hover": {
          borderColor: state.isFocused ? "#0047AB" : "#0099ED",
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
        color: "#000080",
      }),
      indicatorsContainer: (provided) => ({
        ...provided,
        height: 48,
        color: "#0047AB",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        padding: "0 12px",
        color: "#0047AB",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "rgba(0, 0, 128, 0.4)",
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "#111827",
      }),
      option: (provided, state) => ({
        ...provided,
        color: state.isDisabled ? "#9ca3af" : "#000080",
        backgroundColor: state.isSelected
          ? "#0047AB"
          : state.isFocused
          ? "rgba(0, 71, 171, 0.1)"
          : "#fff",
        ":active": {
          backgroundColor: "rgba(0, 71, 171, 0.15)",
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
    "w-full h-11 px-4 border-2 border-[#0047AB]/20 rounded-xl focus:ring-4 focus:ring-[#0047AB]/20 focus:border-[#0047AB] text-[#000080] outline-none transition-all duration-300 bg-gradient-to-r from-white to-[#f8f9ff] font-medium";

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

  const handleLetterChange = (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, officialLetter: null }));
      return;
    }
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
    <div className="bg-gradient-to-br from-white via-[#f0f4ff] to-white min-h-screen">
      {/* Registration Section */}
      <section className="pt-[65px] min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#0047AB]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#0099ED]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl w-full mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-white via-[#f8f9ff] to-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#0047AB]/20">
            <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#000080] text-white p-6">
              <h1 className="text-2xl font-bold">
                RAI University Registration
              </h1>
              <p className="text-white/90 mt-2 font-medium">
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
                    className="block text-sm font-semibold text-[#000080] mb-2"
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
                    className="w-full px-4 py-2 border-2 border-[#0047AB]/20 rounded-xl focus:ring-4 focus:ring-[#0047AB]/20 focus:border-[#0047AB] text-[#000080] outline-none transition-all duration-300 bg-gradient-to-r from-white to-[#f8f9ff] font-medium"
                    required
                  ></textarea>
                </div>

                {/* Contact Person */}
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-sm font-medium text-gray-900 mb-1"
                  >
                    Contact Person's Full Name
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
                      href="https://cyxtuvxymvyhjjfcsmts.supabase.co/storage/v1/object/public/Templates/Official%20Request%20Letter.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0047AB] hover:text-[#0099ED] underline transition-colors duration-300 font-semibold"
                    >
                      For template example, click here
                    </a>
                  </p>
                  <DragDropFileUpload
                    label="Official letter of Request that signed by the dean"
                    currentFile={formData.officialLetter}
                    onFileSelect={handleLetterChange}
                    accept={{ "application/pdf": [".pdf"] }}
                    helperText="PDF up to 1 MB"
                  />
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="ml-auto flex gap-4">
                  <Link
                    href="/"
                    className="w-full sm:w-auto text-center border-2 border-[#0047AB] text-[#0047AB] hover:bg-gradient-to-r hover:from-[#0047AB]/10 hover:to-[#0099ED]/10 font-semibold py-3 px-8 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-[#0047AB]/20 focus:outline-none"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#0047AB] to-[#0099ED] hover:from-[#0099ED] hover:to-[#0047AB] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-[#0047AB]/30 hover:shadow-2xl hover:shadow-[#0047AB]/40 transform hover:-translate-y-0.5 focus:ring-4 focus:ring-[#0047AB]/20 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Register University"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
