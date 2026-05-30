"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

type SlideType = "image" | "video";

interface Slide {
  type: SlideType;
  src: string;
  duration: number; // seconds
  alt?: string;
}

// Replace these mock slides with real files in /public/display/ or a future API call
const SLIDES: Slide[] = [
  {
    type: "image",
    // Blue placeholder — swap out for a real path like "/display/banner1.jpg"
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%231a3a6b' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' font-size='90' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Poppins%2C sans-serif'%3EWillkommen beim IWI%3C/text%3E%3C/svg%3E",
    duration: 6,
    alt: "Willkommen",
  },
  {
    type: "image",
    // Green placeholder
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23115e42' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' font-size='90' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Poppins%2C sans-serif'%3EVeranstaltungen%3C/text%3E%3C/svg%3E",
    duration: 5,
    alt: "Veranstaltungen",
  },
  {
    type: "image",
    // Orange placeholder
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23a14a00' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' font-size='90' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Poppins%2C sans-serif'%3EAktuelles%3C/text%3E%3C/svg%3E",
    duration: 5,
    alt: "Aktuelles",
  },
  // Example video slide (uncomment and adjust path when you have a real file):
  // { type: "video", src: "/display/promo.mp4", duration: 15 },
];

function DisplaySlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0); // triggers CSS animation restart
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSlide = SLIDES[currentIndex];

  const advance = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % SLIDES.length);
    setProgressKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(advance, currentSlide.duration * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, advance, currentSlide.duration]);

  // When a video finishes before its duration, skip immediately
  const handleVideoEnded = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    advance();
  }, [advance]);

  const handleClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      advance();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
    >
      {currentSlide.type === "video" ? (
        <video
          ref={videoRef}
          key={currentSlide.src}
          src={currentSlide.src}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-contain"
          onEnded={handleVideoEnded}
        />
      ) : (
        // img works for both static images and GIFs
        <img
          key={`${currentIndex}-${currentSlide.src}`}
          src={currentSlide.src}
          alt={currentSlide.alt ?? ""}
          className="w-full h-full object-contain"
          draggable={false}
        />
      )}

      {/* Slide indicator dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
              i === currentIndex ? "bg-white opacity-100" : "bg-white opacity-30"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          key={progressKey}
          className="h-full bg-white"
          style={{
            animation: `progress-fill ${currentSlide.duration}s linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default function DisplayPage() {
  return (
    <>
      <Head>
        <title>IWI Display</title>
        <meta name="robots" content="noindex" />
      </Head>
      <DisplaySlideshow />
    </>
  );
}

// Opt out of the global _app layout (no header / menu / footer)
(DisplayPage as any).noLayout = true;
