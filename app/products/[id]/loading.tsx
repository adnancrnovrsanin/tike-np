// app/products/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProduct() {
    return (
        <div className="bg-[#fff4e0] min-h-screen">
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e] p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image skeletons */}
                        <div className="space-y-4">
                            <Skeleton className="h-[553px] w-full rounded-lg" />
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-[160px] w-full rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Content skeletons */}
                        <div className="space-y-8">
                            <div>
                                <Skeleton className="h-12 w-3/4" />
                                <Skeleton className="h-8 w-1/4 mt-4" />
                            </div>
                            <Skeleton className="h-[1px] w-full" />
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <Skeleton className="h-12 flex-1 rounded-lg" />
                            </div>
                            <Skeleton className="h-40 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}