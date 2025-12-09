import Link from "next/link";
import type { University } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ScoreBadge from "./ScoreBadge";

export default function RankingTable({ data }: { data: University[] }) {
  return (
    <div className="card p-6 bg-gradient-to-br from-white via-[#f8f9ff] to-white shadow-2xl border-2 border-[#0047AB]/20">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr className="border-b-2 border-[#0047AB]/30">
              <th className="w-16 text-[#000080] font-bold">Rank</th>
              <th className="text-[#000080] font-bold">University</th>
              <th className="hidden md:table-cell text-[#000080] font-bold">
                Region
              </th>
              <th className="hidden md:table-cell text-[#000080] font-bold">
                Country
              </th>
              <th className="text-[#000080] font-bold">Trust Score</th>
              <th className="hidden sm:table-cell text-[#000080] font-bold">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-gradient-to-r hover:from-[#0047AB]/5 hover:to-[#0099ED]/5 transition-all duration-300 border-b border-[#0047AB]/10"
              >
                <td className="font-bold text-[#0047AB] text-lg">{u.rank}</td>
                <td>
                  <Link
                    href={`/university/${u.slug}`}
                    className="font-semibold text-[#000080] hover:text-[#0047AB] hover:underline transition-colors duration-300"
                  >
                    {u.name}
                  </Link>
                </td>
                <td className="hidden md:table-cell text-[#000080]/70 font-medium">
                  {u.region}
                </td>
                <td className="hidden md:table-cell text-[#000080]/70 font-medium">
                  {u.country}
                </td>
                <td>
                  <ScoreBadge score={u.trustScore} />
                </td>
                <td className="hidden sm:table-cell text-[#000080]/60">
                  {formatDate(u.lastUpdated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
