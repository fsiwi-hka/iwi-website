"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

type SlideType = "image" | "video";

interface Slide {
  type: SlideType;
  src: string;
  duration: number; // Sekunden
  alt?: string;
}

// Basis-URL des Backends. Bei Reverse-Proxy (gleiche Domain) leer lassen,
const API_BASE = process.env.NEXT_PUBLIC_DISPLAY_API ?? "";

// Slides regelmäßig neu laden, damit Änderungen ohne Redeploy ankommen.
const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 Minuten

function DisplaySlideshow({ slides }: { slides: Slide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Index zurücksetzen, falls sich die Slide-Liste verkürzt hat
  const safeIndex = currentIndex % slides.length;
  const currentSlide = slides[safeIndex];

  const advance = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % slides.length);
    setProgressKey((k) => k + 1);
  }, [slides.length]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(advance, currentSlide.duration * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [safeIndex, advance, currentSlide.duration]);

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
                src={`${API_BASE}${currentSlide.src}`}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
                onEnded={handleVideoEnded}
            />
        ) : (
            <img
                key={`${safeIndex}-${currentSlide.src}`}
                src={`${API_BASE}${currentSlide.src}`}
                alt={currentSlide.alt ?? ""}
                className="w-full h-full object-contain"
                draggable={false}
            />
        )}

        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
              <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
                      i === safeIndex ? "bg-white opacity-100" : "bg-white opacity-30"
                  }`}
              />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
              key={progressKey}
              className="h-full"
              style={{ animation: `progress-fill ${currentSlide.duration}s linear forwards`, backgroundColor: '#64378C' }
              }
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
  const [slides, setSlides] = useState<Slide[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/info`, { cache: "no-store" });
        const data = await res.json();
        console.log(data);
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      } catch {
        // Netzwerkfehler ignorieren – alte Slides laufen weiter
      }
    };

    load();
    const id = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
      <>
        <Head>
          <title>IWI Display</title>
          <meta name="robots" content="noindex" />
        </Head>
        {slides && slides.length > 0 ? (
            <DisplaySlideshow slides={slides} />
        ) : (
            <div className="fixed inset-0 bg-black flex items-center justify-center text-white/40">
              Lade Inhalte …
            </div>
        )}
      </>
  );
}

(DisplayPage as any).noLayout = true;