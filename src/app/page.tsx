"use client";

import { useState } from "react";
import { AnalyzeForm } from "@/components/onboarding/analyze-form";
import { IcpReview } from "@/components/onboarding/icp-review";
import type { AnalyzeResult } from "@/lib/icp/analyze";
import type { Icp } from "@/lib/icp/schema";

export default function Home() {
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [confirmed, setConfirmed] = useState<Icp | null>(null);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      {!result && !confirmed && (
        <>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Cătină
          </h1>
          <p className="mt-4 text-lg text-muted">
            Paste your website. We work out who buys from you, find those people
            in the Romanian company registry and across the web, and draft the
            first message.
          </p>
          <div className="mt-10">
            <AnalyzeForm onResult={setResult} />
          </div>
        </>
      )}

      {result && !confirmed && (
        <IcpReview
          result={result}
          onConfirm={setConfirmed}
          onRestart={() => setResult(null)}
        />
      )}

      {confirmed && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your ICP is set</h2>
          <p className="text-muted">
            Next: connect Gmail and let the agent start sourcing. That&rsquo;s the
            next build phase — the registry engine and enrichment waterfall land
            before this button does anything.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 text-xs">
            {JSON.stringify(confirmed, null, 2)}
          </pre>
          <button
            type="button"
            onClick={() => {
              setConfirmed(null);
              setResult(null);
            }}
            className="rounded-lg border border-border px-6 py-3 transition hover:border-accent"
          >
            Start over
          </button>
        </div>
      )}
    </main>
  );
}
