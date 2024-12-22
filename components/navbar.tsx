"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/supabase/client";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <div>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between bg-white rounded-xl border-2 border-[#262626]">
          <div className="flex items-center px-6 py-5 bg-main border-r-2 border-[#262626] rounded-l-lg">
            <span className="ml-4 font-bold text-xl">TIKE.NP</span>
          </div>

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

            <Link href="/favourites">
              <Button
                variant="neutral"
                className={cn(
                  "px-8 py-5",
                  pathname === "/favourites" && "bg-main"
                )}
              >
                Favourites
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="neutral"
                className={cn("px-8 py-5", pathname === "/cart" && "bg-main")}
              >
                Cart
              </Button>
            </Link>

            {user ? (
              <div className="px-8 py-3 border-l-2">
                <Avatar>
                  <AvatarImage src={user.user_metadata.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
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
