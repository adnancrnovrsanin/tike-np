"use client";
import { login } from "./actions";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Neobutton } from "@/components/ui/neobutton";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    if (form) {
      const formData = new FormData(form);
      login(formData);
    }
  }

  const handleSignUpClick = () => {
    router.push("/register");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Login submitted");
  };

  return (
    <div className="min-h-screen bg-[#FFF4E0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg font-bold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="border-2 border-black rounded-md p-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg font-bold">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                required
                className="border-2 border-black rounded-md p-2 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <Neobutton
            type="submit"
            variant="neobrutal"
            className="w-full text-lg"
            onClickHandler={handleLogin}
          >
            Log In
          </Neobutton>
        </form>
        <div className="my-6 text-center flex flex-col items-center gap-2">
          <h3>
            <b>If you don't have an account</b>
          </h3>
          <hr />
          <Neobutton
            type="submit"
            variant="neobrutal"
            className="w-full text-lg bg-[#FD9745]"
            onClickHandler={handleSignUpClick}
          >
            Sign Up
          </Neobutton>
        </div>
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-blue-500 hover:underline font-semibold text-lg"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
