import Image from "next/image";

import { FC } from "react";
import ProductCard from "./product-card";

interface Product {
  name: string;
  image: string;
  price: number;
}

interface FavoritesListProps {
  products: Product[];
}

const FavoritesList: FC<FavoritesListProps> = ({ products }) => {
  return (
    <div className="flex flex-wrap gap-10 my-5 justify-center items-center">
      {products.map((product: any) => (
        <ProductCard
          key={product.name}
          name={product.name}
          price={product.price}
          imageUrl={product.image}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
