import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";
import { EmptyState, PageHeader, StatCard } from "@/components/app-shell/page";
import { PLANS, checkQuota } from "@/lib/billing/limits";

export default function DashboardPage() {
  // TODO(phase-6): read real usage once the database is running. The plan
  // shape is real, so the allowances shown here are the ones that will apply.
  const plan = "free" as const;
  const usage = { companies: 0, enrichments: 0, drafts: 0 };
  const limits = PLANS[plan];

  const enrichmentQuota = checkQuota(plan, "enrichments", usage.enrichments);
  const draftQuota = checkQuota(plan, "drafts", usage.drafts);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="What the agent found while you were away."
        action={
          <Link
            href="/app/icp"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Set your ideal customer
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Companies sourced"
          value={usage.companies}
          hint={`${limits.maxCompanies.toLocaleString("en")} included`}
        />
        <StatCard
          label="Leads enriched"
          value={usage.enrichments}
          hint={`${enrichmentQuota.remaining} left this month`}
        />
        <StatCard label="Signals this week" value={0} hint="scanned daily on Free" />
        <StatCard
          label="Drafts awaiting review"
          value={usage.drafts}
          hint={`${draftQuota.remaining} left this month`}
        />
      </div>

      <EmptyState icon={Radar} title="No agent runs yet">
        Set an ideal customer profile and the registry engine starts sourcing
        from the Romanian trade register. Everything here fills in from the
        first run.
      </EmptyState>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
          On the {limits.name} plan
        </h2>
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface text-sm">
          {[
            [
              "Sourcing",
              `${limits.maxCompanies.toLocaleString("en")} companies — the Romanian registry is free, so this is generous.`,
            ],
            [
              "Enrichment",
              `${limits.maxEnrichmentsPerMonth}/month — this is the path that spends vendor credits, so it's the tight one.`,
            ],
            ["Sending", `${limits.maxSendsPerDay} messages/day from ${limits.maxConnectedMailboxes} mailbox.`],
            [
              "Review",
              limits.autoSend
                ? "Auto-send available per campaign."
                : "Every message waits for your approval. Auto-send needs Pro.",
            ],
            ["Export", limits.csvExport ? "CSV export included." : "Not included."],
          ].map(([label, detail]) => (
            <li key={label} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:gap-4">
              <span className="w-24 shrink-0 font-medium">{label}</span>
              <span className="text-muted">{detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
