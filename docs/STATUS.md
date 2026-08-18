# Where this project is

Written for whoever (human or agent) picks this up next, so nothing has to be
re-explained or re-derived. Update it when the answers change.

- **Branch:** `claude/gojiberry-competitor-saas-mglle8` — all work lives here.
  `main` does not have it, and no pull request is open.
- **Last commit:** `a542fe9` — email + password auth and workspace bootstrap.
- **Green:** 391 tests, clean `typecheck`, `lint` and `build`.

## What this is

Cătină: an AI sales agent that finds B2B leads who are in the market *now*.
Paste a website, it infers who buys from you, finds those companies in the
Romanian trade register, enriches contacts, watches for buying signals, drafts
outreach. Romania-first, built to run on free tiers. See `README.md` for the
pitch and the stack table.

## The one thing to understand first

**Everything third-party was written from documentation, never from an observed
response.** The environment this was built in had no outbound network beyond
npm, GitHub, Google Fonts and the Anthropic API. ANAF, ONRC, Supabase, Hunter
and Google were all unreachable — the gateway denied CONNECT at the proxy.

So the code is careful in a specific way: it parses defensively, it never
assumes a field exists, and anything untestable ships with a script that prints
the raw payload. Treat the verified/unverified ledger below as the real status,
not the test count.

## Setup from zero

```bash
npm install
npm run dev            # works immediately — no configuration needed
```

With no `.env.local` the app runs on a **demo dataset**: every screen renders,
and every score in it is computed by the real scoring engine rather than
written down. A "Demo data" marker sits in the sidebar and disappears on its
own once `NEXT_PUBLIC_SUPABASE_URL` is set. This is why `src/proxy.ts` returns
early when Supabase env is absent — without that, constructing the client threw
and every route 500'd.

To go beyond demo mode:

1. Supabase project at [database.new](https://database.new), **region Frankfurt
   (eu-central-1)**. Romanian personal data should stay in the EU; this is a
   design constraint, not a preference.
2. Fill `.env.local` from `.env.example`. Only five values matter to start:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (the **session pooler** URI,
   port 5432 — not the direct connection), `ANTHROPIC_API_KEY`. Plus
   `ENCRYPTION_KEY` from `openssl rand -base64 32`.
3. Supabase dashboard → Authentication → Sign In / Providers → Email → turn
   **Confirm email off**. The built-in mailer is capped at a few messages an
   hour and will block testing. The confirmation flow is built and works; it is
   just unusable for local development.
4. Supabase dashboard → Authentication → URL Configuration → Site URL
   `http://localhost:3000`.

```bash
npm run db:setup       # drizzle push, then apply RLS policies
npm run verify:rls     # MUST fully pass before any real user exists
npm run db:types       # replaces the placeholder Database type (see below)
```

`verify:rls` creates two workspaces and asserts one cannot read the other. It
is not optional — an un-policied tenant table is a cross-org data leak.

## Verified vs unverified

| Area | State |
|---|---|
| All 18 `/app` routes render | **Verified** — 200 in dev, screenshotted at 1440px |
| Scoring, compliance, MIME, CSV, patterns, seniority | **Verified** — 391 unit tests |
| Chart geometry | **Verified** — monotone-cubic overshoot is explicitly tested |
| Demo mode with no env | **Verified** |
| `db:setup` / RLS policies | **Never run.** No database has ever existed |
| Auth signup → workspace → `/app` | **Never run** against a live Supabase |
| ANAF response field names | **From documentation.** `npm run verify:anaf` prints the raw payload for exactly this reason — expect a fix |
| ONRC CSV column mapping | **Never seen the file.** `--dry-run` prints the detected header; the mapping is one exported const |
| Hunter / Prospeo / PDL shapes | **From documentation.** Hunter is the most confident, Prospeo the least |
| Claude ICP inference end to end | **Never run** with a real key |
| Gmail send | Routes not written yet |

## Decisions that should not be relitigated

Each of these was made deliberately and has a cost attached to reversing it.

- **Cloudflare Workers, not Vercel.** Vercel's Hobby tier forbids commercial
  use; Cloudflare's free tier permits it. Consequences: no `node:crypto` (use
  WebCrypto), no `Buffer`, and outbound port 25 is blocked — which is why
  per-mailbox SMTP verification sits behind an unimplemented interface.
- **Drizzle for schema only.** Runtime access goes through PostgREST with the
  caller's JWT so RLS applies. A service-role connection at runtime would
  bypass the entire tenancy boundary.
- **`drizzle/policies.sql` is the tenancy boundary**, not application code.
  `orgs` deliberately has no insert policy for `authenticated` — org creation
  decides tenancy, so it belongs to the service role.
