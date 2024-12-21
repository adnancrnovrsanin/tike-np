const FavoritesPage = () => {
  const products: Product[] = [
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
      <h1>Favorites</h1>
      {/* <FavoritesList /> */}
    </div>
  );
};

export default FavoritesPage;
