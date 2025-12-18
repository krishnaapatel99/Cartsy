// app/profile/user/page.js
"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiEdit } from 'react-icons/fi';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile/user');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E5E5DD]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E5E5DD]">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-md w-full">
          <p className="text-red-500 mb-4">No Profile found</p>
          <Link href="/" className="text-black hover:underline">
            ← Back to Home
          </Link>
          <br/>
           <Link href="/profile/form" className="text-black hover:underline">
            ← Add Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E5DD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-black text-white p-6">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-gray-300">Manage your account information</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-lg font-medium">
                  {userData?.full_name || 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-lg font-medium">{userData?.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="mt-1 text-lg font-medium">
                  {userData?.phone_number || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Link 
                href="/profile/form" 
                className="inline-flex items-center text-black hover:underline"
              >
                <FiEdit className="mr-2" />
                Change your profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}