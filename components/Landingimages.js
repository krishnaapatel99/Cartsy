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

  // Destructure outside, only once
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
      duration:1.2,
      zIndex: 10,
    });

    gsap.set(
      [".photo-left", ".photo-right"],
      {
        opacity: 0,
        scale: 0.4,
        zIndex: 1,
      },
      "-"
    );
  }, []);

  // GSAP photo animation and hover interactions
  useEffect(() => {
    const startAnimation = () => {
      if (animationStartedRef.current) return;
      animationStartedRef.current = true;

      const tl = gsap.timeline({ ease: "cardEase" });

      // Animate center photo into place
      tl.to(".photo-center", {
        y: 0,
        duration: 0.8,
        ease: "cardEase",
      })
        // Animate scale up & trigger navbar reveal
        .to(
          ".photo-center",
          {
            scale: 1,
            duration: 0.8,
            ease: "cardEase",
            onStart: () => {
              // ✅ Navbar reveal starts here
              window.dispatchEvent(new Event("navbarReveal"));
            },
          },
          "+=0"
        )
        // Fade in & move left photo
        .to(
          ".photo-left",
          {
            opacity: 1,
            scale: 1,
            xPercent: -150,
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
          },
          "-=0.1"
        )
        // Fade in & move right photo in parallel
        .to(
          ".photo-right",
          {
            opacity: 1,
            scale: 1,
            xPercent: 50,
            rotate: 14,
            zIndex: 5,
            duration: 1.2,
            ease: "cardEase",
          },
          "<"
        );

      // Hover effect for left photo
      const left = document.querySelector(".photo-left");
      // Hover effect for right photo
      const right = document.querySelector(".photo-right");

      if (left) {
        left.addEventListener("mouseenter", () => {
          gsap.to(left, {
            rotate: -6,
            xPercent: -130,
            yPercent: -48,
            duration: 0.4,
            ease: "power2.out",
          });
        });
        left.addEventListener("mouseleave", () => {
          gsap.to(left, {
            rotate: -14,
            xPercent: -150,
            yPercent: -50,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      }

      if (right) {
        right.addEventListener("mouseenter", () => {
          gsap.to(right, {
            rotate: 6,
            xPercent: 30,
            yPercent: -48,
            duration: 0.4,
            ease: "power2.out",
          });
        });
        right.addEventListener("mouseleave", () => {
          gsap.to(right, {
            rotate: 14,
            xPercent: 50,
            yPercent: -50,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      }
    };
    
    
    if (typeof window !== "undefined" && window.__loaderRevealStarted) {
      startAnimation();
    }

    const handler = () => startAnimation();

    window.addEventListener("loaderRevealStart", handler);

    return () => {
      window.removeEventListener("loaderRevealStart", handler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center h-[65vh] w-[55vw] overflow-visible  mb-24 z-[50] mr-12 "
    >
      {/* Left Image */}
      <div className="photo photo-left absolute w-[240px] h-[300px] shadow-xl overflow-hidden cursor-pointer  ">
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
      <div className="photo photo-center absolute w-[350px] h-[400px] shadow-2xl overflow-hidden ">
        <video
          ref={videoRef}
          key={video} // forces video reload when switching
          src={video}
          autoPlay
          muted
          playsInline
          className="object-cover w-full h-full"
          onEnded={handleVideoEnd}
        />
      </div>

      {/* Right Image */}
      <div className="photo photo-right absolute w-[240px] h-[300px] shadow-xl overflow-hidden cursor-pointer">
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