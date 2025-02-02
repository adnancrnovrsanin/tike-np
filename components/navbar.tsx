// components/Navbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/supabase/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard } from "lucide-react"; // Dodajemo ikonicu za admin panel

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/user/counts");
        if (res.ok) {
          const counts = await res.json();
          setFavoritesCount(counts.favorites);
          setCartCount(counts.cartItems);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsAdmin(user?.email === "adnancrnovrsanin48@gmail.com");
      if (user) {
        fetchCounts();
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === "adnancrnovrsanin48@gmail.com");
      if (session?.user) {
        fetchCounts();
      } else {
        setFavoritesCount(0);
        setCartCount(0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between bg-white rounded-xl border-2">
          <Link href="/">
            <div className="flex items-center px-6 py-5 bg-main border-r-2 rounded-l-lg">
              <span className="font-bold text-xl">TIKE.NP</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/products">
              <Button
                variant="neutral"
                className={cn(
                  "px-8 py-5",
                  pathname === "/products" && "bg-main"
                )}
              >
                Products
              </Button>
            </Link>

            <div className="relative">
              <Link href="/favorites">
                <Button
                  variant="neutral"
                  className={cn(
                    "px-8 py-5",
                    pathname === "/favorites" && "bg-main"
                  )}
                >
                  Favorites
                </Button>
                {favoritesCount > 0 && (
                  <div className="absolute -top-2 right-2 min-w-[20px] h-5 rounded-md bg-main text-text border-2 text-xs flex items-center justify-center px-1">
                    {favoritesCount}
                  </div>
                )}
              </Link>
            </div>

            <div className="relative">
              <Link href="/cart">
                <Button
                  variant="neutral"
                  className={cn("px-8 py-5", pathname === "/cart" && "bg-main")}
                >
                  Cart
                </Button>
                {cartCount > 0 && (
                  <div className="absolute -top-2 right-2 min-w-[20px] h-5 rounded-md bg-main text-text border-2 text-xs flex items-center justify-center px-1">
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>

            {user ? (
              <div className="px-8 py-3 border-l-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:opacity-80">
                      <AvatarImage src={user.user_metadata.avatar_url} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <Link href="/admin">
                          <DropdownMenuItem>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <Link href="/orders">
                      <DropdownMenuItem>My Orders</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  className={cn(
                    "px-8 py-5 bg-main rounded-none border-l-2 mr-2",
                    pathname === "/login" && "bg-[#e6c9b5]"
                  )}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
