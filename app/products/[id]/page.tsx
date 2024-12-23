// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prismadb";
import { createClient } from "@/supabase/server";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageGallery from "./components/image-gallery";
import SizeSelector from "./components/size-selector";
import RelatedProducts from "./components/related-products";

export default async function ProductPage({
                                              params
                                          }: {
    params: { id: string }
}) {
    try {
        const supabase = await createClient();
        const productId = parseInt(params.id);

        const { data: { user } } = await supabase.auth.getUser();

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                category: true,
                variants: true
            }
        });

        if (!product) {
            return notFound();
        }

        // Proveri favorite status ako je korisnik ulogovan
        let isFavorited = false;

        if (user) {
            const userProfile = await prisma.userProfile.findUnique({
                where: {
                    supabaseUserId: user.id
                },
                include: {
                    favorites: {
                        where: {
                            productId
                        }
                    }
                }
            });

            if (userProfile) {
                isFavorited = userProfile.favorites.length > 0;
            }
        }

        const productImage = product.imageUrl || "/placeholder.png";
        const images = [productImage, productImage, productImage];

        return (
            <div className="bg-[#fff4e0] min-h-screen">
                <div className="container mx-auto py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left side - Image gallery */}
                        <div>
                            <ImageGallery
                                images={images}
                                alt={product.name || "Product"}
                            />
                        </div>

                        {/* Right side - Product info */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-4xl font-bold font-raleway text-[#1e1e1e]">
                                    {product.name}
                                </h1>
                                <div className="mt-4 text-3xl font-outfit">
                                    ${(product.basePrice * (1 + product.margin)).toFixed(2)}
                                </div>
                            </div>

                            {/* Size selector */}
                            <div>
                                <SizeSelector variants={product.variants} />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="neutral"
                                    size="icon"
                                    className={`w-12 h-12 rounded-full ${
                                        isFavorited ? "text-red-500 fill-red-500" : ""
                                    }`}
                                >
                                    <Heart className="w-6 h-6" />
                                </Button>

                                <Button className="flex-1 h-12 bg-[#fd9745] hover:bg-[#fd9745]/90 text-black">
                                    ADD TO CART
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Product description */}
                    <div className="mt-16 text-center">
                        <h2 className="text-4xl font-bold font-raleway mb-6">
                            {product.name}
                        </h2>
                        <p className="text-lg text-[#4C4C4D] max-w-4xl mx-auto">
                            {product.description}
                        </p>
                    </div>

                    {/* Related products */}
                    <div className="mt-16">
                        <h3 className="text-3xl font-medium text-center mb-8">
                            See also...
                        </h3>
                        <RelatedProducts
                            currentProductId={product.id}
                            categoryId={product.categoryId!}
                        />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading product:", error);
        return notFound();
    }
}