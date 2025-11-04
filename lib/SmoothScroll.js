// /lib/SmoothScroll.js

"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
  lerp = 0.06,
  multiplier = 0.7 
}) {
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      smooth: true,
      lerp: lerp ?? undefined,
    });

    // 2. 🌟 CRITICAL FIX: Set up the scroller proxy
    // This tells ScrollTrigger to look at Lenis instead of the window/body scroll.
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            // Getter: returns current scroll position
            // Setter: scrolls to a value (used by ScrollTrigger.scrolTo)
            if (arguments.length) lenis.scrollTo(value, { immediate: true });
            return lenis.scroll;
        },
        getBoundingClientRect() {
            // Returns the viewport dimensions
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        // Pinning must use transforms since Lenis is translating the content
        pinType: document.body.style.transform ? "transform" : "fixed",
    });


    // 3. Optional scroll multiplier (Must happen before raf loop starts)
    if (multiplier !== 1) {
      const originalRaf = lenis.raf.bind(lenis);
      lenis.raf = (time) => originalRaf(time * multiplier);
    }

    // 4. Sync Lenis with GSAP Ticker
    // The Lenis scroll event must update ScrollTrigger's position calculations
    lenis.on("scroll", ScrollTrigger.update); 
    
    // Drive Lenis using GSAP's optimized ticker
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 5. 🌟 CRITICAL FIX: Refresh ScrollTrigger after setup
    // This forces ScrollTrigger to recalculate all positions using the new proxy.
    // Use a slight timeout to ensure all DOM elements are rendered (Next.js/React hydration)
    const timeout = setTimeout(() => {
        ScrollTrigger.refresh(true); 
    }, 100); 

    return () => {
        clearTimeout(timeout);
        lenis.destroy();
        // Revert the proxy when component unmounts for good practice
        ScrollTrigger.scrollerProxy(document.body, null);
    };

  }, [ lerp, multiplier]); // Dependencies ensure setup re-runs if props change

  return <>{children}</>;
}