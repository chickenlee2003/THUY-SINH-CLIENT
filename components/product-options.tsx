'use client'

import { useState } from 'react'
import { Star, HelpCircle, Heart, BarChart2, Mail, Twitter, Facebook, Linkedin, PhoneIcon as WhatsApp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductOptionsProps {
  name: string
  reviews: number
  shippingDays: number
  seller: string
  priceRange: {
    min: number
    max: number
  }
  stock: number
}

export function ProductOptions({ 
  name, 
  reviews, 
  shippingDays, 
  seller, 
  priceRange, 
  stock 
}: ProductOptionsProps) {
  const [size, setSize] = useState('Small')
  const [quantity, setQuantity] = useState(30)
  const basePrice = size === 'Small' ? priceRange.min : size === 'Medium' ? (priceRange.min + priceRange.max) / 2 : priceRange.max
  const totalPrice = basePrice * quantity

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-gray-300" />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Estimate Shipping Time:</span>
          <span>{shippingDays} Days</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Product Inquiry
          </Button>
          <Button variant="outline" className="gap-2">
            <Heart className="h-4 w-4" />
            Add to wishlist
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Add to compare
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sold by</span>
          <span>{seller}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Price</span>
          <span className="text-teal-600">₹{priceRange.min.toFixed(2)} - ₹{priceRange.max.toFixed(2)}/Pc</span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm text-gray-500">Size</span>
        <div className="flex gap-2">
          {['Small', 'Medium', 'Large'].map((option) => (
            <Button
              key={option}
              variant={size === option ? 'default' : 'outline'}
              onClick={() => setSize(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm text-gray-500">Quantity</span>
        <div className="flex items-center gap-4">
          <div className="flex">
            <Button
              variant="outline"
              className="rounded-r-none px-3"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <div className="flex w-20 items-center justify-center border-y">
              {quantity}
            </div>
            <Button
              variant="outline"
              className="rounded-l-none px-3"
              onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            >
              +
            </Button>
          </div>
          <span className="text-sm text-gray-500">({stock} available)</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total Price</span>
          <span className="text-xl font-bold text-teal-600">₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex gap-4">
          <Button className="flex-1">Add to cart</Button>
          <Button className="flex-1" variant="secondary">Buy Now</Button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm text-gray-500">Share</span>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" className="rounded-full">
            <Mail className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <Facebook className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <WhatsApp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

