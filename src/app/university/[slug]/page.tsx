import Container from "@/components/Container";
import AuthGuard from "@/components/auth/AuthGuard";
import { fetchUniversityBySlug } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { UNIVERSITIES } from "@/lib/mockData";

export default async function UniversityDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const uni = await fetchUniversityBySlug(slug);
  if (!uni) return notFound();

  return (
    <AuthGuard>
      <Container>
      <div className="my-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">{uni.name}</h1>
            <p className="text-[var(--foreground)]/70 mt-2">{uni.country} • {uni.region}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm text-[var(--foreground)]/60">Last updated</div>
            <div className="font-medium text-[var(--foreground)]">{formatDate(uni.lastUpdated)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Trust Score", value: uni.trustScore },
            { label: "Transparency", value: uni.metrics.transparency },
            { label: "Auditability", value: uni.metrics.auditability },
            { label: "Data Privacy", value: uni.metrics.dataPrivacy },
          ].map((m) => (
            <div key={m.label} className="card p-6">
              <div className="text-sm font-medium text-[var(--foreground)]/60">{m.label}</div>
              <div className="mt-2 text-3xl font-bold text-[var(--primary)]">{m.value}</div>
              <div className="mt-4 h-2 w-full rounded-full bg-[var(--muted)]">
                <div
                  className="h-2 rounded-full accent-gradient"
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-[var(--primary)]">Quick Facts</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/50 rounded-lg p-4 border border-[var(--muted)]">
              <div className="text-xs text-[var(--foreground)]/60">Rank</div>
              <div className="text-lg font-semibold text-[var(--primary)]">#{uni.rank}</div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 border border-[var(--muted)]">
              <div className="text-xs text-[var(--foreground)]/60">Country</div>
              <div className="text-lg font-semibold">{uni.country}</div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 border border-[var(--muted)]">
              <div className="text-xs text-[var(--foreground)]/60">Region</div>
              <div className="text-lg font-semibold">{uni.region}</div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 border border-[var(--muted)]">
              <div className="text-xs text-[var(--foreground)]/60">Policy Maturity</div>
              <div className="text-lg font-semibold">{uni.metrics.policyMaturity}</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-[var(--primary)]">Methodology Snapshot</h2>
          <p className="mt-3 text-[var(--foreground)]/80 leading-relaxed">
            The score is computed from transparency, auditability, data privacy,
            and AI policy maturity. Upcoming backend integration (Django + MongoDB)
            and evaluation models (TensorFlow/PyTorch/scikit-learn) will assess
            policy documents, audit reports, and other indicators.
          </p>
          <div className="mt-6">
            <button className="btn btn-accent">View Full Methodology</button>
          </div>
        </div>
      </div>
      </Container>
    </AuthGuard>
  );
}

export async function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ slug: u.slug }));
}
