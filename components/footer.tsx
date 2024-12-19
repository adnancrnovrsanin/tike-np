import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Linkedin,
  Mail,
  MapPinHouse,
  Phone,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <footer className="flex flex-col w-[1668px] items-start gap-[50px] py-[100px] px-[113px] relative bg-white rounded-xl overflow-hidden border-2 border-[#262626] shadow-[10px_10px_0px_#262626]">
        <div className="flex items-start gap-20 relative self-stretch w-full">
          {/* Left Container */}
          <div className="flex flex-col w-[519px] items-start gap-[50px] relative">
            <div className="flex flex-col items-start gap-5 relative self-stretch w-full">
              <img
                className="relative w-[228.37px] h-[50px]"
                src="img/logo.svg"
                alt="Logo"
              />
              <p className="relative self-stretch font-outfit font-medium text-[#4C4C4D] text-xl leading-[30px]">
                Choose us to step confidently into a future of style,
                performance, and reliability!
              </p>
            </div>

            <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
              <div className="flex items-center gap-2.5 w-full justify-start font-outfit">
                <div className="flex items-center content-center border-2 rounded p-2 border-black bg-orange-200">
                  <Mail color="#000000" />
                </div>
                <span className="flex-1 text-[#262626] text-xl leading-[30px] font-medium">
                  hello@tike.np
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full justify-start font-outfit">
                <div className="flex items-center content-center border-2 rounded p-2 border-black bg-orange-200">
                  <Phone color="#000000" />
                </div>
                <span className="flex-1 text-[#262626] text-xl leading-[30px] font-medium">
                  +381/6000000
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full justify-start font-outfit">
                <div className="flex items-center content-center border-2 rounded p-2 border-black bg-orange-200">
                  <MapPinHouse color="#000000" />
                </div>
                <span className="flex-1 text-[#262626] text-xl leading-[30px] font-medium">
                  Somewhere in the World
                </span>
              </div>
            </div>
          </div>

          {/* Right Container */}
          <div className="flex items-start gap-[30px] flex-1">
            {/* Home Links */}
            <div className="flex flex-col items-start gap-6 flex-1">
              <h3 className="self-stretch font-outfit font-semibold text-[#262626] text-xl leading-[30px]">
                Home
              </h3>
              <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
                <span className="self-stretch font-outfit font-medium text-[#333333] text-xl leading-[30px]">
                  Features
                </span>
                <span className="self-stretch font-outfit font-medium text-[#333333] text-xl leading-[30px]">
                  Our Testimonials
                </span>
                <span className="w-full justify-start p-0 font-outfit text-xl text-[#333333] hover:bg-transparent">
                  FAQ
                </span>
              </div>
            </div>

            {/* About Us Links */}
            <div className="flex flex-col items-start gap-6 flex-1">
              <h3 className="self-stretch font-outfit font-semibold text-[#262626] text-xl leading-[30px]">
                About Us
              </h3>
              <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
                {[
                  "Our Mission",
                  "Our Vission",
                  "Awards and Recognitions",
                  "History",
                  "Distributors",
                ].map((item) => (
                  <span
                    key={item}
                    className="self-stretch font-outfit font-medium text-[#333333] text-xl leading-[30px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Us Links */}
            <div className="flex flex-col items-start gap-6 flex-1">
              <h3 className="self-stretch font-outfit font-semibold text-[#262626] text-xl leading-[30px]">
                Contact Us
              </h3>
              <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
                <span className="self-stretch font-outfit font-medium text-[#333333] text-xl leading-[30px]">
                  Information
                </span>
                <span className="self-stretch font-outfit font-medium text-[#333333] text-xl leading-[30px]">
                  Map & Direction
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-[30px] relative self-stretch w-full">
          <Separator className="w-full" />
          <div className="flex items-center justify-between self-stretch w-full">
            <div className="flex items-start gap-4">
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(
                (item, index) => (
                  <React.Fragment key={item}>
                    <div className="p-0 font-outfit font-medium text-lg text-[#333333] hover:bg-transparent">
                      {item}
                    </div>
                    {index < 2 && (
                      <Separator orientation="vertical" className="h-6" />
                    )}
                  </React.Fragment>
                )
              )}
            </div>
            <div className="flex gap-3">
              <div className="flex items-center content-center border-2 rounded p-2 border-black bg-orange-200">
                <Facebook color="#000000" />
              </div>
              <div className="flex items-center content-center border-2 rounded p-2 border-black bg-orange-200">
                <Twitter color="#000000" />
              </div>
              <div className="flex items-center content-center border-2 rounded p-2 border-black bg-orange-200">
                <Linkedin color="#000000" />
              </div>
            </div>
          </div>
          <Separator className="w-full" />
          <p className="self-stretch text-[#656567] text-lg text-center leading-[27px] font-outfit font-medium">
            Copyright © {new Date().getFullYear()} Tike.np All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
