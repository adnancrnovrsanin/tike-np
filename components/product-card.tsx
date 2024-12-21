import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingBasket } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageUrl }) => {
  return (
    <Card className="relative flex flex-col items-start w-[370px] h-fit bg-white rounded-xl overflow-hidden border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e]">
      {/* Orange shape overlay */}
      <div className="absolute top-[100px] left-[8px] w-[350px] h-[70px] bg-[#ffefe5] border-2 border-[#262626]" />

      {/* Product Image */}
      <div className="w-full h-[250px] p-4 mt-5 z-10 relative flex items-center justify-center overflow-hidden">
        <div className="w-full h-[230px] p-4 z-10 relative overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="absolute"
          />
        </div>
      </div>

      {/* Content Group */}
      <div className="flex flex-col items-center w-full p-6 gap-3">
        {/* Product Title */}
        <h3 className="font-raleway font-bold text-2xl text-center text-[#262626]">
          {name}
        </h3>

        {/* Divider line */}
        <p className="font-outfit font-medium text-base text-center text-[#4C4C4D]">
          ---------------------------------------------
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between w-full mt-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ShoppingBasket className="w-6 h-6" />
          </button>

          <p className="font-outfit font-medium text-3xl text-black">
            ${price}
          </p>

          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
