import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const images = [
  "/clothing/tshirt1.jpg",
  "/clothing/tshirt2.jpg",
  "/clothing/tshirt3.jpg",
  "/clothing/sneakers.webp",
  "/clothing/box.webp",
  "/clothing/card.webp",
];

const DISTANCE_THRESHOLD = 65;

export function useImageTrail(containerRef) {
  const state = useRef({
    index: 0,
    lastX: 0,
    lastY: 0,
  });

  const spawn = (x, y) => {
    const img = document.createElement("img");

    img.src = images[state.current.index];
    state.current.index =
      (state.current.index + 1) % images.length;

    containerRef.current.appendChild(img);

    gsap.set(img, {
      x,
      y,
      xPercent: -50,
      yPercent: -50,
      position: "absolute",
      width: "clamp(120px, 20vw, 165px)",
      aspectRatio: "3 / 4",
      objectFit: "cover",
      borderRadius: "0.5rem",
      scale: 0.85,
      opacity: 0.9,
      pointerEvents: "none",
      willChange: "transform, opacity",
    });

    gsap.timeline({ onComplete: () => img.remove() })
      .to(img, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      })
      .to(
        img,
        {
          y: y - 50,
          scale: 0.25,
          opacity: 0,
          duration: 0.3,
          ease: "power1.in",
        },
        ">-0.1"
      );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ───────── DESKTOP ───────── */

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = e.clientX - state.current.lastX;
      const dy = e.clientY - state.current.lastY;

      if (Math.hypot(dx, dy) > DISTANCE_THRESHOLD) {
        spawn(x, y);
        state.current.lastX = e.clientX;
        state.current.lastY = e.clientY;
      }
    };

    /* ───────── MOBILE ───────── */

    const onTouchMove = (e) => {
      e.preventDefault(); // 🚨 THIS IS THE KEY

      const touch = e.touches[0];
      if (!touch) return;

      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const dx = touch.clientX - state.current.lastX;
      const dy = touch.clientY - state.current.lastY;

      if (Math.hypot(dx, dy) > DISTANCE_THRESHOLD) {
        spawn(x, y);
        state.current.lastX = touch.clientX;
        state.current.lastY = touch.clientY;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("touchmove", onTouchMove, {
      passive: false, // 🚨 REQUIRED
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, []);
}
