'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImage {
  id: string
  url: string
  alt: string
}

interface ProductGalleryProps {
  images: ProductImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showZoom, setShowZoom] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setPosition({ x, y })
  }

  return (
    <div className="space-y-4">
      <div 
        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
      >
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          className="object-cover"
        />
        {showZoom && (
          <div 
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url(${selectedImage.url})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              transform: 'scale(2)'
            }}
          />
        )}
      </div>
      <div className="flex gap-4 overflow-auto pb-2">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
              selectedImage.id === image.id ? 'border-teal-600' : 'border-transparent'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

