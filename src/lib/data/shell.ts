import { PLANS } from "@/lib/billing/limits";
import { demoDataset, isDemoMode } from "./demo";
import type { ShellContext } from "./types";

/**
 * Chrome context: who is signed in, what is waiting, how many credits are left.
 *
 * Read once per navigation in the app layout. When persistence lands this
 * becomes a session lookup plus three counts; the shape does not change.
 */
export async function getShellContext(): Promise<ShellContext> {
  const demo = isDemoMode();

  if (!demo) {
    // TODO(persistence): resolve from `getSessionContext` and count leads,
    // drafts and unread replies for the caller's org.
    return {
      user: { name: "You", email: "" },
      counts: {},
      credits: PLANS.free.maxEnrichmentsPerMonth,
      demo: false,
    };
  }

  const { contacts, agents } = demoDataset();
  const pendingDrafts = agents.reduce((sum, a) => sum + a.queue.length, 0);

  return {
    user: { name: "Alex", email: "you@catina.ro" },
    counts: {
      newLeads: contacts.filter((c) => c.fitFeedback === null).length,
      pendingDrafts,
    },
    credits: PLANS.free.maxEnrichmentsPerMonth,
    demo: true,
  };
}
