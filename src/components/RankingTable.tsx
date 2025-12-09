import Link from "next/link";
import type { University } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ScoreBadge from "./ScoreBadge";

export default function RankingTable({ data }: { data: University[] }) {
  return (
    <div className="card p-6">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th className="w-16">Rank</th>
              <th>University</th>
              <th className="hidden md:table-cell">Region</th>
              <th className="hidden md:table-cell">Country</th>
              <th>Trust Score</th>
              <th className="hidden sm:table-cell">Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--muted)] transition-colors">
                <td className="font-semibold text-[var(--primary)]">{u.rank}</td>
                <td>
                  <Link href={`/university/${u.slug}`} className="font-medium text-[var(--primary)] hover:text-[var(--accent)] hover:underline">
                    {u.name}
                  </Link>
                </td>
                <td className="hidden md:table-cell text-[var(--foreground)]/70">{u.region}</td>
                <td className="hidden md:table-cell text-[var(--foreground)]/70">{u.country}</td>
                <td>
                  <ScoreBadge score={u.trustScore} />
                </td>
                <td className="hidden sm:table-cell text-[var(--foreground)]/60">{formatDate(u.lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
