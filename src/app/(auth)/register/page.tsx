"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@supabase/supabase-js";
import Select from "react-select";

const countries = [
  { label: "Afghanistan", value: "AF" },
  { label: "Albania", value: "AL" },
  { label: "Algeria", value: "DZ" },
  { label: "Andorra", value: "AD" },
  { label: "Angola", value: "AO" },
  { label: "Antigua and Barbuda", value: "AG" },
  { label: "Argentina", value: "AR" },
  { label: "Armenia", value: "AM" },
  { label: "Australia", value: "AU" },
  { label: "Austria", value: "AT" },
  { label: "Azerbaijan", value: "AZ" },
  { label: "Bahamas", value: "BS" },
  { label: "Bahrain", value: "BH" },
  { label: "Bangladesh", value: "BD" },
  { label: "Barbados", value: "BB" },
  { label: "Belarus", value: "BY" },
  { label: "Belgium", value: "BE" },
  { label: "Belize", value: "BZ" },
  { label: "Benin", value: "BJ" },
  { label: "Bhutan", value: "BT" },
  { label: "Bolivia", value: "BO" },
  { label: "Bosnia and Herzegovina", value: "BA" },
  { label: "Botswana", value: "BW" },
  { label: "Brazil", value: "BR" },
  { label: "Brunei", value: "BN" },
  { label: "Bulgaria", value: "BG" },
  { label: "Burkina Faso", value: "BF" },
  { label: "Burundi", value: "BI" },
  { label: "Cambodia", value: "KH" },
  { label: "Cameroon", value: "CM" },
  { label: "Canada", value: "CA" },
  { label: "Cape Verde", value: "CV" },
  { label: "Central African Republic", value: "CF" },
  { label: "Chad", value: "TD" },
  { label: "Chile", value: "CL" },
  { label: "China", value: "CN" },
  { label: "Colombia", value: "CO" },
  { label: "Comoros", value: "KM" },
  { label: "Congo", value: "CG" },
  { label: "Costa Rica", value: "CR" },
  { label: "Croatia", value: "HR" },
  { label: "Cuba", value: "CU" },
  { label: "Cyprus", value: "CY" },
  { label: "Czech Republic", value: "CZ" },
  { label: "Denmark", value: "DK" },
  { label: "Djibouti", value: "DJ" },
  { label: "Dominica", value: "DM" },
  { label: "Dominican Republic", value: "DO" },
  { label: "East Timor", value: "TL" },
  { label: "Ecuador", value: "EC" },
  { label: "Egypt", value: "EG" },
  { label: "El Salvador", value: "SV" },
  { label: "Equatorial Guinea", value: "GQ" },
  { label: "Eritrea", value: "ER" },
  { label: "Estonia", value: "EE" },
  { label: "Ethiopia", value: "ET" },
  { label: "Fiji", value: "FJ" },
  { label: "Finland", value: "FI" },
  { label: "France", value: "FR" },
  { label: "Gabon", value: "GA" },
  { label: "Gambia", value: "GM" },
  { label: "Georgia", value: "GE" },
  { label: "Germany", value: "DE" },
  { label: "Ghana", value: "GH" },
  { label: "Greece", value: "GR" },
  { label: "Grenada", value: "GD" },
  { label: "Guatemala", value: "GT" },
  { label: "Guinea", value: "GN" },
  { label: "Guinea-Bissau", value: "GW" },
  { label: "Guyana", value: "GY" },
  { label: "Haiti", value: "HT" },
  { label: "Honduras", value: "HN" },
  { label: "Hungary", value: "HU" },
  { label: "Iceland", value: "IS" },
  { label: "India", value: "IN" },
  { label: "Indonesia", value: "ID" },
  { label: "Iran", value: "IR" },
  { label: "Iraq", value: "IQ" },
  { label: "Ireland", value: "IE" },
  { label: "Israel", value: "IL" },
  { label: "Italy", value: "IT" },
  { label: "Ivory Coast", value: "CI" },
  { label: "Jamaica", value: "JM" },
  { label: "Japan", value: "JP" },
  { label: "Jordan", value: "JO" },
  { label: "Kazakhstan", value: "KZ" },
  { label: "Kenya", value: "KE" },
  { label: "Kiribati", value: "KI" },
  { label: "Kuwait", value: "KW" },
  { label: "Kyrgyzstan", value: "KG" },
  { label: "Laos", value: "LA" },
  { label: "Latvia", value: "LV" },
  { label: "Lebanon", value: "LB" },
  { label: "Lesotho", value: "LS" },
  { label: "Liberia", value: "LR" },
  { label: "Libya", value: "LY" },
  { label: "Liechtenstein", value: "LI" },
  { label: "Lithuania", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Madagascar", value: "MG" },
  { label: "Malawi", value: "MW" },
  { label: "Malaysia", value: "MY" },
  { label: "Maldives", value: "MV" },
  { label: "Mali", value: "ML" },
  { label: "Malta", value: "MT" },
  { label: "Marshall Islands", value: "MH" },
  { label: "Mauritania", value: "MR" },
  { label: "Mauritius", value: "MU" },
  { label: "Mexico", value: "MX" },
  { label: "Micronesia", value: "FM" },
  { label: "Moldova", value: "MD" },
  { label: "Monaco", value: "MC" },
  { label: "Mongolia", value: "MN" },
  { label: "Montenegro", value: "ME" },
  { label: "Morocco", value: "MA" },
  { label: "Mozambique", value: "MZ" },
  { label: "Myanmar", value: "MM" },
  { label: "Namibia", value: "NA" },
  { label: "Nauru", value: "NR" },
  { label: "Nepal", value: "NP" },
  { label: "Netherlands", value: "NL" },
  { label: "New Zealand", value: "NZ" },
  { label: "Nicaragua", value: "NI" },
  { label: "Niger", value: "NE" },
  { label: "Nigeria", value: "NG" },
  { label: "North Korea", value: "KP" },
  { label: "North Macedonia", value: "MK" },
  { label: "Norway", value: "NO" },
  { label: "Oman", value: "OM" },
  { label: "Pakistan", value: "PK" },
  { label: "Palau", value: "PW" },
  { label: "Palestine", value: "PS" },
  { label: "Panama", value: "PA" },
  { label: "Papua New Guinea", value: "PG" },
  { label: "Paraguay", value: "PY" },
  { label: "Peru", value: "PE" },
  { label: "Philippines", value: "PH" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Qatar", value: "QA" },
  { label: "Romania", value: "RO" },
  { label: "Russia", value: "RU" },
  { label: "Rwanda", value: "RW" },
  { label: "Saint Kitts and Nevis", value: "KN" },
  { label: "Saint Lucia", value: "LC" },
  { label: "Saint Vincent and the Grenadines", value: "VC" },
  { label: "Samoa", value: "WS" },
  { label: "San Marino", value: "SM" },
  { label: "Sao Tome and Principe", value: "ST" },
  { label: "Saudi Arabia", value: "SA" },
  { label: "Senegal", value: "SN" },
  { label: "Serbia", value: "RS" },
  { label: "Seychelles", value: "SC" },
  { label: "Sierra Leone", value: "SL" },
  { label: "Singapore", value: "SG" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Solomon Islands", value: "SB" },
  { label: "Somalia", value: "SO" },
  { label: "South Africa", value: "ZA" },
  { label: "South Korea", value: "KR" },
  { label: "South Sudan", value: "SS" },
  { label: "Spain", value: "ES" },
  { label: "Sri Lanka", value: "LK" },
  { label: "Sudan", value: "SD" },
  { label: "Suriname", value: "SR" },
  { label: "Sweden", value: "SE" },
  { label: "Switzerland", value: "CH" },
  { label: "Syria", value: "SY" },
  { label: "Taiwan", value: "TW" },
  { label: "Tajikistan", value: "TJ" },
  { label: "Tanzania", value: "TZ" },
  { label: "Thailand", value: "TH" },
  { label: "Togo", value: "TG" },
  { label: "Tonga", value: "TO" },
  { label: "Trinidad and Tobago", value: "TT" },
  { label: "Tunisia", value: "TN" },
  { label: "Turkey", value: "TR" },
  { label: "Turkmenistan", value: "TM" },
  { label: "Tuvalu", value: "TV" },
  { label: "Uganda", value: "UG" },
  { label: "Ukraine", value: "UA" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Uruguay", value: "UY" },
  { label: "Uzbekistan", value: "UZ" },
  { label: "Vanuatu", value: "VU" },
  { label: "Vatican City", value: "VA" },
  { label: "Venezuela", value: "VE" },
  { label: "Vietnam", value: "VN" },
  { label: "Yemen", value: "YE" },
  { label: "Zambia", value: "ZM" },
  { label: "Zimbabwe", value: "ZW" },
];

interface FormData {
  universityName: string;
  country: string | null;
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
    country: null,
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

  const handleCountryChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.value : null,
    }));
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
      const response = await fetch("/api/register", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        console.log("Form submitted successfully:", formData);
        alert("Registration submitted successfully!");
        // Reset form after successful submission
        setFormData({
          universityName: "",
          country: null,
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
                    className="block text-sm font-medium text-black mb-1"
                    options={countries}
                    value={
                      countries.find(
                        (option) => option.value === formData.country
                      ) || null
                    }
                    onChange={handleCountryChange}
                    placeholder="Select a country"
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
