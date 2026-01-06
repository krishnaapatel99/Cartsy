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

export function useImageTrail(containerRef) {
  const stateRef = useRef({
    currentImageIndex: 0,
    lastX: 0,
    lastY: 0,
  });

  const createTrailImage = (x, y) => {
    const currentState = stateRef.current;
    const img = document.createElement('img');
    img.src = images[currentState.currentImageIndex];
    currentState.currentImageIndex = (currentState.currentImageIndex + 1) % images.length;

    if (containerRef.current) containerRef.current.appendChild(img);

    gsap.set(img, {
      x,
      y,
      xPercent: -50,
      yPercent: -50,
      scale: 0.8,
      opacity: 0.8,
      position: 'absolute',
      borderRadius: '0.5rem',
      width: 'clamp(120px, 20vw, 165px)', // Fluid width for mobile/desktop
      height: 'auto',
      aspectRatio: '3/4',
      objectFit: 'cover',
      pointerEvents: 'none',
      zIndex: 10,
    });

    const tl = gsap.timeline({ onComplete: () => img.remove() });
    tl.to(img, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'power1.out',
    })
    .to(img, {
      y: y - 50, // Move upward slightly as it fades
      scale: 0.2,
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
    }, ">-0.1");
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e) => {
      // e.clientX and e.clientY work for both touch and mouse in Pointer Events
      const { lastX, lastY } = stateRef.current;
      const rect = container.getBoundingClientRect();
      
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > DISTANCE_THRESHOLD) {
        createTrailImage(localX, localY);
        stateRef.current.lastX = e.clientX;
        stateRef.current.lastY = e.clientY;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [containerRef]);
}