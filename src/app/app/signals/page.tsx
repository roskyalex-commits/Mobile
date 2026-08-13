import { Radar } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/app-shell/page";

export default function SignalsPage() {
  return (
    <>
      <PageHeader
        title="Signals"
        description="Why a lead is worth contacting now — every signal links back to its public source."
      />
      <EmptyState icon={Radar} title="Signal sources land in phase 4">
        Hiring pages and Romanian job boards, Google News per company, ANAF
        revenue growth, VAT and insolvency status changes, new ONRC
        registrations, and tech-stack and pricing-page diffs.
      </EmptyState>
    </>
  );
}
