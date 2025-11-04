"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

const TwoStageLoader = ({ children }) => {
  const loadingScreenRef = useRef(null);
  const [revealIsComplete, setRevealIsComplete] = useState(false);
  const [skipFade, setSkipFade] = useState(false);

  useEffect(() => {
    
    if (window.__loaderComplete) {
     
      setTimeout(() => {
        window.dispatchEvent(new Event("loaderRevealStart"));
      }, 300);

      
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflowX = "hidden";

      setRevealIsComplete(true);
      setSkipFade(true);
      return;
    }

    
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "hop" },
        onComplete: () => {
          
          window.__loaderComplete = true;

      
          document.body.style.overflowY = "auto";
          document.documentElement.style.overflowY = "auto";
          document.body.style.overflowX = "hidden";
          document.documentElement.style.overflowX = "hidden";

          gsap.set(".container", {
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
          });

          setRevealIsComplete(true);

        
          setTimeout(() => {
            ScrollTrigger.refresh(true);
            window.dispatchEvent(new Event("loaderComplete"));
          }, 500);
        },
      });

    
      tl.to(".loader-1", { width: "100%", duration: 2 }, 0)
        .to(".loader-2", { width: "100%", duration: 2 }, 0)
        .to(
          ".loader-container",
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: "back.in(1.7)",
          },
          "+=0.2"
        )
        .to(
          "#word-1 span",
          {
            opacity: 1,
            y: "0%",
            duration: 1.2,
            delay: 0.2,
            ease: "hop",
          },
          "<"
        )
        .to(
          "#word-2 span",
          {
            opacity: 1,
            y: "0%",
            duration: 1.2,
            delay: 0.2,
            ease: "hop",
          },
          "<"
        )
        .to(".divider", {
          scaleY: "100%",
          duration: 1,
          onComplete: () =>
            gsap.to(".divider", { opacity: 0, duration: 0.4, delay: 0.3 }),
        })
        .to("#word-1 span", { opacity: 0, y: "-100%", duration: 1 })
        .to("#word-2 span", { opacity: 0, y: "100%", duration: 1 }, "<")
        .to(".block", {
          y: "-100%",
          duration: 1,
          stagger: 0.1,
          ease: "hop",
          onComplete: () => {
            window.__loaderRevealStarted = true;
            window.dispatchEvent(new Event("loaderRevealStart"));
          },
        });
    }, loadingScreenRef);

    return () => {
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflowX = "hidden";
      if (ctx) ctx.revert();
    };
  }, []); 

  if (revealIsComplete && skipFade) {
    return <>{children}</>;
  }

  if (revealIsComplete) return <>{children}</>;

  return (
    <div className="w-screen">
      <div
        ref={loadingScreenRef}
        className="fixed inset-0 z-[99] font-sans overflow-hidden"
      >
       
        <div className="overlay absolute top-0 w-screen h-full flex z-[50]">
          <div className="block w-full h-full bg-black"></div>
          <div className="block w-full h-full bg-black"></div>
        </div>

       
        <div className="inter-logo absolute top-2/5 left-1/2 -translate-x-1/2 flex z-[100] text-white text-5xl">
          <div className="word" id="word-1">
            <span className="font-editorial tracking-wide italic inline-block translate-y-[60%] opacity-0 relative right-4">
              URBAN
            </span>
          </div>
          <div className="word" id="word-2">
            <span className="font-semibold inline-block -translate-y-[60%] opacity-0 font-sans">
              CARTZ
            </span>
          </div>
        </div>

    
        <div className="divider absolute top-0 left-1/2 bg-white h-full w-[1px] z-[200] -translate-x-1/2 transform origin-top scale-y-0"></div>

       
        <div className="loader-container absolute top-2/5 left-1/2 -translate-x-1/2 w-[300px] h-[50px] bg-black overflow-hidden z-[100] shadow-md">
          <div
            className="loader-1 absolute top-0 left-0 h-[50%] bg-[#A7A79D]"
            style={{ width: 0 }}
          />
          <div
            className="loader-2 absolute bottom-0 left-0 h-[50%] bg-[#A7A79D]"
            style={{ width: 0 }}
          />
        </div>
      </div>

    
      <div>{children}</div>
    </div>
  );
};

export default TwoStageLoader;
