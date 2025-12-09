"use client";

import { useMemo } from "react";
import type { Filters } from "@/lib/types";

type Props = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  regions: string[];
  countries: string[];
};

export default function FilterBar({ filters, setFilters, regions, countries }: Props) {
  const minScore = filters.minScore ?? 0;
  const sortedRegions = useMemo(() => ["All", ...regions], [regions]);
  const sortedCountries = useMemo(() => ["All", ...countries], [countries]);

  return (
    <div className="card p-4 md:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className="input-base"
          placeholder="Search university..."
          value={filters.query ?? ""}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
        <select
          className="input-base appearance-none pr-8"
          value={filters.region ?? "All"}
          onChange={(e) => setFilters({ ...filters, region: e.target.value === "All" ? undefined : e.target.value })}
        >
          {sortedRegions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="input-base appearance-none pr-8"
          value={filters.country ?? "All"}
          onChange={(e) => setFilters({ ...filters, country: e.target.value === "All" ? undefined : e.target.value })}
        >
          {sortedCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--foreground)]/70">Min score</label>
          <input
            type="number"
            className="input-base"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
