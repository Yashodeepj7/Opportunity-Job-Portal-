import React from "react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SiX } from "react-icons/si"; // ⭐ Twitter (X) new logo from react-icons

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 dark:border-gray-700 py-10 bg-white dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-6">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* BRAND */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#6A38C2]">
              Opport<span className="text-[#F83002]">unity</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Helping you find better career opportunities.
            </p>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-5">
            
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#6A38C2] hover:text-white transition"
            >
              <Facebook size={20} />
            </a>

            {/* Twitter X */}
            <a
              href="https://twitter.com"
              target="_blank"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#6A38C2] hover:text-white transition"
            >
              <SiX size={20} />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#6A38C2] hover:text-white transition"
            >
              <Instagram size={20} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#6A38C2] hover:text-white transition"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="mt-8 border-t border-gray-300 dark:border-gray-700"></div>

        {/* BOTTOM TEXT */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          © {new Date().getFullYear()} <span className="font-semibold">Opportunity</span>.  
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
