import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, User } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bm-color-bg)] text-[var(--bm-color-text-primary)]">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-[var(--bm-color-border)] md:flex">
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bm-button-primary-bg)] font-bold text-[var(--bm-button-primary-text)]">
                            BM
                        </div>
                        <span className="font-bold tracking-tight">Brand Manual</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--bm-color-text-secondary)] transition-colors hover:bg-[var(--bm-color-surface-muted)] hover:text-[var(--bm-color-text-primary)]">
                        <LayoutDashboard size={18} />
                        Mis Marcas
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--bm-color-text-secondary)] transition-colors hover:bg-[var(--bm-color-surface-muted)] hover:text-[var(--bm-color-text-primary)]">
                        <FileText size={18} />
                        Templates
                    </Link>
                </nav>

                <div className="border-t border-[var(--bm-color-border)] p-4">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[var(--bm-color-text-secondary)]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bm-color-surface-muted)]">
                            <User size={14} />
                        </div>
                        <div className="flex-1 truncate">
                            <div className="truncate text-[var(--bm-color-text-primary)]">{user.email}</div>
                            <div className="text-xs text-[var(--bm-color-text-secondary)] opacity-70">Free Plan</div>
                        </div>
                        <Link href="/dashboard/settings" className="p-1 transition-colors hover:text-[var(--bm-color-text-primary)]">
                            <Settings size={16} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
