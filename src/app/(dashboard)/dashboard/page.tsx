import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import BrandCard from "@/components/brand/BrandCard";

interface BrandRow {
  id: string;
  name: string;
  slug: string;
  updated_at: string | null;
  onboarding_data?: {
    offering?: string;
  } | null;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("user_id", user?.id)
    .order("updated_at", { ascending: false });
  const typedBrands = (brands || []) as BrandRow[];

  if (typedBrands.length > 0) {
    redirect(`/dashboard/brands/${typedBrands[0].id}`);
  }

  return (
    <div>
      {/* Top Bar - Flow Design Style */}
      <div
        className="flex items-center justify-between border-b"
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid var(--flow-border-main)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "var(--flow-text-muted)",
              textTransform: "uppercase",
            }}
          >
            Brand Manual Generator
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 200,
              color: "var(--flow-text-heading)",
              margin: "4px 0 0",
            }}
          >
            Mis Marcas
          </h1>
        </div>
        <Link
          href="/dashboard/brands/new"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
          style={{
            padding: "6px 14px",
            borderRadius: "var(--flow-radius-button)",
            border: "none",
            background: "var(--flow-bg-secondary)",
            color: "var(--flow-phase-1)",
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          <Plus size={14} />
          Nueva Marca
        </Link>
      </div>

      {/* Stats Bar - Flow Design Style */}
      <div
        className="flex border-b"
        style={{
          padding: "12px 32px",
          borderBottom: "1px solid var(--flow-border-main)",
          gap: "24px",
          background: "var(--flow-bg-stats)",
        }}
      >
        {[
          { label: "Total Marcas", value: typedBrands.length, highlight: true },
          { label: "Módulos Generables", value: 42, highlight: false },
        ].map((stat, i) => (
          <div key={i}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 300,
                color: stat.highlight ? "var(--flow-phase-1)" : "var(--flow-text-heading)",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "8px",
                color: "var(--flow-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>
        {typedBrands.length === 0 ? (
          <div
            className="text-center border border-dashed"
            style={{
              padding: "80px 20px",
              borderRadius: "var(--flow-radius-card)",
              background: "rgba(24, 24, 27, 0.4)",
              border: "1px dashed var(--flow-border-element)",
            }}
          >
            <h3
              className="mb-2"
              style={{
                fontSize: "18px",
                fontWeight: 400,
                color: "var(--flow-text-heading)",
              }}
            >
              Aún no tienes marcas
            </h3>
            <p
              className="mb-6"
              style={{ fontSize: "13px", color: "var(--flow-text-secondary)" }}
            >
              Comienza el proceso de onboarding para crear tu primer manual de marca.
            </p>
            <Link
              href="/dashboard/brands/new"
              className="underline"
              style={{ fontSize: "13px", color: "var(--flow-phase-1)" }}
            >
              Ir al Onboarding
            </Link>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {typedBrands.map((brand) => (
              <BrandCard
                key={brand.id}
                id={brand.id}
                name={brand.name}
                slug={brand.slug}
                offering={brand.onboarding_data?.offering}
                updatedAt={brand.updated_at || undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
