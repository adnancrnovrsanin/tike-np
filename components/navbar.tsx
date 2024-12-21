import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="bg-[#fff4e0]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between bg-white rounded-xl border-2 border-[#262626]">
          <div className="flex items-center px-6 py-5 bg-[#FD9745] border-r-2 border-[#262626] rounded-l-lg">
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
    </div>
  );
};

export default Navbar;
