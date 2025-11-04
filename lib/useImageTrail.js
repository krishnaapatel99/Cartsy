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
const DELAY_STEP = 0; 

export function useImageTrail(containerRef) {
  const stateRef = useRef({
    currentImageIndex: 0,
    lastX: 0,
    lastY: 0,
    trailCount: 0, 
  });

  const createTrailImage = (x, y) => {
    const currentState = stateRef.current;
    const img = document.createElement('img');
    img.classList.add('image-trail');
    img.src = images[currentState.currentImageIndex];
    currentState.currentImageIndex = (currentState.currentImageIndex + 1) % images.length;

    if (containerRef.current) containerRef.current.appendChild(img);

    gsap.set(img, {
      x,
      y,
      scale: 0.8,
      opacity: 0.8,
      rotation: 0,
      position: 'absolute',
      borderRadius: '0.5rem',
      width: '165px',
      height: '220px',
      objectFit: 'cover',
      pointerEvents: 'none',
      zIndex: 10,
      filter: 'blur(0.5px)',
    });

    const delay = currentState.trailCount * DELAY_STEP;

    const tl = gsap.timeline({ onComplete: () => img.remove() });
    tl.to(img, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'power1',
      delay
    })
    .to(img, {
      x: x + gsap.utils.random(-20, 20),
      y: y + gsap.utils.random(-20, 20),
      scale: 0.2,
      opacity: 0,
      duration: 0.2,
      ease: 'power1',
    
    }, `>-0.1`);

    currentState.trailCount++;
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [containerRef,createTrailImage]);
}
