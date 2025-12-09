"use client";

import { useMemo } from "react";
import type { Filters } from "@/lib/types";

type Props = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  regions: string[];
  countries: string[];
};

export default function FilterBar({
  filters,
  setFilters,
  regions,
  countries,
}: Props) {
  const minScore = filters.minScore ?? 0;
  const sortedRegions = useMemo(() => ["All", ...regions], [regions]);
  const sortedCountries = useMemo(() => ["All", ...countries], [countries]);

  return (
    <div className="card p-4 md:p-6 bg-gradient-to-br from-white via-[#f8f9ff] to-white shadow-2xl border-2 border-[#0047AB]/20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className="input-base font-medium"
          placeholder="🔍 Search university..."
          value={filters.query ?? ""}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
        <select
          className="input-base appearance-none pr-8 font-medium cursor-pointer"
          value={filters.region ?? "All"}
          onChange={(e) =>
            setFilters({
              ...filters,
              region: e.target.value === "All" ? undefined : e.target.value,
            })
          }
        >
          {sortedRegions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="input-base appearance-none pr-8 font-medium cursor-pointer"
          value={filters.country ?? "All"}
          onChange={(e) =>
            setFilters({
              ...filters,
              country: e.target.value === "All" ? undefined : e.target.value,
            })
          }
        >
          {sortedCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div>
          <label className="mb-1 block text-xs font-bold text-[#000080]/80 uppercase tracking-wide">
            Min score
          </label>
          <input
            type="number"
            className="input-base font-bold text-[#0047AB]"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) =>
              setFilters({ ...filters, minScore: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
}
