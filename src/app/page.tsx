"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import FilterBar from "@/components/FilterBar";
import RankingTable from "@/components/RankingTable";
import GradientButton from "@/components/GradientButton";
import { fetchUniversities } from "@/lib/api";
import type { Filters, University } from "@/lib/types";

export default function Home() {
  const [filters, setFilters] = useState<Filters>({ minScore: 0 });
  const [data, setData] = useState<University[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    // Load from API (with mock fallback handled inside api.ts)
    (async () => {
      const list = await fetchUniversities();
      setData(list);
      setRegions(Array.from(new Set(list.map((u) => u.region))).sort());
      setCountries(Array.from(new Set(list.map((u) => u.country))).sort());
    })();
  }, []);

  const filtered = useMemo(() => {
    return data
      .filter((u) =>
        (filters.query
          ? u.name.toLowerCase().includes(filters.query.toLowerCase())
          : true) &&
        (filters.region ? u.region === filters.region : true) &&
        (filters.country ? u.country === filters.country : true) &&
        (filters.minScore != null ? u.trustScore >= (filters.minScore ?? 0) : true)
      )
      .sort((a, b) => a.rank - b.rank);
  }, [data, filters]);

  return (
    <>
      <section className="bg-linear-to-b from-[#FFF8F0] to-[#FAF9F6] py-16 md:py-24">
        <Container>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C2E2E] leading-tight mb-6">
              Setting the Global Standard for Responsible AI in Academia.
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl">
              An independent framework to assess, benchmark, and guide universities in the ethical implementation of artificial intelligence.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#A84032] hover:bg-[#8B3528] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Explore the 2025 Ranking →
              </button>
              <button className="border border-[#5C2E2E] text-[#5C2E2E] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">Participate</button>
            </div>
          </div>
        </Container>
      </section>

      <div className="bg-[#FAF9F6]">
        <Container>
          <section className="py-12 md:py-16">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#5C2E2E] mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                  RAI (Responsible AI Global University Ranking) provides an authorative, transparent, and rigorous assessment of how universities develop and deploy AI responsibly. We empower administrators, researchers, and the public with credible benchmarks and actionable insights.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-md">
                <p className="text-sm text-[#5C2E2E] font-semibold mb-4 italic">
                  "What gets measured, gets improved. RAI sets the standard for ethics in academic AI."
                </p>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-[#5C2E2E]">150+</div>
                    <div className="text-xs text-gray-600 mt-1">Institutions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#5C2E2E]">30</div>
                    <div className="text-xs text-gray-600 mt-1">Countries</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#5C2E2E]">2025</div>
                    <div className="text-xs text-gray-600 mt-1">Latest Edition</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 md:py-16">
            <h2 className="text-3xl font-bold text-[#5C2E2E] text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "📤",
                  title: "1. Submit Data",
                  desc: "Universities provide standardized information and evidence across key domains."
                },
                {
                  icon: "🔍",
                  title: "2. Independent Assessment",
                  desc: "Our methodology evaluates governance, infrastructure, curriculum, research, and impact."
                },
                {
                  icon: "📊",
                  title: "3. Receive Your Score & Insights",
                  desc: "Access detailed feedback, benchmarking, and guidance to improve responsible AI practice."
                }
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="font-semibold text-[#5C2E2E] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-12 space-y-6">
            <h2 className="text-2xl font-bold text-[#5C2E2E]">University Rankings</h2>
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              regions={regions}
              countries={countries}
            />
            <RankingTable data={filtered} />
          </section>
        </Container>
      </div>
    </>
  );
}
