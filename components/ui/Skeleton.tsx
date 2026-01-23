import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-slate-700/50",
                className
            )}
        />
    );
}

// Card Skeleton - for general card loading states
export function CardSkeleton({ className }: SkeletonProps) {
    return (
        <div className={cn("glass-card p-6", className)}>
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
}

// Event Card Skeleton
export function EventCardSkeleton() {
    return (
        <div className="flex items-start gap-6 md:gap-10">
            <div className="flex flex-col items-center">
                <Skeleton className="w-14 h-14 rounded-full" />
                <Skeleton className="w-0.5 h-24 mt-2" />
            </div>
            <div className="glass-card p-6 flex-1 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

// Gallery Image Skeleton
export function GalleryImageSkeleton() {
    return (
        <Skeleton className="aspect-square rounded-2xl" />
    );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
        </div>
    );
}

// Member/Student Card Skeleton
export function MemberCardSkeleton() {
    return (
        <div className="glass-card p-4 flex flex-col items-center">
            <Skeleton className="w-20 h-20 rounded-full mb-3" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
        </div>
    );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <tr className="border-b border-slate-800">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
}

// List Skeleton
export function ListSkeleton({ items = 3 }: { items?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                </div>
            ))}
        </div>
    );
}

// Full Page Skeleton
export function PageSkeleton() {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>
            <CardSkeleton className="h-64" />
        </div>
    );
}
