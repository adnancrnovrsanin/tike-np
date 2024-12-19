import React from "react";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingBasket } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageUrl }) => {
  return (
    <Card className="relative flex flex-col items-start w-[300px] h-[400px] bg-white rounded-xl overflow-hidden border-2 border-[#262626] shadow-[6px_6px_0px_2px_#1e1e1e]">
      {/* Orange shape overlay */}
      <div className="absolute top-[100px] left-[12px] w-[280px] h-[40px] bg-[#fd9745] border-2 border-[#262626]" />

      {/* Product Image */}
      <div className="w-full h-[250px] p-4">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content Group */}
      <div className="flex flex-col items-center w-full p-6 gap-4">
        {/* Product Title */}
        <h3 className="font-raleway font-bold text-2xl text-center text-[#262626]">
          {name}
        </h3>

        {/* Divider line */}
        <p className="font-outfit font-medium text-base text-center text-[#4C4C4D]">
          ---------------------------------------------
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between w-full mt-9">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ShoppingBasket className="w-6 h-6" />
          </button>

          <p className="font-outfit font-medium text-3xl text-black">{price}</p>

          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
