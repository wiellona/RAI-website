import Container from "@/components/Container";
import AuthGuard from "@/components/auth/AuthGuard";
import { fetchUniversityBySlug } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

// export default async function UniversityDetail({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const uni = await fetchUniversityBySlug(slug);
//   if (!uni) return notFound();

//   return (
//     <AuthGuard>
//       <div className="bg-[#FAF9F6] min-h-screen py-10">
//         <Container>
//           <div className="space-y-8">
//             <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//               <div>
//                 <h1 className="text-3xl font-bold tracking-tight text-[#5C2E2E]">
//                   {uni.name}
//                 </h1>
//                 <p className="text-gray-700 mt-2">
//                   {uni.country} • {uni.region}
//                 </p>
//               </div>
//               <div className="text-left sm:text-right">
//                 <div className="text-sm text-gray-600">Last updated</div>
//                 <div className="font-medium text-gray-900">
//                   {formatDate(uni.lastUpdated)}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//               {[
//                 { label: "Trust Score", value: uni.trustScore },
//                 { label: "Transparency", value: uni.metrics.transparency },
//                 { label: "Auditability", value: uni.metrics.auditability },
//                 { label: "Data Privacy", value: uni.metrics.dataPrivacy },
//               ].map((m) => (
//                 <div
//                   key={m.label}
//                   className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//                 >
//                   <div className="text-sm font-medium text-gray-600">
//                     {m.label}
//                   </div>
//                   <div className="mt-2 text-3xl font-bold text-[#5C2E2E]">
//                     {m.value}
//                   </div>
//                   <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
//                     <div
//                       className="h-2 rounded-full bg-[#A84032]"
//                       style={{ width: `${m.value}%` }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-xl font-bold text-[#5C2E2E]">Quick Facts</h2>
//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="text-xs text-gray-600">Rank</div>
//                   <div className="text-lg font-semibold text-[#5C2E2E]">
//                     #{uni.rank}
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="text-xs text-gray-600">Country</div>
//                   <div className="text-lg font-semibold">{uni.country}</div>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="text-xs text-gray-600">Region</div>
//                   <div className="text-lg font-semibold">{uni.region}</div>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <div className="text-xs text-gray-600">Policy Maturity</div>
//                   <div className="text-lg font-semibold">
//                     {uni.metrics.policyMaturity}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-xl font-bold text-[#5C2E2E]">
//                 Methodology Snapshot
//               </h2>
//               <p className="mt-3 text-gray-700 leading-relaxed">
//                 The score is computed from transparency, auditability, data
//                 privacy, and AI policy maturity. Upcoming backend integration
//                 (Django + MongoDB) and evaluation models
//                 (TensorFlow/PyTorch/scikit-learn) will assess policy documents,
//                 audit reports, and other indicators.
//               </p>
//               <div className="mt-6">
//                 <button className="px-6 py-2 bg-[#A84032] text-white rounded hover:bg-[#8B3528] transition-colors">
//                   View Full Methodology
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Container>
//       </div>
//     </AuthGuard>
//   );
// }

export async function generateStaticParams() {
  try {
    const supabase = getSupabaseServerClient();
    const { data: universities } = await supabase
      .from("Universities")
      .select("slug");

    return (universities || []).map((u: any) => ({ slug: u.slug }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}
