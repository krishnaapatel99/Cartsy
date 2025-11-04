"use client";
import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RxCross1 } from "react-icons/rx";

export default function Page() {
  return (
    <div className="bg-[#E5E5DD]">
      <Navbar />

      <div className="h-full mt-20 flex justify-start flex-wrap p-4 gap-x-8 gap-y-16">
        {/* Card 1 */}
        <div className="bg-white w-[45vh] h-[55vh] rounded-2xl shadow-lg p-4 flex flex-col justify-evenly items-center">
          <div className="h-[60%] w-[90%] relative flex justify-center items-center">
            <Image
              src="/product.jpg"
              alt="Product Image"
              width={400}
              height={400}
              className="w-full h-[100%] object-cover"
            />
            <div className="absolute top-2 right-2 rounded-full p-2 cursor-pointer shadow-2xl shadow-black">
              <RxCross1 />
            </div>
          </div>
          <div className="flex flex-col items-center justify-between">
            <button className="bg-gradient-to-br from-pink-300 via-pink-400 to-purple-500 w-[35vh] h-[40px] rounded-xl text-white mt-2 mb-2">
              Add to Cart
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-purple-400 w-[35vh] h-[40px] rounded-xl text-white mt-2 mb-2">
              Buy Now
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white w-[45vh] h-[55vh] rounded-2xl shadow-lg p-4 flex flex-col justify-evenly items-center">
          <div className="h-[60%] w-[90%] relative flex justify-center items-center">
            <Image
              src="/product.jpg"
              alt="Product Image"
              width={400}
              height={400}
              className="w-full h-[100%] object-cover"
            />
            <button className="absolute top-2 right-2 rounded-full p-2 cursor-pointer shadow-2xl shadow-black active:scale-50 duration-200">
              <RxCross1 />
            </button>
          </div>
          <div className="flex flex-col items-center justify-between">
            <button className="bg-gradient-to-br from-pink-300 via-pink-400 to-purple-500 w-[35vh] h-[40px] rounded-xl text-white mt-2 mb-2 cursor-pointer active:scale-50 duration-300">
              Add to Cart
            </button>
            <button className="bg-black w-[35vh] h-[40px] rounded-xl text-white mt-2 mb-2 cursor-pointer active:scale-50 duration-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
