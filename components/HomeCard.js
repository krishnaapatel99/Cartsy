"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

function HomeCard() {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const moveTween = useRef(null);
  
  const moveListener = useRef(null); 

  

  useGSAP(() => {
    const card = cardRef.current;
    const content = contentRef.current;

   
    const moveCardWithCursor = (e) => {
      const currentScale = gsap.getProperty(card, "scale");
      
      if (currentScale <= 0.25) {
        moveTween.current = gsap.to(card, {
          x: (e.clientX - window.innerWidth / 2) * 0.5,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 50%",
        scrub: true,
        markers: false,
        onUpdate: (self) => {
        
          if (self.progress > 0.05) {
       
            if (moveTween.current) moveTween.current.kill();
            if (moveListener.current) {
              window.removeEventListener("mousemove", moveListener.current);
              moveListener.current = null;
             
              gsap.to(card, { x: 0, duration: 0.5, ease: "power1.out" });
            }
          } else {
           
            if (!moveListener.current) {
              window.addEventListener("mousemove", moveCardWithCursor);
              moveListener.current = moveCardWithCursor;
            }
          }
        },
      },
    });

   
    tl.fromTo(
      card,
      { y: -470, scale: 0.2, transformOrigin: "center top" },
      { y: -250, scale: 0.2, ease: "none" }
    );

  
    tl.to(card, {
      y: 2,
      scale: 1,
      x: 0, 
      ease: "sine.inOut",
    });

    
    tl.fromTo(
      content,
      { opacity: 0 },
      { opacity: 1, ease: "bounce.out" },
      "=0.4"
    );


    window.addEventListener("mousemove", moveCardWithCursor);
    moveListener.current = moveCardWithCursor;


    gsap.set(card, { x: 0 });

   
    return () => {
        window.removeEventListener("mousemove", moveCardWithCursor);
        if (moveTween.current) moveTween.current.kill();
    }
    
  }, { scope: cardRef });

  const CARD_DATA = [
    { id: 1, imageUrl: "/sofa.png",slug: "furniture", title: "Modern Furniture Collection", description: "Sleek and functional designs for contemporary living spaces." },
    { id: 2, imageUrl: "/home essentials.png",slug:"essential home goods", title: "Essential Home Goods", description: "Everything you need to make your house a home." },
    { id: 3, imageUrl: "/jean.png", slug:"jeans", title: "Premium Denim Apparel", description: "Durable and stylish jeans for every occasion and fit." },
    { id: 4, imageUrl: "/shirt.png", slug:"shirts", title: "Trendy Shirt Collection", description: "From casual tees to formal shirts, find your perfect top." },
    { id: 5, imageUrl: "/sneaker.png",slug:"shoes/sneakers", title: "Stylish Sneakers & Kicks", description: "Step up your game with our latest sneaker drops." },
    { id: 6, imageUrl: "/purses.png",slug:"bags/purses", title: "Versatile Carry Bags", description: "Functional and fashionable bags for all your essentials." },
  ];

  return (
    <div ref={cardRef} className="bg-[#A7A79D] m-10 rounded-2xl py-10">
      <div ref={contentRef}>
        <h2 className="text-black px-6 text-4xl sm:text-6xl lg:text-[80px] font-extrabold text-center sm:text-left">
          Discover Your Items
        </h2>

        <div className="flex flex-wrap justify-between gap-y-10 p-6 max-w-7xl mx-auto">
          {CARD_DATA.map((item) => (
          
            <div
              key={item.id}
              className="bg-[#E5E5DD] border border-[#DADAD0] rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-300 overflow-hidden w-full sm:w-[45%] lg:w-[30%]"
            >
               <Link
           key={item.id}
           href={`/products/${item.slug}`}
           >
              <div className="relative w-full h-64 sm:h-72">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={item.id === 1}
                />
              </div>

              <div className="p-5 text-[#2E2E2B]">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-[#4B4B48]">{item.description}</p>
              </div>
               </Link>
              
            </div>
          
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeCard;