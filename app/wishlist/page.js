'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaHeart, FaTrash, FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const router = useRouter();

  // Trigger navbar reveal animation
  useEffect(() => {
    window.__navbarAlreadyFired = true;
    window.dispatchEvent(new Event('navbarReveal'));
  }, []);

  useEffect(() => {
    if (wishlist.items.length === 0) return;

    const cards = containerRef.current?.querySelectorAll('.wishlist-item');
    if (!cards?.length) return;

    // Set initial state
    gsap.set(cards, { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
      onComplete: () => {
        setLoading(false);
      }
    });

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true
      }
    });

    // Staggered animation for each card
    tl.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
      stagger: {
        amount: 0.4,
        from: 'random'
      }
    });

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [wishlist.items]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/wishlist/fetch');
        
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }
        
        const data = await response.json();
        setWishlist({
          ...data.wishlist,
          items: data.items || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const response = await fetch('/api/wishlist/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }

      // Refresh wishlist data
      const data = await response.json();
      setWishlist({
        ...wishlist,
        items: wishlist.items.filter(item => item.id !== itemId)
      });
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      setError('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          price_at_add: product.price
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      // Optional: Show success message
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#E5E5DD] min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading your wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E5E5DD] min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-2xl font-semibold text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='bg-[#E5E5DD] min-h-screen'>
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-mono font-bold mb-8 text-center flex items-center justify-center gap-2'>
          <FaHeart className='text-red-500 inline-block' /> MY WISHLIST
        </h1>
        
        {wishlist.items.length === 0 ? (
          <div className='text-center py-16'>
            <FaHeart className='mx-auto text-gray-400 text-6xl mb-4' />
            <h2 className='text-2xl font-semibold mb-2'>Your wishlist is empty</h2>
            <p className='text-gray-600 mb-6'>Looks like you haven't added anything to your wishlist yet.</p>
            <Link 
              href='/products/all' 
              className='bg-black text-[#d8c7a8] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-gray-500/50 active:scale-95 transition-transform duration-150'
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className='flex flex-col gap-8'>
            <div className='w-full' ref={containerRef}>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {wishlist.items.map((item) => (
                  <div 
                    key={item.id}
                    className='wishlist-item bg-white rounded-2xl shadow-lg p-6 flex flex-col'
                  >
                    <div className='w-full h-64 relative mb-4'>
                      {item.products?.image_url ? (
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name || 'Product'}
                          fill
                          className='object-contain rounded-lg'
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-100 rounded-lg flex items-center justify-center'>
                          <FaHeart className='text-gray-300 text-4xl' />
                        </div>
                      )}
                    </div>
                    
                    <div className='flex-grow'>
                      <h3 className='text-xl font-semibold mb-2'>{item.products?.name || 'Product Name'}</h3>
                      <p className='text-gray-600 mb-2 line-clamp-2'>{item.products?.description || 'No description available'}</p>
                      <p className='text-lg font-bold text-pink-500 mb-4'>${item.products?.price?.toFixed(2) || '0.00'}</p>
                      
                      <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                        <button 
                          onClick={() => handleAddToCart(item.products)}
                          className='flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#f5eedc] via-[#e9dfc3] to-[#d8c7a8] text-black py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity'
                        >
                          <FaShoppingCart />
                          <span>Add to Cart</span>
                        </button>
                        
                        <button 
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className='flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                        >
                          <FaTrash />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className='text-center mt-8'>
              <Link 
                href='/products/all' 
                className='inline-block bg-black text-[#d8c7a8] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-gray-500/50 active:scale-95 transition-transform duration-150'
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}