'use client';
export const dynamic = "force-dynamic";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaHeart, FaTrash, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
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
    if (cart.items.length === 0) return;

    const cards = containerRef.current?.querySelectorAll('.cart-item');
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
  }, [cart.items]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cart/fetch');
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        
        const data = await response.json();
        setCart({
          ...data.cart,
          items: data.items || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      // Refresh cart data
      const data = await response.json();
      setCart({
        ...cart,
        items: cart.items.filter(item => item.id !== itemId)
      });
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.products?.price || 0) * (item.quantity || 1);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-[#E5E5DD] min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading your cart...</div>
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
        <h1 className='text-3xl font-mono font-bold mb-8 text-center flex items-center justify-center gap-2 mr-12'>
          <FaShoppingBag className='inline-block' /><span >MY</span>CART
        </h1>
        
        {cart.items.length === 0 ? (
          <div className='text-center py-16'>
            <FaShoppingCart className='mx-auto text-gray-400 text-6xl mb-4' />
            <h2 className='text-2xl font-semibold mb-2'>Your cart is empty</h2>
            <p className='text-gray-600 mb-6'>Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link 
              href='/collections' 
              className='bg-black text-[#d8c7a8] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-gray-500/50 active:scale-95 transition-transform duration-150'
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='lg:w-2/3' ref={containerRef}>
              <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
                {cart.items.map((item) => (
                  <div 
                    key={item.id}
                    className='cart-item bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6'
                  >
                    <div className='w-48 h-48 relative flex-shrink-0'>
                      {item.products?.image_url ? (
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name || 'Product'}
                          width={192}
                          height={186}
                          className='w-full h-full object-contain rounded-lg'
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-100 rounded-lg flex items-center justify-center'>
                          <FaShoppingCart className='text-gray-400 text-2xl' />
                        </div>
                      )}
                    </div>
                    <div className='flex-grow w-full'>
                      <h3 className='text-xl font-semibold mb-2'>{item.products?.name || 'Product Name'}</h3>
                      <p className='text-gray-600 mb-2'>{item.products?.description || 'No description available'}</p>
                      <p className='text-lg font-bold  mb-4'>${item.products?.price?.toFixed(2) || '0.00'}</p>
                      
                      <div className='flex items-center justify-between mt-4'>
                        <div className='flex items-center border rounded-lg overflow-hidden'>
                          <button 
                            className='px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors'
                            onClick={() => {}}
                          >
                            -
                          </button>
                          <span className='px-4'>{item.quantity || 1}</span>
                          <button 
                            className='px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors'
                            onClick={() => {}}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveFromCart(item.id)}
                          className='text-gray-500 hover:text-black cursor-pointer flex items-center gap-2 transition-colors'
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
            
            {/* Order Summary */}
            <div className='lg:w-1/3 sticky top-24 h-[calc(100vh-14rem)]'>
              <div className='bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col'>
                <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
                
                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between'>
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Shipping</span>
                    <span className='text-green-600'>Free</span>
                  </div>
                  <div className='border-t pt-4 mt-2'>
                    <div className='flex justify-between font-bold text-lg'>
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className='w-full bg-gradient-to-r from-[#f5eedc] via-[#e9dfc3] to-[#d8c7a8] text-black py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2'
                  onClick={() => router.push('/ordersummary')}
                >
                  Proceed to Checkout
                </button>
                
                <Link 
                  href='/collections' 
                  className='w-full mt-4 bg-black text-[#d8c7a8] py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-gray-500/50 active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2'
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}