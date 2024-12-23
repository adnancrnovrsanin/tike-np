// app/products/[id]/components/image-gallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
    const [mainImage, setMainImage] = useState(0);

    return (
        <div className="space-y-4">
            {/* Main image */}
            <div className="relative h-[553px] w-full">
                <Image
                    src={images[mainImage]}
                    alt={alt}
                    fill
                    className="object-cover rounded-lg"
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setMainImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => setMainImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
                {images.map((image, i) => (
                    <button
                        key={i}
                        onClick={() => setMainImage(i)}
                        className={cn(
                            "relative h-[160px] w-full rounded-lg overflow-hidden",
                            mainImage === i && "ring-2 ring-[#fd9745]"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${alt} ${i + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}