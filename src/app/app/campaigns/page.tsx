import { Mail } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/app-shell/page";

export default function CampaignsPage() {
  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Drafts wait for your approval by default. Auto-send is per campaign, off unless you turn it on."
      />
      <EmptyState icon={Mail} title="Outreach lands in phase 5">
        Gmail OAuth using gmail.send and gmail.compose — both sensitive scopes,
        so no CASA audit and no annual recertification.
      </EmptyState>
    </>
  );
}
