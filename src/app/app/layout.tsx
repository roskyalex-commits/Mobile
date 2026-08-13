import { Sidebar } from "@/components/app-shell/sidebar";

/**
 * Application shell: fixed navigation rail on the left, routed content on the
 * right. Everything under /app renders inside this.
 *
 * Counts are passed from here rather than fetched inside the sidebar so the
 * nav stays a presentational component and the data fetch happens once per
 * navigation, in a server component.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  // TODO(phase-6): replace with real counts once leads and drafts are flowing.
  const counts = {};

  return (
    <div className="min-h-screen">
      <Sidebar counts={counts} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-6 py-8 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
