// pages/auth/login.jsx
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  return (
   <div className="h-screen flex justify-center items-center bg-[#E5E5DD]">
   <div className="h-[80vh] rounded-xl">
      <AuthLayout>
      <h2 className="text-2xl font-semibold text-center mb-2">WELCOME BACK!</h2>
      <p className="text-gray-500 text-center mb-6">
        Access your personal account by logging in.
      </p>

      <div className="flex justify-center mb-6">
        <Link
          href="/login"
          className="px-6 py-2 bg-black text-white rounded-l-md"
        >
          Log In
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-r-md"
        >
          Sign Up
        </Link>
      </div>

      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your password"
          />
          <p className="text-right text-sm text-gray-500 mt-2 cursor-pointer">
            Forgot Password?
          </p>
        </div>

        <button className="w-full bg-black text-white rounded-md py-3">
          Log In
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Don’t have an account?{" "}
        <Link href="/register" className="text-black font-semibold">
          Sign up
        </Link>
      </p>
    </AuthLayout>
   </div>
   </div>
  );
}
