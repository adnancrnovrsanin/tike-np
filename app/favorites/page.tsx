"use client";
import FavoritesList from "@/components/favorites-list";
import Pagination from "@/components/pagination-bar";

const FavoritesPage = () => {
  const products = [
    { name: "SprintMax 3000", price: 233, image: "/assets/sprintmax-3000.jpg" },
    { name: "AeroFlex Edge", price: 186, image: "/assets/aeroflex-edge.jpg" },
    { name: "Bla123", price: 186, image: "/assets/aeroflex-edge.jpg" },
    { name: "BLA123", price: 186, image: "/assets/aeroflex-edge.jpg" },
    { name: "AAAAAAA", price: 186, image: "/assets/aeroflex-edge.jpg" },
    { name: "BBBBBBB", price: 186, image: "/assets/aeroflex-edge.jpg" },
    {
      name: "ProRun Velocity",
      price: 132,
      image: "/assets/prorun-velocity.jpg",
    },
  ];
  return (
    <div className="bg-[#FFF4E0] min-h-screen">
      <FavoritesList products={products} />
      <div className="flex justify-end my-10">
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={(page) => console.log(page)}
        />
      </div>
    </div>
  );
};

export default FavoritesPage;
