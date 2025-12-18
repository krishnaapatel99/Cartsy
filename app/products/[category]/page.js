'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster, toast } from 'react-hot-toast';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CategoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [wishlistStatus, setWishlistStatus] = useState({});
  const { category } = useParams();
  const containerRef = useRef(null);

  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const product = products.find(p => p.id === productId);
      const quantity = quantities[productId] || 1;
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          price_at_add: product.price
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart');
      }

      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add to cart');
    }
  };
  
  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value, 10);
    if (numValue > 0) {
      setQuantities(prev => ({
        ...prev,
        [productId]: numValue
      }));
    }
  };

  // Check wishlist status for products
  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist/fetch', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const statusMap = {};
        data.data?.forEach(item => {
          statusMap[item.product_id] = true;
        });
        setWishlistStatus(statusMap);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  // Toggle wishlist status
  const toggleWishlist = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update wishlist');
      }

      // Update local state
      setWishlistStatus(prev => ({
        ...prev,
        [productId]: !prev[productId]
      }));

      toast.success(wishlistStatus[productId] ? 'Removed from wishlist!' : 'Added to wishlist!');
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  // Trigger navbar reveal animation and check wishlist status
  useEffect(() => {
    window.__navbarAlreadyFired = true;
    window.dispatchEvent(new Event('navbarReveal'));
    checkWishlistStatus();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const cards = containerRef.current?.querySelectorAll('.product-card');
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
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(`Fetching products for category: ${category}`);
        const response = await fetch(`/api/products/${category}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  if (loading) {
    return (
      <div className="bg-[#E5E5DD] min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E5E5DD] min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='bg-[#E5E5DD] min-h-screen'>
      <div className='z-[100]'><Navbar /></div>
      
      <div className='container mx-auto px-4 py-10 opacity-0,' ref={containerRef} >
        {products.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-xl'>No products found in this category.</p>
          </div>
        ) : (
          <div 
         
      className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          >
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${category}/${product.id}`}
                className='product-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full transform'
              >
                {/* Image Section */}
                <div className='relative h-64 w-full flex-shrink-0'>
                  <Image 
                    src={product.image_url || '/placeholder-product.jpg'} 
                    alt={product.name}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                  <button 
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-lg hover:scale-110 transition-transform duration-200"
                  >
                    <FaHeart className={`${wishlistStatus[product.id] ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`} />
                  </button>
                </div>
                
                {/* Content Section */}
                <div className='p-4 flex flex-col flex-grow'>
                  {/* Product Name */}
                  <h3 className='text-lg font-semibold mb-2 line-clamp-2 h-14'>{product.name}</h3>
                  
                  {/* Description */}
                  <p className='text-gray-600 text-sm mb-4 line-clamp-2 flex-grow'>
                    {product.description || 'No description available'}
                  </p>
                  
                  {/* Price and Buttons */}
                  <div className='mt-auto pt-4 border-t border-gray-200'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xl font-bold'>${product.price}</span>
                      <div className='flex space-x-2'>
                        <div className='flex items-center border rounded-lg overflow-hidden'>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuantityChange(product.id, (quantities[product.id] || 1) - 1);
                            }}
                            className='px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-sm'
                          >
                            -
                          </button>
                          <input
                            type='number'
                            min='1'
                            value={quantities[product.id] || 1}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className='w-10 text-center border-x border-gray-200 py-1 text-sm focus:outline-none'
                          />
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuantityChange(product.id, (quantities[product.id] || 1) + 1);
                            }}
                            className='px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-sm'
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={(e) => handleAddToCart(product.id, e)}
                          className='flex items-center justify-center gap-1 bg-gradient-to-r from-[#f5eedc] via-[#e9dfc3] to-[#d8c7a8] px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap'
                        >
                          <FaShoppingCart className='text-sm' />
                          Add
                        </button>
                        <button className='bg-black px-3 py-1.5 rounded-lg text-[#d8c7a8] text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap'>
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: '!bg-black !text-[#d8c7a8]',
          style: {
            background: 'black',
            color: '#d8c7a8',
          },
        }}
      />
    </div>
  );
}