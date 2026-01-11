import {Skeleton} from "@/components/ui/skeleton";

export function TaskCardSkeleton() {
    return (
        <div className="border rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-6 w-20" />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Footer - Date and actions */}
            <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </div>
    );
}