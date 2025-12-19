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
        pointerEvents: "none",
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
          <Navbar />
          <div className="text-black text-4xl font-mono ml-10 mr-10 mb-10 relative flex justify-between items-start overflow-visible">
            <ImageTrailContainer />

                       
            <div className="flex flex-col h-[73vh] justify-between relative z-[50]">                                                                            
              <div className="p-6 pt-18">
                <span ref={addToRefsDown} style={{ opacity: 0, transform: "translateY(50px)", display: "inline-block" }}>
                  WEAR <span className="font-bold pt-4">TREND</span>
                </span>
                <br />
                <span ref={addToRefsUp} style={{ opacity: 0, transform: "translateY(-50px)", display: "inline-block" }}>
                  WITH <span className="font-bold">CARTZ</span>
                </span>
              </div>

              <div className="w-[360px] pl-2 pr-2 pb-4" style={{ lineHeight: "0.5" }}>                                                                          
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
            <div className="flex flex-col h-[73vh] justify-between z-[50]">
              <div className="flex flex-col m-2 pt-16" style={{ lineHeight: "0.3" }}>
                <span className="pt-4" ref={addToRefsDown} style={{ opacity: 0, transform: "translateY(50px)", display: "inline-block" }}>
                  NEW DIMENSION{" "}
                </span>
                <br />
                <div className="flex items-center" ref={addToRefsUp}  style={{ opacity: 0, transform: "translateY(-50px)"}}>
                  <span >
                    TO <span className="pl-8">STYLE</span>
                  </span>
                  <span className="text-5xl pl-2 pt-2">👓</span>
                </div>
              </div>

              <div className="w-[350px] pl-2 pr-2 pb-4" style={{ lineHeight: "0.6" }}>
                <span className="text-xl text-gray-500" ref={addToRefsDown} style={{ opacity: 0, transform: "translateY(50px)", display: "inline-block" }}>
                HERE, it&apos;s one small step for{" "}

                  <span className="font-bold text-black">URBAN CARTZ</span>, one celestial
                  leap for fashion
                </span>
              </div>
            </div>
          </div>

          <Scrollingtext />
        </section>

        <hr className="w-screen border-t-2 border-dotted h-8 text-black m-8" />

        {/* Fade-In Section */}
        <section className="w-screen">
          <div ref={welcomeRef} className="text-black text-4xl font-semibold m-10 w-screen font-sans ">
            <span className="text-gray-600 text-3xl py-8 block stagger-line">
              Welcome to CARTSY
            </span>
            <p className="py-6 leading-tight font-stretch-condensed">
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
          <h1 className="px-10 text-[80px] font-extrabold">Gadgets</h1>
          <Gadgets />

          <div className="text-6xl mt-20 ml-10 text-black font-bold flex justify-between w-[90%]" ref={dealsCardRef}>
            <p>Top Deals and Discounts</p>
            <IoIosArrowDroprightCircle className="cursor-pointer active:scale-50 duration-200" />
          </div>

          <div className="flex bg-[#afafa7] mt-14 mb-10">
            <DealsCards />
          </div>

          <div ref={text2Ref}>
            <h2 className="text-black text-5xl pt-10 pb-2 font-bold text-center">
              Premium clothing for every occasion
            </h2>
            <p className="text-[#4B5563] text-2xl pb-10 text-center">
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
