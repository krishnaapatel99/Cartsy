"use client";
export const dynamic = "force-dynamic";


import React, { useLayoutEffect, useRef , useState, useEffect, useMemo} from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { SiWish } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import gsap from "gsap";
import { supabaseBrowser } from "@/lib/supabaseClient";



export default function Navbar() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const navbarRef = useRef(null);
  const hasAnimated = useRef(false); 
  const [user, setUser] = useState(null); 
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("Loading...");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

   useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user); 
    };

    getUser();

    // listen for login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
      };
      setTime(now.toLocaleTimeString([], options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

 
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
       
          const res = await fetch(
             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || "";
          const state = data.address.state || "";
          setLocation(`${city.toUpperCase()}, (${state.substring(0, 2).toUpperCase()})`);
        } catch (error) {
          setLocation("UNKNOWN LOCATION");
        }
      });
    } else {
      setLocation("LOCATION DISABLED");
    }
  }, []);

  useLayoutEffect(() => {
    const el = navbarRef.current;
    if (!el) return;

  
    gsap.set(el, { autoAlpha: 0, y: -100 });

   
    const animateNavbar = () => {
      if (hasAnimated.current) return; 
      hasAnimated.current = true;
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        delay:0.2,
        ease: "power2.out", 
      });
    };

   
    window.addEventListener("navbarReveal", animateNavbar, { once: true });

  
    if (window.__navbarAlreadyFired) animateNavbar();

    return () =>
      window.removeEventListener("navbarReveal", animateNavbar);
  }, []);

  return (
    <div
      ref={navbarRef}
      className="relative z-[91] w-full shadow-sm"
      style={{ visibility: "hidden" }}
    >
      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center p-4 bg-[#E5E5DD] text-black">
        <div className="font-sans flex items-center gap-4 text-[14px] font-bold tracking-tight">
          <span>{location}</span>
          <span className="px-4">{'//'}</span>
          <span className="flex items-center gap-1">
            <span className="text-black text-[10px] animate-blink">●</span>
            {time}
          </span>

          <div className="pl-18">
            <div className="relative group ml-3 w-[32px] h-[18px] flex items-center justify-center cursor-pointer">
              <span className="text-[11px] font-bold leading-none select-none translate-y-[0.5px]">+</span>
              {/* Corner lines */}
              <span className="absolute top-0 left-0 w-[8px] h-[1px] bg-black transition-transform duration-300 group-hover:-translate-x-[1.5px] group-hover:-translate-y-[1.5px]" />
              <span className="absolute top-0 right-0 w-[8px] h-[1px] bg-black transition-transform duration-300 group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]" />
              <span className="absolute bottom-0 left-0 w-[8px] h-[1px] bg-black transition-transform duration-300 group-hover:-translate-x-[1.5px] group-hover:translate-y-[1.5px]" />
              <span className="absolute bottom-0 right-0 w-[8px] h-[1px] bg-black transition-transform duration-300 group-hover:translate-x-[1.5px] group-hover:translate-y-[1.5px]" />
              <span className="absolute top-0 left-0 w-[1px] h-[5px] bg-black transition-transform duration-300 group-hover:-translate-x-[1.5px] group-hover:-translate-y-[1.5px]" />
              <span className="absolute top-0 right-0 w-[1px] h-[5px] bg-black transition-transform duration-300 group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]" />
              <span className="absolute bottom-0 left-0 w-[1px] h-[5px] bg-black transition-transform duration-300 group-hover:-translate-x-[1.5px] group-hover:translate-y-[1.5px]" />
              <span className="absolute bottom-0 right-0 w-[1px] h-[5px] bg-black transition-transform duration-300 group-hover:translate-x-[1.5px] group-hover:translate-y-[1.5px]" />
            </div>
          </div>
          <span className="font-bold">EN</span>
        </div>

        <Link href="/">
          <div className="group flex flex-col justify-center items-center pr-3 text-[35px] leading-[0.85] tracking-tighter">
            <h1 className="font-sans text-hover-texture cursor-pointer italic font-extrabold group-hover:texture-animate">
              URBAN
            </h1>
            <h1 className="font-sans text-hover-texture cursor-pointer italic font-extrabold -ml-[5px] group-hover:texture-animate">
              CARTZ
            </h1>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-10 text-[16px] pl-2 font-sans font-semibold tracking-tight">
          <Link href="/cart">
            <div className="flex justify-center items-center text-black hover:scale-110 duration-300">
              <span className="duration-300 p-2 cursor-pointer">Cart</span>
              <FaShoppingCart className="cursor-pointer" />
            </div>
          </Link>
          <Link href="/collections">
            <div className="flex justify-center items-center text-black hover:scale-110 duration-300">
              <span className="duration-300 p-2 cursor-pointer">Collections</span>
              <FaShoppingCart className="cursor-pointer" />
            </div>
          </Link>
          <Link href="/wishlist">
            <div className="flex justify-center items-center text-black hover:scale-110 duration-300 cursor-pointer">
              <span className="duration-300 p-2">Wishlist</span>
              <SiWish />
            </div>
          </Link>
          <Link
            href={user ? "/user" : "/login"}
            className="flex justify-center items-center text-black hover:scale-110 duration-300 cursor-pointer"
          >
            <span className="py-2 pr-2">Profile</span>
            <CgProfile />
          </Link>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex justify-between items-center px-3 py-6 bg-[#E5E5DD] text-black h-24">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 -ml-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Logo - Centered */}
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <div className="group flex flex-col items-center">
            <h1 className="font-sans text-[26px] leading-none text-hover-texture cursor-pointer italic font-extrabold">
              URBAN
            </h1>
            <h1 className="font-sans text-[26px] leading-none text-hover-texture cursor-pointer italic font-extrabold -ml-[4px]">
              CARTZ
            </h1>
          </div>
        </Link>

        {/* Profile Icon */}
        <Link
          href={user ? "/user" : "/login"}
          className="p-2 -mr-2"
        >
          <CgProfile size={22} />
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-[#E5E5DD] transition-all duration-200 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="flex flex-col space-y-4 p-4">
          <Link
            href="/cart"
            className="flex items-center text-black py-2 px-4 hover:bg-gray-200 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaShoppingCart className="mr-3" />
            Cart
          </Link>
          <Link
            href="/collections"
            className="flex items-center text-black py-2 px-4 hover:bg-gray-200 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaShoppingCart className="mr-3" />
            Collections
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center text-black py-2 px-4 hover:bg-gray-200 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <SiWish className="mr-3" />
            Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}