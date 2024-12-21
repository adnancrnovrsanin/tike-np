// page.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingBasket } from "lucide-react";
import Image from "next/image";

// Define types for products
interface Product {
  name: string;
  price: number;
  image: string;
}

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
      {/* Navbar */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between bg-white rounded-xl border-2 border-[#262626]">
          <div className="flex items-center px-6 py-5 bg-[#FD9745] border-r-2 border-[#262626]">
            <span className="ml-4 font-bold text-xl">TIKE.NP</span>
          </div>

          <div className="flex items-center">
            <Button
              variant="neutral"
              className="px-8 py-5 border-x-2 border-[#262626]"
            >
              Search...
            </Button>
            <Button
              variant="neutral"
              className="px-8 py-5 border-x-2 border-[#262626]"
            >
              About Us
            </Button>
            <Button
              variant="neutral"
              className="px-8 py-5 border-x-2 border-[#262626]"
            >
              Products
            </Button>
            <Button
              variant="neutral"
              className="px-8 py-5 border-x-2 border-[#262626]"
            >
              Favorites
            </Button>
            <Button
              variant="neutral"
              className="px-8 py-5 border-x-2 border-[#262626]"
            >
              Basket
            </Button>
            <Button className="px-8 py-5 bg-[#FD9745] rounded-none border-l-2 border-[#262626] mr-2">
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex gap-16">
        <div className="flex-1 relative bg-[#FFBE99]">
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
                – discover the perfect pair for every journey!
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
          <Button className="bg-[#FD9745] mb-4">See product page</Button>
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
            <Card
              key={index}
              className="p-12 border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1E1E1E]"
            >
              <div className="relative mb-12">
                <div className="absolute top-24 left-3 w-full h-24 bg-[#FFF4E0] border-2 border-[#262626] -z-10" />
                <div className="relative w-full h-[354px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain" /* Osigurava da se slika pravilno uklopi */
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-center">
                  {product.name}
                </h3>
                <div className="border-t-2 border-[#4C4C4D] my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-4xl">${product.price}</span>
                  <div className="flex gap-4">
                    <Button variant="neutral" size="icon">
                      <Heart className="w-6 h-6" />
                    </Button>
                    <Button variant="neutral" size="icon">
                      <ShoppingBasket className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
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
              src="/img/text-container-2.png"
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

      {/* Footer */}
      <footer className="bg-white rounded-xl border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1E1E1E] mx-auto max-w-7xl px-8 py-16 mt-16">
        <div className="grid grid-cols-4 gap-20 mb-12">
          <div className="col-span-1">
            <Image
              src="/img/logo.svg"
              alt="Logo"
              width={228}
              height={50}
              className="mb-6"
            />
            <p className="text-[#4C4C4D] text-xl">
              Choose us to step confidently into a future of style, performance,
              and reliability!
            </p>
          </div>

          <div className="col-span-3 grid grid-cols-3 gap-8">
            {/* Footer links sections */}
            {["Home", "About Us", "Contact Us"].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-xl mb-6">{section}</h4>
                <ul className="space-y-4">
                  <li>
                    <Button
                      variant="default"
                      className="text-[#333333] text-xl"
                    >
                      Features
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="default"
                      className="text-[#333333] text-xl"
                    >
                      Our Mission
                    </Button>
                  </li>
                  {/* Add more links as needed */}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#262626] pt-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button variant="default" className="text-[#333333]">
                Terms of Service
              </Button>
              <div className="w-px h-6 bg-[#262626]" />
              <Button variant="default" className="text-[#333333]">
                Privacy Policy
              </Button>
              <div className="w-px h-6 bg-[#262626]" />
              <Button variant="default" className="text-[#333333]">
                Cookie Policy
              </Button>
            </div>
            <div className="flex gap-4">{/* Add social media icons */}</div>
          </div>
          <p className="text-center text-[#656567]">
            Copyright © [2024] Tike.np All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
