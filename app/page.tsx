// page.tsx
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingBasket } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  // Sample product data
  const products: Product[] = [
    { name: "SprintMax 3000", price: 233, image: "/assets/sprintmax-3000.jpg" },
    { name: "AeroFlex Edge", price: 186, image: "/assets/aeroflex-edge.jpg" },
    {
      name: "ProRun Velocity",
      price: 132,
      image: "/assets/prorun-velocity.jpg",
    },
    // Add other products...
  ];

  return (
    <div className="min-h-screen bg-[#FFF4E0]">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex gap-16">
        <div className="flex-1 relative bg-[#FFBE99] shadow-[0px_0px_0px_5px_#FFBE99] rounded-lg">
          <Image
            src="/assets/hero.jpg"
            alt="Hero"
            layout="fill"
            objectFit="cover"
          />
          {/* Abstract designs */}
          <div className="absolute inset-0">
            {/* Add your abstract design elements here */}
          </div>
        </div>

        <div className="flex-1 space-y-16">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight">
              <span className="text-[#FD9745]">
                Step into comfort and style
              </span>
              <span className="text-[#191919]">
                {" "}
                - discover the perfect pair for every journey!
              </span>
            </h1>
          </div>

          <div className="bg-[#FFF4E0] rounded-xl border-2 border-[#262626] shadow-[8px_8px_0px_1px_#FFBE99] p-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-4xl font-extrabold text-[#262626]">+7000</p>
                <p className="text-lg text-[#262626]">Monthly Sales</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#262626]">+50000</p>
                <p className="text-lg text-[#262626]">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#262626]">+1000</p>
                <p className="text-lg text-[#262626]">Product Variety</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <Button className="bg-[#FD9745] mb-4 rounded-xl shadow-[4px_4px_0px_1px_#1E1E1E]">
            See product page
          </Button>
          <h2 className="text-5xl font-bold text-[#1A1A1A] mb-4">
            We have something new
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            We are thrilled to announce the arrival of our brand-new sports
            shoes, designed to enhance your athletic performance and comfort.
            Crafted with cutting-edge materials, these shoes feature lightweight
            construction, superior cushioning, and exceptional grip, making them
            perfect for any sporting activity.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-12">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              price={product.price.toString()}
              imageUrl={product.image}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[#1A1A1A] mb-4">
            WHY CHOOSE US?
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            TIKE.NP deliver exceptional quality, unmatched style, and superior
            comfort in every product we offer. With a commitment to innovation
            and customer satisfaction, we carefully design and curate footwear
            that meets the highest standards for performance and durability.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="relative h-[760px] rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1E1E1E] overflow-hidden">
            <Image
              src="/assets/men.jpg"
              alt="Men's Collection"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute top-20 left-12">
              <h3 className="text-6xl font-extrabold text-white">MEN</h3>
            </div>
          </div>

          <div className="relative h-[760px] rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1E1E1E] overflow-hidden">
            <Image
              src="/assets/woman.jpg"
              alt="Women's Collection"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute top-20 left-12">
              <h3 className="text-6xl font-extrabold text-white">WOMEN</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
