
"use client"
export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import AddressForm from '@/components/AddressForm';
import { ShoppingCartIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OrderSummaryPage = () => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState({
    address: null,
    cart_orders: [],
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0
  });
  const router = useRouter();

  

  useEffect(() => {
    window.__navbarAlreadyFired = true;
    window.dispatchEvent(new Event('navbarReveal'));
    fetchOrderSummary();
  }, []);

 const fetchOrderSummary = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/ordersummary');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch order summary');
    }

    const data = await response.json();

    const subtotal =
      data.cart_orders?.reduce(
        (sum, item) => sum + item.product?.price * item.quantity,
        0
      ) || 0;

    const shipping = subtotal > 0 ? 15 : 0;
    const discount = 0;
    const total = subtotal + shipping - discount;

    setOrderData({
      ...data,
      subtotal,
      shipping,
      discount,
      total,
    });
console.log(data.address)
   
    if (initialLoad && !data.address) {
      setShowAddressForm(true);
    }

  } catch (err) {
    setError('Failed to load order summary');
  } finally {
    setLoading(false);
    setInitialLoad(false);
  }
};


const handleAddressUpdate = async (newAddress) => {
  try {
    const response = await fetch('/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress),
    });

    const responseData = await response.json(); // Parse response first
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to save address');
    }

    toast.success('Address saved successfully!');
    setShowAddressForm(false);
    fetchOrderSummary();
  } catch (error) {
    console.error('Error saving address:', error);
    toast.error(error.message || 'Failed to save address. Please try again.');
  }
};
const startPayment = async () => {
  try {
     setIsProcessingPayment(true); 
    if (!orderData?.address) {
      toast.error("Please add a shipping address");
      return;
    }

    if (!orderData?.cart_orders?.length) {
      toast.error("Your cart is empty");
      return;
    }

    // 1 Create order on our server
    const res = await fetch("/api/razorpay/create", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
       
      },
      body: JSON.stringify({
        userId: orderData.userId, 
        items: orderData.cart_orders.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          name:item.product.name,
          price_each: item.product.price
        })),
        notes: {
          address_id: orderData.address.id,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping || 0,
          discount: orderData.discount || 0,
          total: orderData.total
        }
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create order');
    }

    const data = await res.json();

    // 2 Open Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.razorpay_order_id,
      amount: data.amount * 100,
      currency: "INR",
      name: "Your Store",
      description: `Order #${data.order_id}`,
      handler: async function (response) {
        try {
          // 3 Verify payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
          
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }),
          });

          if (!verifyRes.ok) {
            const errorData = await verifyRes.json().catch(() => ({}));
            throw new Error(errorData.message || 'Payment verification failed');
          }

          toast.success("Payment successful! Processing your order ");
          try {
            await fetch('/api/cart/clear', { 
              method: 'POST',
              headers: {
               
              }
            });
          } catch (cartError) {
            console.error('Error clearing cart:', cartError);
            
          }

         setTimeout(() => {
          router.push(`/order`);
        }, 1500);
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error(error.message || 'Error processing payment');
           setIsProcessingPayment(false);
        }
      },
      modal: {
        ondismiss: () => {
          toast("Payment cancelled");
        },
      },
      theme: { 
        color: "#000000",
        hide_topbar: false
      },
      prefill: {
        name: `${orderData.address.first_name || ''} ${orderData.address.last_name || ''}`.trim(),
        email: orderData.address.email || '',
        contact: orderData.address.phone_number || ''
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment error:', error);
    toast.error(error.message || "Failed to process payment. Please try again.");
  }
};


  if (loading && !showAddressForm) {
    return (
      <div className="min-h-screen bg-[#E5E5DD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-lg">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E5E5DD] flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchOrderSummary}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { address, cart_orders, subtotal, shipping, discount, total } = orderData;

  return (
    <div className="min-h-screen bg-[#E5E5DD]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Complete Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white shadow overflow-hidden sm:rounded-lg">
            {address ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-black" />
                    Shipping Address
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Change
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-900">{address.full_name}</p>
                  <p className="text-gray-600">{address.address_line1}</p>
                  {address.address_line2 && (
                    <p className="text-gray-600">{address.address_line2}</p>
                  )}
                  <p className="text-gray-600">
                    {[address.city, address.state, address.postal_code].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                  <p className="text-gray-600 mt-2">Phone: {address.phone || 'Not provided'}</p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors"
                >
                  + Add Shipping Address
                </button>
              </div>
            )}

            {/* Cart Items Section */}
            <div className="border-t border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              {cart_orders?.length > 0 ? (
                <div className="space-y-4">
                  {cart_orders.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                          {item.product?.image_url ? (
                            <Image 
                            src={item.product.image_url} 
                            alt={item.product.name}
                            width={80}  
                            height={80} 
                            className="w-full h-full object-cover"
/>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <ShoppingCartIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product?.name || 'Product'}</h3>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.product?.price * item.quantity).toFixed(2)}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">${item.product?.price} each</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">Start adding some products to your cart</p>
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/products')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({cart_orders?.length || 0} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
           
              
              <button
                 
  onClick={startPayment}
  disabled={!address || isProcessingPayment}
  className={`mt-6 w-full bg-black text-[#E5E5DD] py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer${
    isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''
  }`}
>
  {isProcessingPayment ? (
    <div className="flex items-center justify-center">
      <svg 
        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </div>
  ) : (
    'Proceed to Payment'
  )}
</button>
            </div>
            {/* Delivery Info Card */}
<div className="mt-4 bg-white p-6 rounded-lg shadow space-y-4">
  <h3 className="text-lg font-semibold text-gray-900">
    Delivery & Assurance
  </h3>

  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex justify-between">
      <span>Estimated Delivery</span>
      <span className="font-medium text-gray-900">
        5–7 Business Days
      </span>
    </div>

    <div className="flex justify-between">
      <span>Shipping Location</span>
      <span className="font-medium text-gray-900">
        Maharashtra, India
      </span>
    </div>

    <div className="flex justify-between">
      <span>Delivery Charges</span>
      <span className="font-medium text-green-600">
        Included
      </span>
    </div>
  </div>

  <div className="border-t pt-4 space-y-2 text-sm text-gray-500">
  
    <p>✔ Easy returns within 7 days</p>
    <p>✔ Customer support 24/7</p>
  </div>
</div>

          </div>
        </div>
      </div>

      {showAddressForm && (
        <AddressForm
          onClose={() => {
            if (orderData.address) {
              setShowAddressForm(false);
            }
          }}
          onSave={handleAddressUpdate}
          initialData={orderData.address || {}}
          disableClose={!orderData.address}
        />
      )}
       <Toaster position="top-center"   toastOptions={{
                className: '!bg-black !text-[#d8c7a8]',
                style: {
                  background: 'black',
                  color: '#d8c7a8',
                },
              }}/>
    </div>

  );
};

export default OrderSummaryPage;