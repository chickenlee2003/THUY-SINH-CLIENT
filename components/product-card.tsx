"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddToCartModal } from "./add-to-cart-modal";

interface ProductCardProps {
  productId: number;
  productName: string;
  productPrice: number;
  images: Array<{ imageId: number; imageUrl: string }>;
  productQuantity: number;
  productStatus: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
}

export function ProductCard({
  productId,
  productName,
  productPrice,
  images,
  productQuantity,
  productStatus,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddToCart, setShowAddToCart] = useState(false);

  return (
    <>
      <Card className="group relative border-teal-600/20">
        {/* Hover Actions */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              setShowAddToCart(true);
            }}
          >
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        <Link href={`/product/${productId}`}>
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden">
              <img
                src={
                  images && images.length > 0
                    ? images[0].imageUrl
                    : "/placeholder.svg"
                }
                alt={productName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1 p-4">
              <h3 className="text-center font-medium">{productName}</h3>
              <p className="text-center font-semibold text-teal-600">
                ₹{productPrice}
              </p>
            </div>
          </CardContent>
        </Link>
      </Card>

      <AddToCartModal
        isOpen={showAddToCart}
        onClose={() => setShowAddToCart(false)}
        product={{
          productId,
          productName,
          productPrice,
          images,
          productQuantity,
          productStatus,
        }}
      />
    </>
  );
}
