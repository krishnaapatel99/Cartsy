'use client';
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { category, id } = useParams();
  const router = useRouter();

  
  useEffect(() => {
    window.__navbarAlreadyFired = true;
    window.dispatchEvent(new Event('navbarReveal'));
  }, []);

  useEffect(() => {
  const checkWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist/fetch', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const isProductInWishlist = data.data?.some(item => item.product_id === product?.id);
        setIsInWishlist(isProductInWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };
  if (product?.id) {
    checkWishlist();
  }
}, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${category}/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (category && id) {
      fetchProduct();
    }
  }, [category, id]);

  const toggleWishlist = async () => {
  try {
    
    const response = await fetch('/api/wishlist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: product.id }),
      credentials: 'include'
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to add to wishlist`);
    }
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
  } catch (error) {
    console.error('Error updating wishlist:', error);
    toast.error(error.message || 'Failed to update wishlist');
  }
};

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
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

  if (loading) {
    return (
      <div className="bg-[#E5E5DD] min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#E5E5DD] min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#E5E5DD] min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-4">The requested product could not be found.</p>
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#E5E5DD] min-h-screen'>
      <Navbar />
      
      <div className='container mx-auto px-4 py-8'>
        <button 
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-700 hover:text-black mb-6 transition-colors'
        >
          <FaArrowLeft />
          Back to {category}
        </button>
        
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='md:flex'>
            {/* Product Image */}
            <div className='md:w-1/2 relative h-[500px] md:h-[]'>
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className='object-cover'
                priority
              />
              <button 
                onClick={toggleWishlist}
                className='absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform'
              >
                <FaHeart className={`${isInWishlist ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`} />
              </button>
            </div>
            
            {/* Product Details */}
            <div className='p-6 md:w-1/2 flex flex-col'>
              <h1 className='text-3xl font-bold mb-2'>{product.name}</h1>
              <div className='flex items-center mb-4'>
                <div className='flex text-yellow-400'>
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className='text-gray-500 ml-2'>(24 reviews)</span>
              </div>
              
              <p className='text-2xl font-bold text-gray-800 mb-6'>${product.price}</p>
              
              <p className='text-gray-600 mb-6'>{product.description}</p>
              
              <div className='mt-auto'>
                <div className='flex items-center mb-6'>
                  <span className='mr-4 font-medium'>Quantity:</span>
                  <div className='flex items-center border rounded-lg overflow-hidden'>
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className='px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors'
                    >
                      -
                    </button>
                    <input
                      type='number'
                      min='1'
                      value={quantity}
                      onChange={handleQuantityChange}
                      className='w-16 text-center border-x border-gray-200 py-1 focus:outline-none'
                    />
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className='px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors'
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <button 
                    onClick={handleAddToCart}
                    className='flex items-center justify-center gap-2 bg-gradient-to-r from-[#f5eedc] via-[#e9dfc3] to-[#d8c7a8] text-black py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity'
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                  <button className='bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors'>
                    Buy Now
                  </button>
                </div>
              </div>
              <div >
    <h3 className=" font-medium text-gray-700 pt-6">Specifications</h3>
    <p className="text-gray-600">
      {product.specifications || "This product is made with premium quality materials and designed for long-lasting use."}
    </p>
  </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className='p-6 border-t border-gray-200'>
            <h3 className='text-xl font-semibold mb-4'>Product Details</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-medium text-gray-700'>Category</h4>
                <p className='capitalize'>{category}</p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Availability</h4>
                <p className='text-green-600'>In Stock</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      <Toaster position="top-center"   toastOptions={{
          className: '!bg-black !text-[#d8c7a8]',
          style: {
            background: 'black',
            color: '#d8c7a8',
          },
        }}/>
    </div>
  );
  
}
