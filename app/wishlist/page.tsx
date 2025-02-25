"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const mockWishlist: WishlistItem[] = [
  {
    id: "1",
    name: "Betta Fish Female",
    price: 500.0,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Crown Tail Betta",
    price: 800.0,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Full Moon Betta Fish",
    price: 600.0,
    image: "/placeholder.svg",
  },
];

export default function WishListPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(mockWishlist);

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích của bạn</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-sm p-4 space-y-4 flex flex-col items-center"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-lg font-medium text-center">{item.name}</h2>
              <p className="text-teal-600 font-semibold text-center">
                {item.price.toFixed(2)}vnđ
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  Xóa
                </Button>
                <Button>Thêm vào giỏ hàng</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          Bạn chưa thêm sản phẩm nào vào danh sách yêu thích của mình.
        </p>
      )}
    </div>
  );
}
