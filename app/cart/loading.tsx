// app/cart/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCart() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-[370px]">
            <Skeleton className="relative flex flex-col items-start w-[370px] h-[500px] shadow-[6px_6px_0px_2px_#1e1e1e]">
              <Skeleton className="absolute top-[100px] left-[8px] w-[350px] h-[70px]" />
              <Skeleton className="w-full h-[250px] mt-5" />
              <div className="flex flex-col items-center w-full p-6 gap-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center justify-between w-full mt-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-24 h-10" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
              </div>
            </Skeleton>
            <Skeleton className="mt-2 h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
