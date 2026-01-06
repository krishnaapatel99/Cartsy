"use client";
import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("cardEase", "0.75, 0, 0.25, 1");

const mediaSets = [
  {
    leftImage: "/images/676e7c736ceaac4d442b0ce3_05_converse-skate_right.webp",
    video: "/videos/converse.mp4",
    rightImage: "/images/sneakerskate.webp",
  },
  {
    leftImage: "/images/left.webp",
    video: "/videos/fashion.mp4",
    rightImage: "/images/right.webp",
  },
  {
    leftImage: "/images/jar2.webp",
    video: "/videos/utensils.mp4",
    rightImage: "/images/jar.webp",
  },
];

function Landingimages() {
  const containerRef = useRef(null);
  const animationStartedRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleVideoEnd = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaSets.length);
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.load();
      videoEl.play();
    }
  }, [currentIndex]);

  const { leftImage, video, rightImage } = mediaSets[currentIndex];

  useLayoutEffect(() => {
    gsap.set(".photo", {
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "50%",
      rotate: 0,
      zIndex: 1,
    });

    gsap.set(".photo-center", {
      y: 130,
      scale: 0.4,
      zIndex: 10,
    });

    gsap.set([".photo-left", ".photo-right"], {
      opacity: 0,
      scale: 0.4,
      zIndex: 1,
    });
  }, []);

  useEffect(() => {
    const startAnimation = () => {
      if (animationStartedRef.current) return;
      animationStartedRef.current = true;

      const tl = gsap.timeline({ ease: "cardEase" });

      // Symmetry is key for centering
      // Mobile: xPercent -115 and 15 (creates a balanced spread around the center)
      const leftX = isMobile ? -115 : -150;
      const rightX = isMobile ? 15 : 50;

      tl.to(".photo-center", {
        y: 0,
        duration: 0.8,
        ease: "cardEase",
      })
      .to(".photo-center", {
        scale: 1,
        duration: 0.8,
        ease: "cardEase",
        onStart: () => {
          window.dispatchEvent(new Event("navbarReveal"));
        },
      })
      .to(".photo-left", {
        opacity: 1,
        scale: 1,
        xPercent: leftX,
        rotate: -14,
        zIndex: 5,
        duration: 1.2,
        ease: "cardEase",
        onStart: () => {
          gsap.delayedCall(0.5, () => {
            window.__textRevealAlreadyFired = true;
            window.dispatchEvent(new Event("textReveal"));
          });
        },
      }, "-=0.1")
      .to(".photo-right", {
        opacity: 1,
        scale: 1,
        xPercent: rightX,
        rotate: 14,
        zIndex: 5,
        duration: 1.2,
        ease: "cardEase",
      }, "<");
    };

    if (typeof window !== "undefined" && window.__loaderRevealStarted) {
      startAnimation();
    }

    const handler = () => startAnimation();
    window.addEventListener("loaderRevealStart", handler);

    return () => window.removeEventListener("loaderRevealStart", handler);
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      /* CHANGES MADE HERE:
         1. mx-auto: Centers the block horizontally on mobile.
         2. md:mx-0: Resets margin for desktop to respect your original layout.
         3. md:mr-12: Keeps your original desktop spacing.
      */
      className="relative flex justify-center items-center h-[45vh] md:h-[65vh] w-full md:w-[55vw] mx-auto md:mx-0 overflow-visible mt-28 md:mt-0 mb-12 md:mb-24 z-[50] md:mr-12"
    >
      {/* Left Image */}
      <div className="photo photo-left absolute w-[130px] h-[170px] md:w-[240px] md:h-[300px] shadow-xl overflow-hidden cursor-pointer">
        <Image
          key={leftImage}
          src={leftImage}
          alt="Left Portrait"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Center Video */}
      <div className="photo photo-center absolute w-[200px] h-[260px] md:w-[350px] md:h-[400px] shadow-2xl overflow-hidden">
        <video
          ref={videoRef}
          key={video}
          src={video}
          autoPlay
          muted
          playsInline
          className="object-cover w-full h-full"
          onEnded={handleVideoEnd}
        />
      </div>

      {/* Right Image */}
      <div className="photo photo-right absolute w-[130px] h-[170px] md:w-[240px] md:h-[300px] shadow-xl overflow-hidden cursor-pointer">
        <Image
          key={rightImage}
          src={rightImage}
          alt="Right Portrait"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

export default Landingimages;