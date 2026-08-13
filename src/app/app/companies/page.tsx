import { Building2 } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/app-shell/page";

export default function CompaniesPage() {
  return (
    <>
      <PageHeader
        title="Companies"
        description="Matched against the Romanian trade register by CAEN code, county, headcount and filed revenue."
      />
      <EmptyState icon={Building2} title="No companies sourced yet">
        The registry engine is built but needs a database. Create the Supabase
        project, run <code className="font-mono">npm run db:setup</code>, then
        seed the ONRC bulk dataset.
      </EmptyState>
    </>
  );
}
