"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = ({ images, frontPage = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={`/output_photos/${images[currentIndex]}.jpg`}
          alt={`Slide ${currentIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>
      {frontPage ? (
        <></>
      ) : (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-[90%] -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
          >
            <ChevronLeft size={24} />
          </button>
          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-[90%] -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      {/* Previous Button */}

      {/* Indicators */}
      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div> */}
    </div>
  );
};

export default ImageSlider;
