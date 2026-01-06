"use client";
export const dynamic = "force-dynamic";
import Image from "next/image";
import { useLayoutEffect, useRef, useEffect } from "react";
import SmoothScroll from "@/lib/SmoothScroll";
import Navbar from "@/components/Navbar";
import { useImageTrail } from "@/lib/useImageTrail";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Landingimages from "@/components/Landingimages";
import Scrollingtext from "@/components/Scrollingtext";
import HomeCard from "@/components/HomeCard";
import Gadgets from "@/components/Gadgets";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import DealsCards from "@/components/DealsCard";
import Footer from "@/components/Footer";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";
import { textReveal } from "@/hooks/useTextReveal";
import TwoStageLoader from "@/components/TwoStageLoader";

if (typeof window !== "undefined" && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

function ImageTrailContainer() {
  const containerRef = useRef(null);
  useImageTrail(containerRef);
  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 35,
        overflow: "hidden",
      }}
    />
  );
}

export default function Home() {
  const welcomeRef = useRef(null);
  const text2Ref = useRef(null);
  const logosRef= useRef(null);
  const dealsCardRef= useRef(null);


  const textRefsDown = useRef([]);
  const textRefsUp = useRef([]);
  const hasAnimated = useRef(false);

  const addToRefsDown = (el) => {
    if (el && !textRefsDown.current.includes(el)) textRefsDown.current.push(el);
  };
  const addToRefsUp = (el) => {
    if (el && !textRefsUp.current.includes(el)) textRefsUp.current.push(el);
  };

  useLayoutEffect(() => {
    
    gsap.set(textRefsDown.current, { y: 50, opacity: 0 });
    gsap.set(textRefsUp.current, { y: -50, opacity: 0 });

    const animateText = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

 
      textReveal(textRefsDown.current);
      textReveal(textRefsUp.current);
    };

    window.addEventListener("textReveal", animateText, { once: true });
    if (window.__textRevealAlreadyFired) animateText();
    return () => window.removeEventListener("textReveal", animateText);
  }, []);
  useEffect(() => {
    // If loader was already done earlier, manually trigger the text reveal again
    if (window.__textRevealAlreadyFired) {
      window.dispatchEvent(new Event("textReveal"));
    }
    return () => {
      window.__textRevealAlreadyFired = false;
    };
  }, []);

  useScrollFadeIn(welcomeRef);
  useScrollFadeIn(text2Ref);
  useScrollFadeIn(logosRef);
  useScrollFadeIn(dealsCardRef,{ stagger: 0.75});

  return (
    <TwoStageLoader>
    <SmoothScroll>
      <div className="bg-[#E5E5DD] min-h-screen w-screen">
        <section className="font-['Inter'] w-screen overflow-visible">
          <Navbar className="md:mb-0 -mb-4" />
          <div className="text-black text-2xl sm:text-3xl md:text-4xl font-mono mx-4 sm:mx-6 md:ml-10 md:mr-10 mb-6 md:mb-10 relative flex flex-col md:flex-row justify-between items-start overflow-visible">
            <ImageTrailContainer />

                       
            <div className="hidden md:flex flex-col h-[60vh] lg:h-[73vh] justify-between relative z-[50]">                                                                            
              <div className="p-4 sm:p-6 pt-12 sm:pt-18">
                <span ref={addToRefsDown} style={{ opacity: 0, transform: "translateY(50px)", display: "inline-block" }}>
                  WEAR <span className="font-bold pt-4">TREND</span>
                </span>
                <br />
                <span ref={addToRefsUp} style={{ opacity: 0, transform: "translateY(-50px)", display: "inline-block" }}>
                  WITH <span className="font-bold">CARTZ</span>
                </span>
              </div>

              <div className="w-full max-w-[360px] pl-2 pr-2 pb-4 text-base sm:text-lg" style={{ lineHeight: "1.2" }}>                                                                          
                <span className="text-lg text-gray-500" ref={addToRefsDown} style={{ opacity: 0, transform: "translateY(50px)", display: "inline-block" }}>    
                  Inspired by the cosmic wonders,
                  <br /> we curated a collection that
                </span>
                <br />
                <span className="text-lg" ref={addToRefsUp} style={{ opacity: 0, transform: "translateY(-50px)", display: "inline-block" }}>
                  blends elegance, innovation and a touch of magic
                </span>
              </div>
            </div>

            <Landingimages />

            {/* RIGHT TEXT SECTION */}
            <div className="hidden md:flex flex-col h-[60vh] lg:h-[73vh] justify-between z-[50]">
              <div className="m-2 pt-8 lg:pt-16" style={{ lineHeight: "0.8" }}>
                <div ref={addToRefsDown} style={{ opacity: 0, transform: "translateY(50px)", display: "inline-block" }}>
                  NEW DIMENSION
                </div>
                <div className="flex items-center" ref={addToRefsUp} style={{ opacity: 0, transform: "translateY(-50px)"}}>
                  <span>
                    TO <span className="pl-4">STYLE</span>
                  </span>
                  <span className="text-5xl pl-2 pt-2">👓</span>
                </div>
              </div>

              <div className="w-full max-w-[350px] pl-2 pr-2 pb-4 text-lg sm:text-xl" style={{ lineHeight: "1.3" }}>
                <span className="text-xl text-gray-500" ref={addToRefsDown} style={{ opacity: 0, transform: "translateY(50px)", display: "inline-block" }}>
                HERE, it&apos;s one small step for{" "}

                  <span className="font-bold text-black">URBAN CARTZ</span>, one celestial
                  leap for fashion
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 md:mt-0">
            <Scrollingtext />
          </div>
        </section>

        <hr className="w-screen border-t-2 border-dotted h-4 sm:h-6 md:h-8 text-black mt-2 sm:mt-3 md:mt-4 mb-4 sm:mb-6 md:mb-8" />

        {/* Fade-In Section */}
        <section className="w-screen">
          <div ref={welcomeRef} className="text-black text-2xl sm:text-3xl md:text-4xl font-semibold p-4 sm:p-6 md:m-10 w-full font-sans">
            <span className="text-gray-600 text-xl sm:text-2xl md:text-3xl py-2 sm:py-4 md:py-6 block stagger-line">
              Welcome to CARTZ
            </span>
            <p className="py-3 sm:py-4 md:py-6 leading-normal sm:leading-tight font-stretch-condensed text-lg sm:text-xl md:text-2xl">
              <span className="stagger-line block">
              We&apos;re a consumer-centric brand partner that

              </span>
              <span className="stagger-line block">
                helps thoughtful goods become market-leading
              </span>
              <span className="stagger-line block">brands that people love to buy.</span>
            </p>
          </div>

          <HomeCard />
          <h1 className="px-4 sm:px-6 md:px-10 text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-extrabold">Gadgets</h1>
          <Gadgets />

          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-10 sm:mt-16 md:mt-20 mx-4 sm:mx-6 md:ml-10 text-black font-bold flex justify-between w-[calc(100%-2rem)] sm:w-[95%] md:w-[90%]" ref={dealsCardRef}>
            <p>Top Deals and Discounts</p>
            <IoIosArrowDroprightCircle className="cursor-pointer active:scale-50 duration-200" />
          </div>

          <div className="flex bg-[#afafa7] mt-8 sm:mt-12 md:mt-14 mb-6 sm:mb-8 md:mb-10">
            <DealsCards />
          </div>

          <div ref={text2Ref}>
            <h2 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl pt-6 sm:pt-8 md:pt-10 pb-2 font-bold text-center px-4">
              Premium clothing for every occasion
            </h2>
            <p className="text-[#4B5563] text-base sm:text-lg md:text-xl lg:text-2xl pb-6 sm:pb-8 md:pb-10 text-center px-4">
              Collaboration with{" "}
              <span className="text-black font-bold">brands you love</span> around the world
            </p>
          </div>

          <div className="w-full overflow-hidden" ref={logosRef}>
            <div className="marquee-track whitespace-nowrap flex items-center m-10">
              <Image
                src="/logos.png"
                alt="Placeholder"
                width={1200}
                height={200}
                className="mx-auto my-10"
              />
              <Image
                src="/logos.png"
                alt="Placeholder"
                width={1200}
                height={200}
                className="mx-auto my-10"
              />
              <Image
                src="/logos.png"
                alt="Placeholder"
                width={1200}
                height={200}
                className="mx-auto my-10"
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </SmoothScroll>
    </TwoStageLoader>
  );
}
