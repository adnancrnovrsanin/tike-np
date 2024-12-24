// app/orders/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingOrders() {
  return (
    <div className="bg-[#fff4e0] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Skeleton className="h-12 w-48 mb-8" />

        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e] p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2].map((j) => (
                  <div key={j} className="py-4 flex items-center gap-4">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
