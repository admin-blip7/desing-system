import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-[var(--bm-color-surface-muted)]", className)}
            {...props}
        />
    )
}

export function ModuleCardSkeleton() {
    return (
        <div className="h-48 rounded-xl border p-6 flex flex-col justify-between border-[var(--bm-card-border)] bg-[var(--bm-card-bg)]/70">
            <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    )
}

export function GridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <ModuleCardSkeleton key={i} />
            ))}
        </div>
    )
}

export { Skeleton }
