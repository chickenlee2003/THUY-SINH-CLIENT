"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImage {
  imageId: number;
  imageUrl: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  if (!selectedImage) {
    return <div>No images available</div>;
  }

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square overflow-hidden rounded-lg border"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <Image
          src={selectedImage.imageUrl || "/placeholder.svg"}
          alt="Product image"
          width={600}
          height={600}
          className="h-full w-full object-cover"
        />
        {isZoomed && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${selectedImage.imageUrl})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: "200%",
            }}
          />
        )}
      </div>
      <div className="flex gap-4 overflow-auto pb-2">
        {images.map((image) => (
          <button
            key={image.imageId}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2",
              selectedImage.imageId === image.imageId
                ? "border-teal-600"
                : "border-transparent"
            )}
          >
            <Image
              src={image.imageUrl || "/placeholder.svg"}
              alt="Product thumbnail"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
