import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export function textReveal(targets) {
  if (!targets || (Array.isArray(targets) && targets.length === 0)) return;
  const elements = Array.isArray(targets) ? targets.filter(Boolean) : [targets.current];

  gsap.to(elements, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    
    ease: "power3.out",
    
  });
}
