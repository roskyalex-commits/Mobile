"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app-shell/page";
import { AnalyzeForm } from "@/components/onboarding/analyze-form";
import { IcpReview } from "@/components/onboarding/icp-review";
import type { AnalyzeResult } from "@/lib/icp/analyze";
import type { Icp } from "@/lib/icp/schema";

export default function IcpPage() {
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [saved, setSaved] = useState<Icp | null>(null);

  return (
    <>
      <PageHeader
        title="Ideal customer"
        description="Who the agent goes looking for. Paste a website and correct what it infers."
      />

      {!result && !saved && <AnalyzeForm onResult={setResult} />}

      {result && !saved && (
        <IcpReview
          result={result}
          onConfirm={setSaved}
          onRestart={() => setResult(null)}
        />
      )}

      {saved && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-accent-soft p-4">
            <p className="font-medium">Profile ready</p>
            <p className="mt-1 text-sm text-muted">
              Persisting this and kicking off the sourcing run needs the
              database — create the Supabase project and run{" "}
              <code className="font-mono">npm run db:setup</code>.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 text-xs">
            {JSON.stringify(saved, null, 2)}
          </pre>
          <button
            type="button"
            onClick={() => {
              setSaved(null);
              setResult(null);
            }}
            className="rounded-lg border border-border px-6 py-3 transition hover:border-accent"
          >
            Start over
          </button>
        </div>
      )}
    </>
  );
}
