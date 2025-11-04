// components/AuthLayout.jsx
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
   
     <div className="h-[100%] w-[80vw] flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg">
    
      <div className="flex-1 flex items-center justify-center bg-white p-8 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="w-full max-w-md [&::-webkit-scrollbar]:hidden">{children}</div>
      </div>

    
      <div className="hidden md:flex flex-1 relative">
        <Image
          src="/login.png" 
          alt="Login background"
          fill
          className="object-cover"
        />
        <div className="absolute top-6 left-6 text-white font-bold text-lg">
          CARTZ <br />
          <span className="font-normal text-sm">Fashion Forward</span>
        </div>
      </div>
    </div>

  );
}
