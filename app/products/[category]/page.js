
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
            <button className='bg-gradient-to-r from-[#f5eedc] via-[#e9dfc3] to-[#d8c7a8]  shadow-sm w-[35vh] h-[40px] rounded-xl text-black mt-2 mb-2 cursor-pointer active:scale-50 duration-300'>Add to Cart</button>
            <button className='bg-black w-[35vh] h-[40px] rounded-xl text-[#d8c7a8] shadow-sm mt-2 mb-2 cursor-pointer active:scale-50 duration-300'>Buy Now</button>
          </div>
        </div>

        {/* Repeat this pattern for all other cards, removing the m-auto class */}

        {/* Card 2 */}
        

        {/* ... and so on for all your cards */}

      </div>
      <Footer/>
    </div>
  );
}