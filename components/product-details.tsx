"use client";

import { useState } from "react";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "react-toastify";
import cartItemService from "@/services/cartItem.service";

// import { ProductImageGallery } from "./product-image-gallery";

interface ProductDetailsProps {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productQuantity: number;
  productStatus: "AVAILABLE" | "UNAVAILABLE" | "DISCONTINUED";
  categoryId: number;
  productSold: number;
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
  reviews: Array<{
    reviewId: number;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export function ProductDetails({
  productId,
  productName,
  productPrice,
  productDescription,
  productQuantity,
  productStatus,
  reviews,
  productSold,
  images,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const totalPrice = productPrice * quantity;

  const handleAddToCart = async () => {
    try {
      const userId = Number(localStorage.getItem("id"));
      if (!userId) {
        toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
        return;
      }

      if (productStatus !== "AVAILABLE") {
        toast.error("Sản phẩm hiện không có sẵn");
        return;
      }

      if (productQuantity === 0) {
        toast.error("Sản phẩm đã hết hàng");
        return;
      }

      if (quantity > productQuantity) {
        toast.error(`Chỉ còn ${productQuantity} sản phẩm có sẵn`);
        return;
      }

      if (quantity === 0) {
        toast.error("Vui lòng chọn số lượng sản phẩm");
        return;
      }

      setIsAddingToCart(true);
      await cartItemService.addItemToCart(productId, quantity, userId);
      toast.success(`Đã thêm ${quantity} ${productName} vào giỏ hàng!`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Thêm sản phẩm vào giỏ hàng thất bại.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    try {
      toast.info("Tính năng đang được phát triển");
    } catch (error) {
      console.error("Toast error:", error);
    }
  };

  // Calculate average rating from reviews
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  const roundedRating = Math.round(averageRating);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{productName}</h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-4 w-4 ${
                  star <= roundedRating 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300"
                }`} 
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="font-medium text-teal-600">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500">
              ({reviews.length} đánh giá)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Trạng thái:</span>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-semibold",
              productStatus === "AVAILABLE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {productStatus === "AVAILABLE" ? "CÓ SẴN" : "HẾT HÀNG"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* <Button variant="outline" size="sm" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Hỏi về sản phẩm
          </Button> */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            Thêm vào danh sách yêu thích
          </Button>
      
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Giá</span>
            <span className="text-teal-600"> 
            {formatCurrency(productPrice)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm text-gray-500">Số lượng</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-r-none"
              >
                -
              </Button>
              <div className="w-20 border-y px-4 py-2 text-center">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(Math.min(productQuantity, quantity + 1))
                }
                className="rounded-l-none"
              >
                +
              </Button>
            </div>
            <span className="text-sm text-gray-500">
              ({productQuantity} có sẵn)
            </span>
            <span className="text-sm text-gray-500">
              (Đã bán: {productSold})
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Tổng giá</span>
            <span className="text-xl font-bold text-teal-600">
             
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <div className="mt-4 flex gap-4">
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={
                isAddingToCart || 
                productStatus !== "AVAILABLE" || 
                quantity === 0 || 
                productQuantity === 0 ||
                quantity > productQuantity
              }
            >
              {isAddingToCart 
                ? "Đang thêm..." 
                : productQuantity === 0 
                  ? "Hết hàng" 
                  : "Thêm vào giỏ hàng"
              }
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={handleBuyNow}
              disabled={productQuantity === 0}
            >
              Mua ngay
            </Button>
          </div>
        </div>

        {/* <div className="space-y-2">
          <span className="text-sm text-gray-500">Mô tả</span>
          <p className="text-gray-700">{productDescription}</p>
        </div> */}

        {/* <div className="space-y-2">
          <span className="text-sm text-gray-500">Chia sẻ</span>
          <div className="flex gap-2">
            {["email", "twitter", "facebook", "linkedin", "whatsapp"].map(
              (platform) => (
                <Button
                  key={platform}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <span className="sr-only">Chia sẻ trên {platform}</span>
                  <i className={`icon-${platform}`} />
                </Button>
              )
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
