"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { FiUser, FiShoppingBag, FiTag, FiSettings, FiLogOut, FiShield } from 'react-icons/fi';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in → redirect to login
        router.push("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="flex justify-center items-center bg-[#E5E5DD] text-black">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#E5E5DD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-6">
            <h1 className="text-2xl font-bold">My Account</h1>
            <p className="text-gray-300">Welcome back, {user.email}</p>
          </div>

          <div className="md:flex">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-gray-50 p-6 border-r border-gray-200">
              <div className="space-y-1">
                <Link
                  href="/profile/user"
                  className="flex items-center w-full p-3 rounded-lg bg-gray-100 text-black font-medium">
                  <FiUser className="mr-3" />
                  Profile
                </Link>
                <Link 
                  href="/order"
                  className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                  <FiShoppingBag className="mr-3" />
                  My Orders
                </Link>
                <Link 
                  href="/profile/user"
                  className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                  <FiTag className="mr-3" />
                  My Coupons
                </Link>
                <Link 
                  href="/profile/user"
                  className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                  <FiSettings className="mr-3" />
                  Account Settings
                </Link>
                <Link 
                  href="/admin/login"
                  className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                  <FiShield className="mr-3" />
                  Admin Dashboard
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <FiLogOut className="mr-3" />
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
                    <p className="text-gray-600">Update your personal details and preferences</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Order History</h3>
                    <p className="text-gray-600">View and track your orders</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Saved Coupons</h3>
                    <p className="text-gray-600">View your available discounts</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
                    <p className="text-gray-600">Manage password and security settings</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Recent Activity</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
