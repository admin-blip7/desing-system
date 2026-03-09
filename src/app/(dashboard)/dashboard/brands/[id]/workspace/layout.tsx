import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, Layers, Route, Sparkles, Workflow } from "lucide-react";
import type { ReactNode } from "react";

const workspaceNav = [
  { href: "dev-plan", label: "Dev Plan", icon: Layers },
  { href: "flow-designer", label: "Flow Designer", icon: Workflow },
  { href: "roadmap", label: "Roadmap", icon: Route },
  { href: "personality-lab", label: "Personality Lab", icon: Sparkles },
  { href: "brand-generation", label: "Brand Generation IA", icon: Bot },
];

export default async function BrandWorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Verify brand exists and belongs to user
  const { data: brand } = await supabase
    .from("brands")
    .select("id, name, slug")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!brand) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--bm-card-border)] bg-[var(--bm-color-surface)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/brands/${id}`}
              className="inline-flex items-center gap-2 transition-colors text-[var(--bm-color-text-secondary)] hover:text-[var(--bm-color-text-primary)]"
            >
              <ArrowLeft size={16} />
              <span className="text-xs">Volver al Manual</span>
            </Link>
            <div className="h-4 w-px bg-[var(--bm-color-border)]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--bm-color-text-secondary)]">
                {brand.name || brand.slug}
              </p>
              <h1 className="text-lg font-light text-[var(--bm-color-text-primary)]">
                Workspace
              </h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={`/dashboard/brands/${id}/workspace/${item.href}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--bm-card-border)] px-3 py-1.5 text-xs text-[var(--bm-color-text-secondary)] transition-all hover:border-[var(--bm-color-accent)]/50 hover:text-[var(--bm-color-accent)]"
                >
                  <Icon size={12} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
