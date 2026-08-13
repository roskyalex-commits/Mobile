import { Building2, ExternalLink, Mail } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page";
import { ScoreBadge, ScoreExplanation } from "@/components/leads/score-badge";
import { jurisdictionFor } from "@/lib/outreach/compliance";
import { scoreLead, summariseScore } from "@/lib/signals/scoring";
import type { Icp } from "@/lib/icp/schema";
import type { Signal } from "@/lib/signals/types";

/**
 * Leads.
 *
 * With no database yet there is nothing real to list, so rather than an empty
 * box this renders a worked example through the actual scoring engine. It
 * shows what the surface will look like, and it exercises the scorer on every
 * page load — a regression in scoring shows up here immediately.
 */

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

const sampleIcp: Icp = {
  valueProp: "Invoicing and e-Factura automation for Romanian SMBs.",
  targetTitles: ["Director General", "CEO", "Director Financiar"],
  targetSeniorities: ["founder", "c_level"],
  industries: ["E-commerce", "Retail"],
  caenCodes: ["4791", "6201"],
  companyTypes: ["smb"],
  countries: ["RO"],
  keywords: ["facturare", "e-factura"],
  exclusions: [],
  employeeMin: 10,
  employeeMax: 250,
  revenueMinRon: null,
  revenueMaxRon: null,
  confidence: 0.85,
  assumptions: [],
};

const sampleSignals: Signal[] = [
  {
    type: "anaf_revenue_growth",
    title: "Revenue up 42% to 5.4M RON (2025 filing)",
    evidenceUrl: "https://mfinante.gov.ro/domenii/informatii-contribuabili",
    strength: 0.61,
    detectedAt: daysAgo(20),
    dedupeKey: "sample-growth",
  },
  {
    type: "hiring_buyer_role",
    title: "Hiring a Director Financiar — your buyer, arriving soon",
    evidenceUrl: "https://example.ro/cariere",
    strength: 0.95,
    detectedAt: daysAgo(3),
    dedupeKey: "sample-hiring",
  },
];

export default function LeadsPage() {
  const breakdown = scoreLead({
    icp: sampleIcp,
    company: {
      dedupeKey: "example.ro",
      name: "Exemplu Retail SRL",
      domain: "example.ro",
      country: "RO",
      county: "Cluj",
      caen: "4791",
      cui: "12345678",
      employeesAnaf: 48,
      revenueRon: 5_400_000,
      vatRegistered: true,
      insolvencyStatus: null,
      source: "anaf",
    },
    person: { fullName: "Ana Popescu", title: "Director General" },
    signals: sampleSignals,
    email: { status: "verified", confidence: 0.94, isRoleAddress: false },
  });

  const jurisdiction = jurisdictionFor("RO");

  return (
    <>
      <PageHeader
        title="Leads"
        description="Decision-makers at sourced companies, ranked by fit, timing and how reachable they are."
      />

      <div className="mb-4 rounded-lg border border-border bg-accent-soft px-4 py-3 text-sm">
        <span className="font-medium">Worked example.</span> No leads have been
        sourced yet — this row is scored by the real engine so you can see what
        the list will show.
      </div>

      <article className="rounded-lg border border-border bg-surface">
        <div className="flex flex-wrap items-start gap-4 border-b border-border p-4">
          <ScoreBadge score={breakdown.total} />

          <div className="min-w-56 flex-1">
            <p className="font-medium">Ana Popescu</p>
            <p className="text-sm text-muted">Director General</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <Building2 className="h-3.5 w-3.5" aria-hidden />
              Exemplu Retail SRL · Cluj · CAEN 4791
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <Mail className="h-3.5 w-3.5" aria-hidden />
              ana.popescu@example.ro
              <span className="rounded bg-accent-soft px-1.5 py-0.5 text-xs">
                verified
              </span>
            </p>
          </div>

          <div className="min-w-56 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Why now
            </p>
            <p className="mt-1 text-sm">{summariseScore(breakdown)}</p>
            <ul className="mt-2 space-y-1">
              {sampleSignals.map((signal) => (
                <li key={signal.dedupeKey} className="text-sm">
                  <a
                    href={signal.evidenceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-accent underline underline-offset-2"
                  >
                    {signal.title}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-b border-border px-4 py-3 text-sm">
          <span className="font-medium">{jurisdiction.countryName}:</span>{" "}
          <span className="text-muted">{jurisdiction.summary}</span>{" "}
          <span className="text-muted">({jurisdiction.statute})</span>
        </div>

        <div className="p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            How this score was reached
          </p>
          <ScoreExplanation breakdown={breakdown} />
        </div>
      </article>

      <p className="mt-4 text-sm text-muted">
        Every score is broken down like this. A score you can&rsquo;t interrogate
        is a score you won&rsquo;t trust — and the signals behind it link
        straight to the filing or job posting they came from.
      </p>
    </>
  );
}
