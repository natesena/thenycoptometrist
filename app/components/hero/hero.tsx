"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useRef, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { motion } from "framer-motion";

export default function HeroSection() {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  const xPercent = useRef(0);
  const direction = useRef(-1);

  const animate = useCallback(() => {
    if (xPercent.current < -100) {
      xPercent.current = 0;
    } else if (xPercent.current > 0) {
      xPercent.current = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent.current });
    gsap.set(secondText.current, { xPercent: xPercent.current });
    requestAnimationFrame(animate);
    xPercent.current += 0.1 * direction.current;
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => (direction.current = e.direction * -1),
      },
      x: "-500px",
    });
    requestAnimationFrame(animate);
  }, [animate]);

  return (
    <motion.main
      initial="initial"
      animate="enter"
      className={`${styles.landing}`}
    >
      <Image
        src="/Create Image from Photoroom.png"
        width={3000}
        height={3500}
        alt="background"
        className="max-h-[100vh] object-contain w-auto relative right-8 drop-shadow-2xl scale-x-[-1]"
      />
      <div className={`${styles.sliderContainer} absolute`}>
        <div ref={slider} className={styles.slider}>
          <p ref={firstText}>The NYC Optometrist -</p>
          <p ref={secondText}>The NYC Optometrist -</p>
        </div>
      </div>
      <div
        data-scroll
        data-scroll-speed={0.1}
        className={`${styles.description} absolute left-[5%] md:left-[55%] top-[20%] md:top-[35%]`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative bottom-20 right-10"
        >
          <path
            d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
            fill="white"
          />
        </svg>
        <div className="space-y-8 relative lg:bottom-40">
          <div>
            <p className="font-[500] text-white text-4xl lg:text-6xl leading-tight">
              Hi, <br /> I&apos;m Dr. Latek
            </p>
            <p className="font-[500] text-white text-4xl lg:text-6xl">
              The NYC Optometrist
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-[40rem]">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-10 text-center border border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="text-white text-3xl lg:text-5xl font-bold mb-1">
                15+
              </div>
              <div className="text-white/90 text-sm font-medium">
                Years Experience
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-10 text-center border border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="text-white text-3xl lg:text-5xl font-bold mb-1">
                1000+
              </div>
              <div className="text-white/90 text-sm font-medium">
                Happy Patients
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-10 text-center border border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="text-white text-3xl lg:text-5xl font-bold mb-1">
                NYC
              </div>
              <div className="text-white/90 text-sm font-medium">
                Prime Location
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-10 text-center border border-white/30 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="text-white text-3xl lg:text-5xl font-bold mb-1">
                4.9★
              </div>
              <div className="text-white/90 text-sm font-medium">
                Patient Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
