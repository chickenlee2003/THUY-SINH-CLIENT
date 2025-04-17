"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddToCartModal } from "./add-to-cart-modal";
import { wishlistService } from "@/services/wishlist.service";
import { toast } from "react-toastify";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productQuantity: number;
  productStatus: "AVAILABLE" | "UNAVAILABLE" | "DISCONTINUED";
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
  isWishlisted?: boolean;
  onWishlistChange?: (isWishlisted: boolean) => void;
}

export function ProductCard({
  productId,
  productName,
  productPrice,
  productDescription,
  productQuantity,
  productStatus,
  images,
  isWishlisted: initialIsWishlisted = false,
  onWishlistChange,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWishlistClick = async () => {
    try {
      setIsLoading(true);
      if (isWishlisted) {
        // We need to find the wishlist ID first
        const userId = 1; // TODO: Get from auth
        const response = await wishlistService.getWishlistByUserId(userId);
        const wishlistItem = response.data.find(
          (item) => item.productId === productId
        );
        if (wishlistItem) {
          await wishlistService.removeFromWishlist(wishlistItem.wishListId);
          toast.success("Đã xóa khỏi danh sách yêu thích");
        }
      } else {
        await wishlistService.addToWishlist(productId);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
      setIsWishlisted(!isWishlisted);
      onWishlistChange?.(!isWishlisted);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="group relative border-teal-600/20 transition-all duration-300 hover:border-teal-600/50 hover:shadow-md">
        {/* Hover Actions */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={handleWishlistClick}
            disabled={isLoading}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 transition-transform duration-200 hover:scale-110 hover:bg-white hover:shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              setShowAddToCart(true);
            }}
          >
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        <Link href={`/product/${productId}`} className="block overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden">
              <img
                src={
                  images && images.length > 0
                    ? images[0].imageUrl
                    : "/placeholder.svg"
                }
                alt={productName}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
            <div className="space-y-1 p-4 transition-colors duration-300 group-hover:bg-slate-50">
              <h3 className="text-center font-extralight group-hover:text-teal-800">
                {productName}
              </h3>
              <p className="text-center font-semibold text-teal-600 transition-all duration-300 group-hover:text-teal-700">
                {formatCurrency(productPrice)}
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
          productQuantity,
          productStatus,
          images,
        }}
      />
    </>
  );
}
