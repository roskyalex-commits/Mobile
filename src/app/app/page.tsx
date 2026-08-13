import { Radar } from "lucide-react";
import { EmptyState, PageHeader, StatCard } from "@/components/app-shell/page";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="What the agent found while you were away."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Companies sourced" value="—" hint="Romanian registry" />
        <StatCard label="Leads with contact" value="—" hint="after enrichment" />
        <StatCard label="Signals this week" value="—" hint="hiring, funding, filings" />
        <StatCard label="Awaiting your review" value="—" hint="drafted, not sent" />
      </div>

      <EmptyState icon={Radar} title="No agent runs yet">
        Set an ideal customer profile and the registry engine will start
        sourcing. Numbers here fill in once the pipeline runs.
      </EmptyState>
    </>
  );
}
