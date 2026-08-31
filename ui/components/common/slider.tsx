import Button from "./button";
import {useState, useEffect, useCallback} from "react";
import SliderButton from "./slider-button";
import { Slide } from "../../content/slides";

const AUTOPLAY_MS = 10000;

const Slider = ({ slides }: { slides: Slide[] }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const showNextSlide = useCallback(() => {
    setImageIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const showPrevSlide = useCallback(() => {
    setImageIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(showNextSlide, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [imageIndex, slides.length, showNextSlide]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[imageIndex];

  return (
    <div className="w-full md:mb-6 lg:mb-12 xl:mb-24 flex flex-col justify-center primary_blue_bg overflow-hidden">
      <div className="">
        <div className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row">
          {/* Alle Slides liegen im selben Grid-Feld uebereinander. Dadurch ist die
              Spalte immer so hoch wie der laengste Text und die Hoehe springt beim
              Wechsel nicht mehr. "invisible" nimmt die inaktiven Slides zusaetzlich
              aus der Tab-Reihenfolge - mit reinem opacity-0 waeren ihre Buttons
              per Tastatur erreichbar. */}
          <div className="md:w-1/2 grid p-6 xl:pt-12">
            {slides.map((slide, index) => (
              <div
                key={index}
                aria-hidden={index !== imageIndex}
                className={`col-start-1 row-start-1 flex flex-col justify-between transition-opacity duration-500 ${
                  index === imageIndex ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <div>
                  <h1 className="text-white mb-6 text-balance">{slide.title}</h1>
                  <p className="text-white mb-6 text-balance">{slide.subtitle}</p>
                </div>
                <div className="flex flex-col lg:flex-row">
                  <Button type={"large-blue2"} text={slide.buttontext} url={slide.buttonlink} />
                  <Button type={"large-blue1"} text="Weitere Neuigkeiten" url="/news" />
                </div>
              </div>
            ))}
          </div>
          <div className="md:w-1/2 flex-1 relative">
            <div className="flex gap-2 absolute bottom-0 left-0 text-white pb-6 pl-6 z-40">
              <SliderButton arrow="left" inverted={true} onClick={() => showPrevSlide()} />
              <SliderButton arrow="right" inverted={true} onClick={() => showNextSlide()} />
            </div>
            {currentSlide.imageOverlay && (
              <div className="primary_blue_bg opacity-25 absolute left-0 top-0 w-full h-full z-30"></div>
            )}

            <div className="relative w-full h-full overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${imageIndex * 100}%)`,
                }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="flex-none w-full h-full">
                    <img
                      className={`object-cover w-full h-full z-20 
                      ${slide.imageOverlay ? "grayscale" : ""}`}
                      src={slide.image}
                      alt={slide.title}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
