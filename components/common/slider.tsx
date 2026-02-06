import Button from "./button";
import { useState, useEffect } from "react";
import SliderButton from "./slider-button";
import { Slide } from "../../pages/Startseite";

const Slider = ({ slides }: { slides: Slide[] }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const showNextSlide = () => {
    if (imageIndex === slides.length - 1) {
      setImageIndex(0);
    } else {
      setImageIndex(imageIndex + 1);
    }
  };

  const showPrevSlide = () => {
    if (imageIndex === 0) {
      setImageIndex(slides.length - 1);
    } else {
      setImageIndex(imageIndex - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showNextSlide();
    }, 10000);

    return () => clearInterval(interval); // Interval zurücksetzen, wenn die Komponente entladen wird
  }, [slides.length]);

  const currentSlide = slides[imageIndex];

  return (
    <div className="w-full md:h-100 md:mb-6 lg:mb-12 xl:mb-24 flex flex-col justify-center primary_blue_bg overflow-hidden">
      <div className="">
        <div className="max-w-screen-xl w-full md:m-auto flex flex-col-reverse md:flex-row">
          <div className="md:w-1/2 flex flex-col justify-between p-6 xl:pt-12">
            <div>
              <h1 className="text-white mb-6 text-balance">{currentSlide.title}</h1>
              <p className="text-white mb-6 text-balance">{currentSlide.subtitle}</p>
            </div>
            <div className="flex flex-col lg:flex-row">
              <Button type={"large-blue2"} text={currentSlide.buttontext} url={currentSlide.buttonlink} />
              <Button type={"large-blue1"} text="Weitere Neuigkeiten" url="/Aktuelles" />
            </div>
          </div>
          <div className="md:w-1/2 flex-1 relative">
            <div className="flex gap-2 absolute bottom-0 left-0 text-white pb-6 pl-6 z-40">
              <SliderButton arrow="left" inverted={true} onClick={() => showPrevSlide()} />
              <SliderButton arrow="right" inverted={true} onClick={() => showNextSlide()} />
            </div>
            {currentSlide.imageOverlay === "true" && (
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
                      ${slide.imageOverlay === "true" ? "grayscale" : ""}`}
                      src={currentSlide.image}
                      alt={`slider image ${index}`}
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
