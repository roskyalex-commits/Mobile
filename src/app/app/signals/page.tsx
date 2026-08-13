import { ExternalLink, Radar } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/app-shell/page";
import { SIGNAL_SOURCE_CATALOGUE } from "@/lib/signals/scanner";

export default function SignalsPage() {
  const romanian = SIGNAL_SOURCE_CATALOGUE.filter((s) => s.romaniaOnly);
  const universal = SIGNAL_SOURCE_CATALOGUE.filter((s) => !s.romaniaOnly);

  return (
    <>
      <PageHeader
        title="Signals"
        description="Why a lead is worth contacting now. Every signal links back to the public source it came from."
      />

      <EmptyState icon={Radar} title="No signals detected yet">
        Signals appear once companies are sourced and the hourly scan has run.
        The sources below are what the agent watches.
      </EmptyState>

      <section className="mt-8">
        <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-muted">
          Romanian registry
        </h2>
        <p className="mb-3 text-sm text-muted">
          Official, free, and structurally unavailable to international tools.
        </p>
        <SourceList sources={romanian} />
      </section>

      <section className="mt-8">
        <h2 className="mb-1 text-sm font-medium uppercase tracking-wide text-muted">
          Web and first-party
        </h2>
        <p className="mb-3 text-sm text-muted">
          Read from companies&rsquo; own sites and public news. No API keys, no
          quotas.
        </p>
        <SourceList sources={universal} />
      </section>

      <div className="mt-8 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start gap-2">
          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
          <div className="text-sm text-muted">
            <p className="font-medium text-foreground">
              Every signal carries a link to its source
            </p>
            <p className="mt-1">
              A score you can&rsquo;t interrogate is a score you won&rsquo;t
              trust. Click any signal to see the filing, job posting or article
              behind it. Notably absent: LinkedIn engagement — it needs either a
              paid API or a terms-violating scraper, and neither belongs in a
              tool that has to keep working.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function SourceList({
  sources,
}: {
  sources: typeof SIGNAL_SOURCE_CATALOGUE;
}) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
      {sources.map((source) => (
        <li key={source.key} className="px-4 py-3">
          <p className="font-medium">{source.label}</p>
          <p className="mt-0.5 text-sm text-muted">{source.description}</p>
        </li>
      ))}
    </ul>
  );
}
