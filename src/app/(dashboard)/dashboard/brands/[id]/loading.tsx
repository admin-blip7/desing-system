import { GridSkeleton } from "@/components/ui/LoadingSkeleton";
import { Skeleton } from "@/components/ui/LoadingSkeleton";

export default function Loading() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
            </div>

            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <GridSkeleton />
            </div>
        </div>
    );
}
