'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

export default function CollectionNotAvailable() {
  // Trigger navbar reveal animation
  useEffect(() => {
    window.__navbarAlreadyFired = true;
    window.dispatchEvent(new Event('navbarReveal'));
  }, []);

  return (
    <div className='bg-[#E5E5DD] min-h-screen'>
      <Navbar />
      <div className='container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center'>
        <div className='bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full'>
          <div className='flex justify-center mb-6'>
            <div className='bg-red-100 p-4 rounded-full'>
              <FaExclamationTriangle className='text-red-500 text-4xl' />
            </div>
          </div>
          
          <h1 className='text-3xl font-mono font-bold mb-4'>Collection Unavailable</h1>
          
          <p className='text-gray-600 mb-8 text-lg'>
            We're sorry, but this collection is currently not available. It may have been moved, removed, or is temporarily out of stock.
          </p>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link 
              href='/collections' 
              className='flex items-center justify-center gap-2 bg-black text-[#d8c7a8] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-gray-500/50 active:scale-95 transition-transform duration-150'
            >
              <FaArrowLeft />
              Back to Collections
            </Link>
            
            <Link 
              href='/' 
              className='flex items-center justify-center gap-2 bg-gradient-to-r from-[#f5eedc] via-[#e9dfc3] to-[#d8c7a8] text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity active:scale-95 transition-transform duration-150'
            >
              <FaHome />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
