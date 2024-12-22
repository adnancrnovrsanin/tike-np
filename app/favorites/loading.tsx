// app/favourites/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingFavorites() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-[370px]">
            <Skeleton className="relative flex flex-col items-start w-[370px] h-[500px] shadow-[6px_6px_0px_2px_#1e1e1e]">
              {/* Simulator za orange shape overlay */}
              <Skeleton className="absolute top-[100px] left-[8px] w-[350px] h-[70px]" />

              {/* Simulator za product image */}
              <Skeleton className="w-full h-[250px] mt-5" />

              {/* Simulator za content */}
              <div className="flex flex-col items-center w-full p-6 gap-3">
                {/* Title skeleton */}
                <Skeleton className="h-8 w-3/4" />

                {/* Divider skeleton */}
                <Skeleton className="h-4 w-full" />

                {/* Actions and price skeleton */}
                <div className="flex items-center justify-between w-full mt-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-24 h-10" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
              </div>
            </Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
}
