import { Users } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/app-shell/page";

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        title="Leads"
        description="Decision-makers at sourced companies, scored on ICP fit, signal strength and how reachable they are."
      />
      <EmptyState icon={Users} title="No leads yet">
        Leads appear once companies are sourced and the enrichment waterfall has
        run against them.
      </EmptyState>
    </>
  );
}
