"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = supabaseBrowser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Magic link sent to your email ✉️");
        setEmail("");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#E5E5DD]">
      <div className="h-[80vh] rounded-xl">
        <AuthLayout>
          <h2 className="text-2xl font-semibold text-center mb-2">WELCOME BACK!</h2>
          <p className="text-gray-500 text-center mb-6">
            Enter your email to receive a magic link
          </p>

          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes("✉️") 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        </AuthLayout>
      </div>
    </div>
  );
}
