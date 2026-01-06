// hooks/useImageTrail.js
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const images = [
  '/clothing/tshirt1.jpg',
  '/clothing/tshirt2.jpg',
  '/clothing/tshirt3.jpg',
  '/clothing/sneakers.webp',
  '/clothing/box.webp',
  '/clothing/card.webp'
];

const DISTANCE_THRESHOLD = 65;
const LERP_FACTOR = 0.18; // smoothness for mobile

export function useImageTrail(containerRef) {
  const stateRef = useRef({
    currentImageIndex: 0,
    lastX: 0,
    lastY: 0,

    // mobile smoothing
    isTouch: false,
    targetX: 0,
    targetY: 0,
    smoothX: 0,
    smoothY: 0,
  });

  const createTrailImage = (x, y) => {
    const state = stateRef.current;
    const img = document.createElement('img');

    img.src = images[state.currentImageIndex];
    state.currentImageIndex = (state.currentImageIndex + 1) % images.length;

    containerRef.current?.appendChild(img);

    gsap.set(img, {
      x,
      y,
      xPercent: -50,
      yPercent: -50,
      scale: 0.8,
      opacity: 0.8,
      position: 'absolute',
      borderRadius: '0.5rem',
      width: 'clamp(120px, 20vw, 165px)',
      aspectRatio: '3 / 4',
      objectFit: 'cover',
      pointerEvents: 'none',
      zIndex: 10,
      willChange: 'transform, opacity',
    });

    gsap.timeline({ onComplete: () => img.remove() })
      .to(img, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out',
      })
      .to(img, {
        y: y - 50,
        scale: 0.2,
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
      }, '>-0.1');
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const state = stateRef.current;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      // detect touch once
      if (e.pointerType === 'touch') state.isTouch = true;

      // DESKTOP → unchanged behavior
      if (!state.isTouch) {
        const dx = e.clientX - state.lastX;
        const dy = e.clientY - state.lastY;
        const dist = Math.hypot(dx, dy);

        if (dist > DISTANCE_THRESHOLD) {
          createTrailImage(localX, localY);
          state.lastX = e.clientX;
          state.lastY = e.clientY;
        }
        return;
      }

      // MOBILE → store target only
      state.targetX = localX;
      state.targetY = localY;
    };

    window.addEventListener('pointermove', handlePointerMove);

    // GSAP ticker for mobile smoothing
    const tick = () => {
      if (!state.isTouch) return;

      state.smoothX += (state.targetX - state.smoothX) * LERP_FACTOR;
      state.smoothY += (state.targetY - state.smoothY) * LERP_FACTOR;

      const dx = state.smoothX - state.lastX;
      const dy = state.smoothY - state.lastY;
      const dist = Math.hypot(dx, dy);

      if (dist > DISTANCE_THRESHOLD) {
        createTrailImage(state.smoothX, state.smoothY);
        state.lastX = state.smoothX;
        state.lastY = state.smoothY;
      }
    };

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      gsap.ticker.remove(tick);
    };
  }, [containerRef]);
}
