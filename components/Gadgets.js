"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Gadgets() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const mobileLeftRef = useRef(null);
  const mobileRightRef = useRef(null);
  const scrollTriggersRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let hasSetup = false;

    const setupScrollTriggers = () => {
      if (hasSetup) return;
      hasSetup = true;

      // Clean up existing
      scrollTriggersRef.current.forEach((st) => st?.kill());
      scrollTriggersRef.current = [];

      const scrollTriggerConfig = {
        scroller: document.body,
        invalidateOnRefresh: true,
      };

      // --- DESKTOP ANIMATIONS ---
      const leftTween = gsap.to(leftRef.current, {
        x: 0,
        rotateZ: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          ...scrollTriggerConfig,
          trigger: leftRef.current,
          start: "top 70%",
        },
      });

      const rightTween = gsap.to(rightRef.current, {
        x: 0,
        rotateZ: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          ...scrollTriggerConfig,
          trigger: rightRef.current,
          start: "top 70%",
        },
      });

      // --- MOBILE ANIMATIONS (Horizontal Fly-in) ---
      // Gadget Grid slides from Left
      const mLeftTween = gsap.to(mobileLeftRef.current, {
        x: 0,
        rotateZ: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          ...scrollTriggerConfig,
          trigger: mobileLeftRef.current,
          start: "top 70%",
        },
      });

      // Mobile Banner slides from Right
      const mRightTween = gsap.to(mobileRightRef.current, {
        x: 0,
        rotateZ: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          ...scrollTriggerConfig,
          trigger: mobileRightRef.current,
          start: "top 75%",
        },
      });

      scrollTriggersRef.current.push(
        leftTween.scrollTrigger, 
        rightTween.scrollTrigger,
        mLeftTween.scrollTrigger,
        mRightTween.scrollTrigger
      );
    };

    // Loader logic
    const handleLoader = () => {
      setTimeout(() => {
        setupScrollTriggers();
        setTimeout(() => ScrollTrigger.refresh(true), 100);
      }, 500);
    };

    if (window.__loaderComplete || window.__loaderRevealStarted) {
      handleLoader();
    } else {
      window.addEventListener("loaderComplete", handleLoader);
      window.addEventListener("loaderRevealStart", handleLoader);
    }

    return () => {
      window.removeEventListener("loaderComplete", handleLoader);
      window.removeEventListener("loaderRevealStart", handleLoader);
      scrollTriggersRef.current.forEach((st) => st?.kill());
    };
  }, []);

  const gadgetImages = [
    "/wireless.png",
    "/smartwatches.png",
    "/neckband.png",
    "/earbuds.png",
  ];

  return (
    <div className="overflow-x-hidden w-full bg-[#BAB8B2] md:bg-transparent transition-colors duration-500">
      {/* --- DESKTOP VIEW (MD and up) --- */}
      <div className="hidden md:flex p-10 justify-center">
        <div
          ref={leftRef}
          className="grid grid-cols-2 w-[35vw] h-[80vh] rounded-xl bg-[#ABABA1] shadow-2xl mr-8"
          style={{ transform: "translateX(-500px) rotateZ(-10deg)" }}
        >
          {gadgetImages.map((src, i) => (
            <Link key={i} href="/collection-not-available" className="m-6">
              <div className="h-full bg-[#ABABA1] rounded-xl shadow-inner-xl overflow-hidden shadow-black/40">
                <Image src={src} alt="gadget" width={250} height={230} className="w-full h-full object-contain rounded-xl shadow-2xl" />
              </div>
            </Link>
          ))}
        </div>

        <Link href="/collection-not-available">
          <div
            ref={rightRef}
            className="h-[80vh] w-[55vw] bg-[#ABABA1] rounded-xl overflow-hidden"
            style={{ transform: "translateX(500px) rotateZ(10deg)" }}
          >
            <Image src="/mobile.png" alt="phone" width={940} height={330} className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>

      {/* --- MOBILE VIEW (Below MD) --- */}
      <div className="md:hidden flex flex-col gap-10 px-6 py-10 overflow-hidden">
        {/* Mobile Gadgets Grid - Slides in from Left */}
        <div
          ref={mobileLeftRef}
          className="grid grid-cols-2 gap-4 p-4 bg-[#ABABA1] rounded-2xl shadow-xl"
          style={{ transform: "translateX(-150%) rotateZ(-10deg)" }}
        >
          {gadgetImages.map((src, i) => (
            <Link key={i} href="/collection-not-available">
              <div className="aspect-square bg-[#ABABA1] rounded-lg shadow-inner flex items-center justify-center">
                <Image src={src} alt="gadget" width={150} height={150} className="w-4/5 h-4/5 object-contain rounded-xl shadow-2xl" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Large Banner - Slides in from Right */}
        <Link href="/collection-not-available">
          <div
            ref={mobileRightRef}
            className="w-full h-[40vh] bg-[#ABABA1] rounded-2xl overflow-hidden shadow-2xl"
            style={{ transform: "translateX(150%) rotateZ(10deg)" }}
          >
            <Image src="/mobile.png" alt="phone banner" width={600} height={400} className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Gadgets;