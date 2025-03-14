"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export function QuickAddModal({
  isOpen,
  onClose,
  product,
}: QuickAddModalProps) {
  const [quantity, setQuantity] = useState(30);
  const totalPrice = product.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{product.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded border overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-teal-600">
                  {product.price.toFixed(2)} /Pc
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Quantity</span>
                  <span className="text-sm text-gray-500">
                    ({product.stock} available)
                  </span>
                </div>
                <div className="mt-2 flex items-center">
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
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-gray-500">Total Price</span>
            <span className="text-lg font-bold text-teal-600">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>
          <Button className="w-full">Thêm vào giỏ hàng</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
