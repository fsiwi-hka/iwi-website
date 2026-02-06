import React from "react";

interface BoxTextImgProps {
  imageSrc: string;
  imageAlt?: string;
  children: React.ReactNode;
  overlay?: boolean;
}

export default function BoxTextImg({
  imageSrc,
  imageAlt = "",
  children,
  overlay = false,
}: BoxTextImgProps) {
  return (
    <div className="flex flex-col lg:flex-row w-full overflow-hidden gap-y-8">
      {/* Bild */}
      <div className="relative w-full max-w-[350px]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto object-cover rounded-md"
        />
        {overlay && (
          <div className="primary_blue_bg opacity-40 absolute inset-0 z-30 rounded-md" />
        )}
      </div>

      {/* Text */}
      <div className="w-full text-primary_grey leading-relaxed lg:pl-10">
        {children}
      </div>
    </div>
  );
}
