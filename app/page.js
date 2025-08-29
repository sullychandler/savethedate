"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [section, setSection] = useState(0);
  const [direction, setDirection] = useState(0); // +1 next, -1 prev

  const lastScrollRef = useRef(0);
  const touchStartYRef = useRef(null);
  const maxIndex = 3; // adjusted for removed sections

  // Scroll/swipe sensitivity
  const SCROLL_DELAY = 900;
  const WHEEL_DELTA_THRESHOLD = 70;
  const TOUCH_SWIPE_THRESHOLD =
    typeof window !== "undefined" && window.innerWidth < 768 ? 50 : 70;


  const goNext = () => {
    setSection((prev) => {
      if (prev >= maxIndex) return prev;
      setDirection(1);
      return prev + 1;
    });
  };

  const goPrev = () => {
    setSection((prev) => {
      if (prev <= 0) return prev;
      setDirection(-1);
      return prev - 1;
    });
  };

  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollRef.current < SCROLL_DELAY) return;

      if (e.deltaY > WHEEL_DELTA_THRESHOLD) {
        goNext();
        lastScrollRef.current = now;
      } else if (e.deltaY < -WHEEL_DELTA_THRESHOLD) {
        goPrev();
        lastScrollRef.current = now;
      }
    };

    const onKey = (e) => {
      const now = Date.now();
      if (now - lastScrollRef.current < SCROLL_DELAY) return;

      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goNext();
        lastScrollRef.current = now;
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goPrev();
        lastScrollRef.current = now;
      }
    };

    const onTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (touchStartYRef.current == null) return;
      const now = Date.now();
      if (now - lastScrollRef.current < SCROLL_DELAY) return;

      const dy = e.touches[0].clientY - touchStartYRef.current;
      e.preventDefault();

      if (dy < -TOUCH_SWIPE_THRESHOLD) {
        goNext();
        lastScrollRef.current = now;
        touchStartYRef.current = null;
      } else if (dy > TOUCH_SWIPE_THRESHOLD) {
        goPrev();
        lastScrollRef.current = now;
        touchStartYRef.current = null;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.documentElement.style.overflow = originalOverflow;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [SCROLL_DELAY, WHEEL_DELTA_THRESHOLD, TOUCH_SWIPE_THRESHOLD]);

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.98 }),
  };

  const renderSection = (i) => {
    switch (i) {
      // 0) Save the date
      case 0:
        return (
          <div className="flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-extrabold mb-4 text-white drop-shadow-lg">
              Save the Date!
            </h1>
          </div>
        );

      // 1) Final text + couple image
      case 1:
        return (
          <div className="flex flex-col items-center text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
              Chandler and Sully are getting married!
            </h2>
            <img
              src="/US-WC-Alter.png"
              alt="Couple"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-lg object-contain"
            />
          </div>
        );

      // 2) Venue
      case 2:
        return (
          <div className="flex flex-col items-center text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Saturday, July 25, 2026
            </h2>
            <img
              src="/Admirals-WC.png"
              alt="Venue watercolor"
              className="w-full max-w-xl rounded-xl shadow-lg opacity-90 object-contain"
            />
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg mt-4">
              The Admiral&apos;s House, Seattle, WA
            </h3>
          </div>
        );

      // 3) Final single image + text
      case 3:
        return (
          <div className="relative w-full h-full flex items-center justify-center px-4">
            <img
              src="/Admirals-Us-WC.png"
              alt="Venue watercolor with couple"
              className="w-full max-w-4xl max-h-[85vh] rounded-xl object-contain"
            />
            <h2 className="absolute bottom-16 sm:bottom-12 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg text-center">
              Formal Invitations to Follow
            </h2>
            <a
              href="https://www.theknot.com/chandlerandsully"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 sm:bottom-2 left-1/2 -translate-x-1/2 text-xl sm:text-2xl md:text-2xl font-extrabold text-white drop-shadow-lg underline text-center"
            >
              Visit our wedding website
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="font-cedarville">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/Animated-Clouds2.png')" }}
        aria-hidden
      />
      {/* Fullscreen container */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={section}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            {renderSection(section)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
