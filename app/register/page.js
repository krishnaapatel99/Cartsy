// pages/auth/register.jsx
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function RegisterPage() {
  return (
   <div className="h-screen flex justify-center items-center bg-[#E5E5DD]">
     <div className="h-[98vh] rounded-xl">
      <AuthLayout >
      <h2 className="text-2xl font-semibold text-center mb-2 mt-18">CREATE ACCOUNT</h2>
      <p className="text-gray-500 text-center mb-6">
        Join us and explore more!
      </p>

      <div className="flex justify-center mb-6">
        <Link
          href="/login"
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-l-md"
        >
          Log In
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-black text-white rounded-r-md"
        >
          Sign Up
        </Link>
      </div>

      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Confirm your password"
          />
        </div>

        <button className="w-full bg-black text-white rounded-md py-3">
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-black font-semibold">
          Log in
        </Link>
      </p>
    </AuthLayout></div></div>
  );
}
