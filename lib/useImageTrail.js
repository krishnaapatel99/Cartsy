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

const DISTANCE = 65;
const LERP = 0.22;

export function useImageTrail(containerRef) {
  const imageIndex = useRef(0);

  // ───────── DESKTOP STATE ─────────
  const desktop = useRef({
    lastX: 0,
    lastY: 0,
  });

  // ───────── MOBILE STATE ─────────
  const mobile = useRef({
    dragging: false,
    targetX: 0,
    targetY: 0,
    smoothX: 0,
    smoothY: 0,
    lastX: 0,
    lastY: 0,
  });

  const spawn = (x, y) => {
    const img = document.createElement("img");

    img.src = images[imageIndex.current];
    imageIndex.current = (imageIndex.current + 1) % images.length;

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
      .to(img, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" })
      .to(img, {
        y: y - 50,
        scale: 0.25,
        opacity: 0,
        duration: 0.3,
        ease: "power1.in",
      }, ">-0.1");
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ───────────────── DESKTOP ───────────────── */

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = e.clientX - desktop.current.lastX;
      const dy = e.clientY - desktop.current.lastY;

      if (Math.hypot(dx, dy) > DISTANCE) {
        spawn(x, y);
        desktop.current.lastX = e.clientX;
        desktop.current.lastY = e.clientY;
      }
    };

    /* ───────────────── MOBILE ───────────────── */

    const onPointerDown = (e) => {
      if (e.pointerType !== "touch") return;

      mobile.current.dragging = true;

      const rect = container.getBoundingClientRect();
      mobile.current.targetX =
        mobile.current.smoothX =
        mobile.current.lastX =
          e.clientX - rect.left;

      mobile.current.targetY =
        mobile.current.smoothY =
        mobile.current.lastY =
          e.clientY - rect.top;
    };

    const onPointerMove = (e) => {
      if (!mobile.current.dragging || e.pointerType !== "touch") return;

      const rect = container.getBoundingClientRect();
      mobile.current.targetX = e.clientX - rect.left;
      mobile.current.targetY = e.clientY - rect.top;
    };

    const onPointerUp = () => {
      mobile.current.dragging = false;
    };

    const mobileTick = () => {
      if (!mobile.current.dragging) return;

      mobile.current.smoothX +=
        (mobile.current.targetX - mobile.current.smoothX) * LERP;
      mobile.current.smoothY +=
        (mobile.current.targetY - mobile.current.smoothY) * LERP;

      const dx = mobile.current.smoothX - mobile.current.lastX;
      const dy = mobile.current.smoothY - mobile.current.lastY;

      if (Math.hypot(dx, dy) > DISTANCE) {
        spawn(mobile.current.smoothX, mobile.current.smoothY);
        mobile.current.lastX = mobile.current.smoothX;
        mobile.current.lastY = mobile.current.smoothY;
      }
    };

    /* ───────── LISTENERS ───────── */

    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    gsap.ticker.add(mobileTick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      gsap.ticker.remove(mobileTick);
    };
  }, []);
}
