"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
import cartItemService from "@/services/cartItem.service";
import { toast } from "react-toastify";
import { cn, formatCurrency } from "@/lib/utils";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    productId: number;
    productName: string;
    productPrice: number;
    images: Array<{ imageId: number; imageUrl: string }>;
    productQuantity: number;
    productStatus: "AVAILABLE" | "UNAVAILABLE" | "DISCONTINUED";
  };
}

export function AddToCartModal({
  isOpen,
  onClose,
  product,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(product.productPrice * quantity);
  }, [product.productPrice, quantity]);

  const handleAddToCart = async () => {
    const userId = Number(localStorage.getItem("id"));
    if (!userId) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    console.log("product.productStatus", product.productStatus);  

    try {
      await cartItemService.addItemToCart(product.productId, quantity, userId);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      onClose();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Thêm sản phẩm vào giỏ hàng thất bại.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{product.productName}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={onClose}
            >
              {/* <X className="h-4 w-4" /> */}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="flex gap-4">
            <div className="relative h-24 w-24 rounded-lg border overflow-hidden">
              <Image
                src={
                  product.images && product.images.length > 0
                    ? product.images[0].imageUrl
                    : "/placeholder.svg"
                }
                alt={product.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <div className="text-sm text-gray-500">Giá</div>
                <div className="text-teal-600">
                  {formatCurrency(product.productPrice)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    product.productStatus === "AVAILABLE"
                      ? "text-green-600"
                      : product.productStatus === "UNAVAILABLE"
                        ? "text-red-600"
                        : "text-gray-500"
                  )}
                >
                  {product.productStatus === "AVAILABLE" ? "Còn hàng" : product.productStatus === "UNAVAILABLE" ? "Hết hàng" : "Ngừng bán"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Số lượng</span>
              <span className="text-sm text-gray-500">
                ({product.productQuantity} Có sẵn)
              </span>
            </div>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-r-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <div className="w-20 border-y px-4 py-2 text-center">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-l-none"
                onClick={() =>
                  setQuantity(Math.min(product.productQuantity, quantity + 1))
                }
              >
                +
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-gray-500">Tổng tiền:</span>
              <span className="text-xl font-bold text-teal-600">
              
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.productStatus === "UNAVAILABLE" || product.productQuantity === 0}
            >
              {product.productStatus === "AVAILABLE" 
                ? product.productQuantity === 0 
                  ? "Hết hàng" 
                  : "Thêm vào giỏ hàng"
                : product.productStatus === "UNAVAILABLE"
                  ? "Hết hàng"
                  : "Ngừng bán"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
