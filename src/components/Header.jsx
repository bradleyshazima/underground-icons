import React from "react";
import { Logo } from "./page-icons";
import { FaRegStar } from "react-icons/fa";

export const Header = () => {
  return (
    <header id="hero" className="w-full h-[50vh] flex flex-col items-center text-center xl:px-52 px-4">
      <div className="w-full flex items-center justify-between h-20">
        <img src={Logo} alt="Logo" className="w-40 h-auto" />
        <a href="https://github.com/bradleyshazima/underground-icons" className="flex items-center gap-2 bg-[#ABAFD1] text-[#212135] py-2 px-4 rounded-2xl font-medium"><FaRegStar /> Star on github</a>
      </div>
      <div className="w-full flex flex-col items-center mt-16">
        <h1 className="text-4xl md:text-6xl ext font-bold tracking-tight bg-gradient-to-b from-[#ABAFD1] to-[#3b3b5900] bg-clip-text text-transparent">
          Underground Icons
        </h1>
        <p className="mt-4 w-1/2 text-lg text-white text-center flex flex-col">
          Extremely rare SVG icons, collected from the best underground open source figma designs.
          <span className="font-semibold text-[#a3a7ff]">Made by Underground Labs</span>
        </p>
      </div>
    </header>
  );
};