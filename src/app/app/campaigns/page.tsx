import { AlertTriangle, Check, Mail, ShieldCheck } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/app-shell/page";
import { jurisdictionFor } from "@/lib/outreach/compliance";
import { CONSERVATIVE_DAILY_LIMIT } from "@/lib/outreach/gmail";

/** Markets shown in the posture table, most relevant to this product first. */
const SHOWN_MARKETS = ["RO", "DE", "AT", "IT", "GB", "NL", "FR", "US"];

export default function CampaignsPage() {
  const jurisdictions = SHOWN_MARKETS.map(jurisdictionFor);

  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Drafts wait for your approval by default. Auto-send is per campaign, and off unless you turn it on."
      />

      <EmptyState icon={Mail} title="No campaigns yet">
        Outreach needs a connected Gmail account and leads to send to. Connect a
        mailbox in Settings once the database is running.
      </EmptyState>

      <section className="mt-8">
        <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-muted">
          What happens before anything sends
        </h2>
        <ul className="mt-3 space-y-2">
          {[
            `A hard cap of ${CONSERVATIVE_DAILY_LIMIT} messages per mailbox per day, spread across working hours with jitter.`,
            "Suppression is re-checked at send time, not when the message was queued — an unsubscribe that lands in between is still honoured.",
            "A draft containing an unfilled placeholder is discarded rather than sent.",
            "Every message carries a one-click unsubscribe header, sender identity, and a GDPR Article 14 note saying where the details came from.",
            "Messages are only drafted when there's a specific signal to open with. No signal, no send.",
          ].map((line) => (
            <li key={line} className="flex gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              <span className="text-muted">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <div className="mb-1 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted" aria-hidden />
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            Rules by market
          </h2>
        </div>
        <p className="mb-3 text-sm text-muted">
          &ldquo;GDPR compliance&rdquo; isn&rsquo;t one rule. Whether you may send an
          unsolicited commercial email is set by each country&rsquo;s ePrivacy
          implementation, and those differ sharply.
        </p>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="bg-surface">
              <tr className="border-b border-border">
                <th className="px-4 py-2.5 font-medium">Market</th>
                <th className="px-4 py-2.5 font-medium">Posture</th>
                <th className="px-4 py-2.5 font-medium">Basis</th>
              </tr>
            </thead>
            <tbody className="bg-surface">
              {jurisdictions.map((rule) => {
                const strict = rule.posture === "consent_required";
                return (
                  <tr key={rule.country} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-medium">{rule.countryName}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          strict ? "text-danger" : "text-muted"
                        }`}
                      >
                        {strict && (
                          <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                        )}
                        {rule.summary}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted">{rule.statute}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-muted">
          Romania is the strict case and this product&rsquo;s home market: Law
          506/2004 has no B2B exemption, and ANSPDCP fines run RON 5,000–100,000
          or up to 2% of turnover. Campaigns including Romanian recipients ask
          you to acknowledge that once. Sending stays your decision — only the
          do-not-contact list blocks outright. This is a summary, not legal
          advice.
        </p>
      </section>
    </>
  );
}
