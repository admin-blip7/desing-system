import Link from "next/link";

interface BrandCardProps {
  id: string;
  name: string;
  slug: string;
  offering?: string;
  updatedAt?: string;
  completedModules?: number;
  totalModules?: number;
}

export default function BrandCard({
  id,
  name,
  slug,
  offering,
  updatedAt,
  completedModules = 0,
  totalModules = 42
}: BrandCardProps) {
  return (
    <Link
      href={`/dashboard/brands/${id}`}
      className="group relative block transition-all duration-120"
      style={{
        background: "var(--flow-bg-card)",
        borderRadius: "var(--flow-radius-card)",
        padding: "var(--flow-pad-card)",
        border: "1px solid var(--flow-border-card)",
      }}
    >
      {/* Top gradient line on hover */}
      <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--flow-border-element)] to-transparent opacity-0 transition-opacity group-hover:opacity-100 group-hover:via-[var(--flow-phase-1)]" />

      {/* Icon circle */}
      <div
        className="mb-3 flex items-center justify-center text-sm font-bold transition-colors"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "4px",
          background: "var(--flow-bg-secondary)",
          color: "var(--flow-text-tertiary)",
        }}
      >
        {name.substring(0, 2).toUpperCase()}
      </div>

      {/* Name */}
      <h3
        className="mb-1 transition-colors"
        style={{
          fontSize: "13px",
          fontWeight: 400,
          color: "var(--flow-text-heading)",
        }}
      >
        {name}
      </h3>

      {/* Offering */}
      <p
        className="mb-3 line-clamp-2"
        style={{
          fontSize: "11px",
          color: "var(--flow-text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {offering || "Sin descripción"}
      </p>

      {/* Progress indicator */}
      <div
        className="mb-3 flex items-center gap-2"
        style={{ fontSize: "9px", color: "var(--flow-text-muted)" }}
      >
        <div
          className="h-1 flex-1 overflow-hidden rounded-full"
          style={{ background: "var(--flow-bg-secondary)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${totalModules > 0 ? (completedModules / totalModules) * 100 : 0}%`,
              background: "var(--flow-phase-1)",
            }}
          />
        </div>
        <span style={{ fontFamily: "monospace" }}>
          {completedModules}/{totalModules}
        </span>
      </div>

      {/* Footer with slug and date */}
      <div
        className="border-t pt-3"
        style={{
          borderTop: "1px solid var(--flow-border-main)",
          fontSize: "9px",
          color: "var(--flow-text-muted)",
          fontFamily: "monospace",
        }}
      >
        slug: {slug}
      </div>
      {updatedAt && (
        <div
          style={{
            fontSize: "9px",
            color: "var(--flow-text-disabled)",
            marginTop: "2px",
          }}
        >
          Updated {new Date(updatedAt).toLocaleDateString()}
        </div>
      )}
    </Link>
  );
}