- **Org bootstrap is a route, not a `handle_new_user` trigger.** A trigger that
  throws fails signup inside GoTrue with no surfaced error; a route returns a
  status code you can read in the network tab.
- **No LinkedIn.** Engagement data needs a paid API or a terms-violating
  scraper. Where the reference product plots "invitations sent", this plots
  companies sourced and signals detected — things it can measure.
- **No reply tracking.** Reading a Gmail mailbox needs `gmail.readonly`, which
  Google classifies as **restricted**: an annual CASA Tier 2 assessment,
  roughly $540–1,000/yr. Sending needs only `gmail.send` and `gmail.compose`,
  which are *sensitive* — about ten days of verification, no fee. So reply rate
  stays at zero rather than being estimated, and deliverability is reported
  instead because it is actually measured.
- **No Apollo.** Its free and Basic plans include no API access at all; the API
  starts around $745/mo. This was checked, not assumed.
- **Pages never touch the database.** They read `src/lib/data/*`, which returns
  typed view models — fixtures today, queries as persistence lands. Keeping
  that seam is why the UI will not be rebuilt underneath.
- **Romania warns, it does not block.** Law 506/2004 requires express prior
  consent for commercial email with no B2B exemption, and ANSPDCP fines run
  RON 5,000–100,000 or up to 2% of turnover. The app warns and records an
  acknowledgement; only the do-not-contact list blocks outright. The send
  decision stays with the user — that was their explicit call.

## Next steps, in order

Each unlocks the next. Do not skip ahead — step 4 produces nothing until step 3
has rows.

1. **Verify auth** (user action). `db:setup` → `verify:rls` → sign up at
   `/signup` → land on `/app` with the demo marker **gone** and every count at
   zero. That transition is the signal that you are reading a real database.
2. **Agent persistence.** `POST`/`GET /api/v1/agents` using the
   **request-scoped** client so RLS applies — the admin client must not appear
   on this path. Validate with the existing `icpSchema`. Wire the onboarding
   wizard's "Create agent" button (`src/components/onboarding/wizard.tsx`, marked
   `TODO(persistence)`) and make `src/lib/data/agents.ts` read from the table.
3. **Seed the company table.** `AnafAdapter` searches the local `companies`
   table because ANAF has no search-by-CAEN endpoint — you can only look a
   company up once you know its CUI. Decision already taken: **narrow slice
   first** (one county or a handful of CAEN codes, a few thousand rows) to prove
   the chain, then scale with different flags. Needs `scripts/import-onrc.ts`
   (stream the data.gov.ro CSV, `--dry-run --max-rows --caen --county --resume`)
   and `scripts/enrich-registry.ts` (batch through `AnafClient.lookupByCui`,
   100 per request at ~1/s).
4. **First sourcing run.** `src/lib/pipeline/source-run.ts` plus
   `POST /api/v1/sourcing/run`, bounded to ~25 companies per invocation and
   **synchronous, not queued** — wiring five queue consumers before a single
   lead exists means debugging the queue and the pipeline simultaneously.
5. **Email waterfall** against real leads. `EmailWaterfall.resolve()` exists and
   is tested; it needs callers and at least one provider key, or it degrades to
   MX + role addresses + pattern inference.
6. **Gmail OAuth.** `/api/v1/auth/google/{start,callback}`, storing the refresh
   token encrypted via the existing `src/lib/outreach/crypto.ts`. Needs a Google
   Cloud project first.

Out of scope until the above works: queue consumers, cron handlers, the
unsubscribe endpoint, Copilot.

## Landmines

- **`src/lib/supabase/types.ts` is a placeholder.** Every selected column
  arrives as `unknown`, which is why `src/lib/supabase/row.ts` exists to narrow
  at runtime rather than cast. Run `npm run db:types` once a project exists and
  the placeholder is replaced wholesale; the row helpers stay correct, just
  redundant.
- **Supabase free tier is 500MB.** The full Romanian register is roughly 4M rows
  and would exceed it. Hence the narrow-slice decision in step 3, and
  `npm run db:size` should be added to check the estimate against reality.
- **ANAF enrichment is rate-limited** to one request per 1.1s, 100 CUIs per
  request. Four million companies is ~12 hours unattended. `AnafClient`
  serialises through a promise queue that survives a rejected call.
- **`fetchRevenueGrowth` returns null for an unfiled year.** A missing filing is
  not zero revenue, and treating it as zero would invent a collapse.
- **Diff-based signals need two scans.** Tech-stack changes, pricing changes and
  hiring surges produce nothing on a first run, by design.
- **`AGENTS.md` is regenerated by `next dev`.** Deleting the block from a diff
  only recreates it as an uncommitted change; commit it with the work instead.
