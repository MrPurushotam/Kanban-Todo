import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
interface ZoomableImageProps{
    src:string;
    alt:string;
    width:number;
    height:number;
}
const ZoomableImage = ({ src, alt, width, height }:ZoomableImageProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e:MouseEvent) => {
    if (!imageRef.current) return;
    // @ts-expect-error
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.pageX - left) / width * 100;
    const y = (e.pageY - top) / height * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg cursor-zoom-in"
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      ref={imageRef}
    >
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className={`transition-transform duration-200 ease-in-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
        style={isZoomed ? {
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        } : {}}
      />
    </div>
  );
};

export default ZoomableImage;