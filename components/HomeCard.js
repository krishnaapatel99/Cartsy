"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function HomeCard() {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const moveTween = useRef(null);
  const allowMove = useRef(true);

  useGSAP(() => {
    const card = cardRef.current;
    const content = contentRef.current;

    const handleOrientation = (e) => {
      if (!allowMove.current) return;
      
      const tiltX = e.gamma; // Left/Right tilt
      const threshold = 30;
      
      // Calculate target position
      let targetX = gsap.utils.mapRange(-threshold, threshold, -100, 100, tiltX);
      
      // If tilted past threshold, apply a "Back" ease for the bounce effect
      const extremeTilt = Math.abs(tiltX) > threshold;

      moveTween.current = gsap.to(card, {
        x: targetX,
        rotationZ: targetX * 0.03, // Subtle tilt rotation
        duration: extremeTilt ? 0.5 : 1,
        ease: extremeTilt ? "back.out(1.7)" : "power2.out",
        overwrite: "auto",
      });
    };

    const moveCardWithCursor = (e) => {
      if (!allowMove.current) return;
      const currentScale = gsap.getProperty(card, "scale");
      if (currentScale <= 0.25) {
        moveTween.current = gsap.to(card, {
          x: (e.clientX - window.innerWidth / 2) * 0.4,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 50%",
        scrub: true,
        onUpdate: (self) => {
          if (self.progress > 0.05) {
            allowMove.current = false;
            if (moveTween.current) moveTween.current.kill();
            gsap.to(card, { x: 0, rotationZ: 0, duration: 0.5 });
          } else {
            allowMove.current = true;
          }
        },
      },
    });

    // Initial Animations
    const isMobile = window.innerWidth < 640;
    tl.fromTo(card, 
      { y: isMobile ? -290 : -450, scale: 0.2, transformOrigin: "center top" },
      { y: isMobile ? -130 : -250, scale: 0.2, ease: "none" }
    ).to(card, {
      y: isMobile ? 18 : 2,
      scale: isMobile ? 0.9 : 1,
      x: 0,
      ease: "sine.inOut",
    });

    tl.fromTo(content, { opacity: 0 }, { opacity: 1 }, "=0.4");

    window.addEventListener("pointermove", moveCardWithCursor);
    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("pointermove", moveCardWithCursor);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, { scope: cardRef });

  const CARD_DATA = [
    { id: 1, imageUrl: "/sofa.png", slug: "furniture", title: "Modern Furniture" },
    { id: 2, imageUrl: "/home essentials.png", slug: "essentials", title: "Home Goods" },
    { id: 3, imageUrl: "/jean.png", slug: "jeans", title: "Denim Apparel" },
    { id: 4, imageUrl: "/shirt.png", slug: "shirts", title: "Trendy Shirts" },
    { id: 5, imageUrl: "/sneaker.png", slug: "sneakers", title: "Stylish Kicks" },
    { id: 6, imageUrl: "/purses.png", slug: "purses", title: "Carry Bags" },
  ];

  return (
    <div ref={cardRef} className="touch-none bg-[#A7A79D] mx-4 my-6 sm:m-10 rounded-2xl pt-3 pb-6 relative overflow-hidden">
      <div ref={contentRef}>
        <h2 className="text-black px-6 text-4xl sm:text-6xl font-extrabold text-center sm:text-left mb-4">
          Discover Your Items
        </h2>

        {/* Mobile Horizontal Scroll */}
        <div className="sm:hidden w-full px-3">
          <div className="overflow-x-auto pb-3 -mx-3 px-3">
            <div className="flex gap-3 w-max">
              {CARD_DATA.map((item) => (
                <Link href={`/products/${item.slug}`} key={`m-${item.id}`} className="bg-[#E5E5DD] rounded-xl overflow-hidden w-48 shadow-lg">
                    <div className="relative w-full h-32">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="p-3 text-center text-xs font-bold text-gray-800 uppercase">{item.title}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:flex flex-wrap justify-center gap-6 p-6 max-w-7xl mx-auto">
          {CARD_DATA.map((item) => (
            <Link href={`/products/${item.slug}`} key={item.id} className="w-[30%] bg-[#E5E5DD] rounded-3xl overflow-hidden hover:scale-105 transition-transform">
                <div className="relative h-64 w-full">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-4 text-center font-bold">{item.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeCard;