import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaHeart } from "react-icons/fa";

export default function page() {
  return (
    <div className='bg-[#E5E5DD]'>
      <Navbar/>
      {/* Updated parent div */}
      <div className='h-full mt-20 flex justify-start flex-wrap p-4 gap-x-8 gap-y-16'> 
        {/* Card 1 */}
        <div className='bg-white w-[45vh] h-[55vh] rounded-2xl shadow-lg p-4 flex flex-col justify-evenly items-center'> 
          <div className='h-[60%] w-[90%] relative flex justify-center items-center '>
            {/* image */}
            <img src="/product.jpg" alt="Product Image" className="w-full h-[100%] "/>
            <div className="absolute top-2 right-2 rounded-full p-2 cursor-pointer shadow-2xl shadow-black active:scale-50 duration-200">
              <FaHeart />
            </div>
          </div> 
          <div className='flex flex-col items-center justify-between'>
            <button className='bg-gradient-to-br from-pink-300 via-pink-400 to-purple-500 w-[35vh] h-[40px] rounded-xl text-white mt-2 mb-2 cursor-pointer active:scale-50 duration-300'>Remove from Cart</button>
            <button className='bg-gradient-to-r from-pink-500 to-purple-400 w-[35vh] h-[40px] rounded-xl text-white mt-2 mb-2 cursor-pointer active:scale-50 duration-300'>Buy Now</button>
          </div>
        </div>

        {/* Repeat this pattern for all other cards, removing the m-auto class */}

        {/* Card 2 */}
        <div className='bg-white w-[45vh] h-[55vh] rounded-2xl shadow-lg p-4 flex flex-col justify-evenly items-center'> 
          <div className='h-[60%] w-[90%] relative flex justify-center items-center '>
            <img src="/product.jpg" alt="Product Image" className="w-full h-[100%] "/>
            <button className="absolute top-2 right-2 rounded-full p-2 cursor-pointer shadow-2xl active:scale-50 duration-200 shadow-black">
              <FaHeart />
            </button>
          </div> 
          <div className='flex flex-col items-center justify-between'>
            <button className='bg-gradient-to-br from-pink-300 via-pink-400 to-purple-500 w-[35vh] h-[40px] rounded-xl text-white mt-2 mb-2 cursor-pointer active:scale-50 duration-300'>Remove from Cart</button>
            <button className='bg-gradient-to-r from-pink-500 to-purple-400 w-[35vh] h-[40px] rounded-xl text-white mt-2 mb-2 cursor-pointer active:scale-50 duration-300'>Buy Now</button>
          </div>
        </div>

        {/* ... and so on for all your cards */}

      </div>
      <Footer/>
    </div>
  );
}