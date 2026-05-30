import { CarouselImage } from "../../pages/Startseite";
import { useEffect, useRef } from "react";

interface CarouselProps {
  images: CarouselImage[];
  speed?: number; // Sekunden für eine komplette Schleife
}

export default function Carousel({ images, speed = 15 }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const timer = setTimeout(() => {
      const allImages = carousel.children;
      const singleSetCount = images.length;
      let totalWidth = 0;

      for (let i = 0; i < singleSetCount; i++) {
        const img = allImages[i] as HTMLElement;
        if (img) {
          totalWidth += img.offsetWidth + 80;
        }
      }


      carousel.style.setProperty('--scroll-width', `-${totalWidth}px`);
      carousel.style.setProperty('--animation-duration', `${speed}s`);


      carousel.style.animation = `scroll var(--animation-duration) linear infinite`;
    }, 100);

    return () => {
      clearTimeout(timer);
      carousel.style.animation = '';
    };
  }, [speed, images]);

  return (
      <div className="overflow-hidden w-full relative py-20">
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(var(--scroll-width));
            }
          }
        `}</style>

        <div ref={carouselRef} className="flex gap-20">
          {Array.from({ length: 4 }, (_, setIndex) => 
            images.map((image, index) => (
              <img
                key={`set-${setIndex}-${index}`}
                src={image.url}
                alt="Carousel item"
                className="object-contain flex-shrink-0"
                width={image.size}
              />
            ))
          )}
        </div>
      </div>
  );
}