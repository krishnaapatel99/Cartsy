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
  const scrollTriggersRef = useRef([]);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    let hasSetup = false;

   
    const setupScrollTriggers = () => {
      if (hasSetup) return; 
      
   
      if (!leftRef.current || !rightRef.current) return;
      
      hasSetup = true;

      // Clean up existing ScrollTriggers
      scrollTriggersRef.current.forEach((st) => {
        if (st && st.kill) st.kill();
      });
      scrollTriggersRef.current = [];

     
      const scrollTriggerConfig = {
        scroller: document.body, 
        invalidateOnRefresh: true,
      };

     
      const leftTween = gsap.to(leftRef.current, {
        x: 0,
        rotateZ: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          ...scrollTriggerConfig,
          trigger: leftRef.current,
          start: "top 50%",
          markers: false,
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
          start: "top 50%",
        },
      });

     
      if (leftTween.scrollTrigger) {
        scrollTriggersRef.current.push(leftTween.scrollTrigger);
      }
      if (rightTween.scrollTrigger) {
        scrollTriggersRef.current.push(rightTween.scrollTrigger);
      }
    };

        let cleanup = null;

    const isLoaderComplete = 
      window.__loaderComplete === true || 
      window.__loaderRevealStarted === true ||
      (typeof document !== "undefined" && 
       document.body && 
       getComputedStyle(document.body).overflowY !== "hidden");

           
    const fallbackTimeout = setTimeout(() => {
      if (!hasSetup) {
        setupScrollTriggers();
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 100);
      }
    }, 3000);

        if (isLoaderComplete) {
         
      setTimeout(() => {
        setupScrollTriggers();
      
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 100);
      }, 500);
      
      cleanup = () => {
        clearTimeout(fallbackTimeout);
        
        scrollTriggersRef.current.forEach((st) => {
          if (st && st.kill) st.kill();
        });
        scrollTriggersRef.current = [];
      };
    } else {
    
      const handleLoaderComplete = () => {
    
        setTimeout(() => {
          setupScrollTriggers();
         
          setTimeout(() => {
            ScrollTrigger.refresh(true);
          }, 100);
        }, 500);
      };

      window.addEventListener("loaderComplete", handleLoaderComplete);
      window.addEventListener("loaderRevealStart", handleLoaderComplete);       

      cleanup = () => {
        clearTimeout(fallbackTimeout);
        window.removeEventListener("loaderComplete", handleLoaderComplete);     
        window.removeEventListener("loaderRevealStart", handleLoaderComplete);  
       
        scrollTriggersRef.current.forEach((st) => {
          if (st && st.kill) st.kill();
        });
        scrollTriggersRef.current = [];
      };
    }

    return cleanup;
  }, []);

  return (
    <div>
      <div className="flex">
    
        <div
          ref={leftRef}
          className="flex w-[35vw] grid grid-cols-2 ml-10 mt-5 h-[80vh] mb-10 mr-8 rounded-xl bg-[#ABABA1] shadow-2xl inset-shadow-black"
          style={{
            transform: "translateX(-500px) rotateZ(-10deg)",
          }}
        
        >
         <Link
         href={`/collection-not-available`}> <div className="w-[15vw] m-6 h-[30vh] rounded-xl z-14 shadow-2xl shadow-black bg-[#ABABA1]">
            <Image
              src="/wireless.png"
              alt="headphones"
              width={250}
              height={230}
              className="rounded-xl"
            />
          </div></Link>
          <Link
          href={`/collection-not-available`}><div className="w-[15vw] m-6 h-[30vh] rounded-xl z-14 shadow-2xl shadow-black bg-[#ABABA1]">
            <Image
              src="/smartwatches.png"
              alt="smartwatches"
              width={250}
              height={230}
              className="rounded-xl"
            />
          </div></Link>
          <Link
          href={`/collection-not-available`}><div className="w-[15vw] m-6 h-[30vh] rounded-xl z-14 shadow-2xl shadow-black bg-[#ABABA1]">
            <Image
              src="/neckband.png"
              alt="neckband"
              width={250}
              height={230}
              className="rounded-2xl"
            />
          </div></Link>
          <Link
          href={`/collection-not-available`}><div className="w-[15vw] m-6 h-[30vh] rounded-xl z-14 shadow-2xl shadow-black bg-[#ABABA1]">
            <Image
              src="/earbuds.png"
              alt="earbuds"
              width={250}
              height={230}
              className="rounded-xl"
            />
          </div></Link>
        </div>

        
        <Link
        href={`/collection-not-available`}>
        <div
          ref={rightRef}
          className="h-[75vh] w-[55vw] bg-[#B9B9B3] ml-6 mt-5 mb-10 rounded-xl"
          style={{
            transform: "translateX(500px) rotateZ(10deg)",
          }}
        
        >
          <Image
            src="/mobile.png"
            alt="phone"
            width={940}
            height={330}
            className="rounded-xl"
          />
        </div></Link>
      </div>
    </div>
  );
}

export default Gadgets;
