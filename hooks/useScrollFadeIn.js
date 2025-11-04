import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollFadeIn(ref, options = {}) {
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // Wait for loader to complete if it hasn't already
    const setupScrollTrigger = () => {
      // Clean up any existing ScrollTrigger
      if (scrollTriggerRef.current) {
        const tween = scrollTriggerRef.current;
        if (tween.scrollTrigger) {
          tween.scrollTrigger.kill();
        }
        tween.kill();
      }

      const tween = gsap.fromTo(
        ref.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 1,
          ease: options.ease || "power1.inOut",
          scrollTrigger: {
            trigger: ref.current,
            start: options.start || "top 80%",
            stagger: options.stagger || false,
            markers: true,
          },
        }
      );
      
      scrollTriggerRef.current = tween;
    };

    let cleanup = null;

    // Check if loader is already complete
    if (window.__loaderRevealStarted || document.body.style.overflowY !== "hidden") {
      // Loader already done, setup immediately
      setupScrollTrigger();
      cleanup = () => {
        if (scrollTriggerRef.current) {
          const tween = scrollTriggerRef.current;
          if (tween.scrollTrigger) {
            tween.scrollTrigger.kill();
          }
          tween.kill();
        }
      };
    } else {
      // Wait for loader to complete
      const handleLoaderComplete = () => {
        setupScrollTrigger();
        // Refresh ScrollTrigger after a brief delay to ensure positions are correct
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      };

      window.addEventListener("loaderComplete", handleLoaderComplete);
      window.addEventListener("loaderRevealStart", handleLoaderComplete);

      cleanup = () => {
        window.removeEventListener("loaderComplete", handleLoaderComplete);
        window.removeEventListener("loaderRevealStart", handleLoaderComplete);
        if (scrollTriggerRef.current) {
          const tween = scrollTriggerRef.current;
          if (tween.scrollTrigger) {
            tween.scrollTrigger.kill();
          }
          tween.kill();
        }
      };
    }

    return cleanup;
  }, [ref, options]);
}
