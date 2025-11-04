"use client";
import React from "react";
import { FaInstagram, FaTwitter, FaFacebookF, FaPinterestP } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black text-[#E5E5DD] py-20 border-t border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-8 md:px-16 grid md:grid-cols-4 gap-12">
      
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight font-serif text-[#FBFCF7]">
            CARTSY
          </h2>
          <p className="mt-4 text-base leading-relaxed max-w-sm text-[#E5E5DD]/80">
            Elevating fashion beyond trends — CARTSY brings cosmic elegance and
            timeless innovation to every look. Explore your new dimension of style.
          </p>
        </div>

    
        <div>
          <h3 className="text-lg font-semibold mb-4 font-serif text-[#FBFCF7]">
            Explore
          </h3>
          <ul className="space-y-2 text-[#E5E5DD]/80 text-[15px]">
            {["Home", "Shop", "About", "Contact"].map((item) => (
              <li
                key={item}
                className="hover:text-[#AFAFA7] cursor-pointer transition-colors duration-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 font-serif text-[#FBFCF7]">
            Customer Care
          </h3>
          <ul className="space-y-2 text-[#E5E5DD]/80 text-[15px]">
            {["Track Order", "Returns", "FAQs", "Support"].map((item) => (
              <li
                key={item}
                className="hover:text-[#AFAFA7] cursor-pointer transition-colors duration-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-semibold mb-4 font-serif text-[#FBFCF7]">
            Follow Us
          </h3>
          <div className="flex space-x-5 mt-3">
            {[FaInstagram, FaTwitter, FaFacebookF, FaPinterestP].map(
              (Icon, idx) => (
                <button
                  key={idx}
                  className="p-3 rounded-full bg-[#AFAFA7] hover:bg-[#FBFCF7] transition duration-300 flex items-center justify-center"
                >
                  <Icon size={20} className="text-black" />
                </button>
              )
            )}
          </div>
        </div>
      </div>

    
      <div className="border-t border-[#2a2a2a] mt-14 pt-6 text-center text-sm text-[#E5E5DD]/70 tracking-wide">
        © {new Date().getFullYear()} CARTSY — Crafted with cosmic inspiration ✨
      </div>
    </footer>
  );
}

export default Footer;
