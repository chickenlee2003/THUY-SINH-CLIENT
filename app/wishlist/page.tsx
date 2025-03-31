"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { wishlistService } from "@/services/wishlist.service";

interface WishlistItem {
  wishListId: number;
  userId: number;
  productId: number;
  productName: string;
}

export default function WishListPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        // TODO: Replace with actual user ID from authentication
        const userId = 1; // Temporary user ID
        const response = await wishlistService.getWishlistByUserId(userId);
        setWishlist(response.data);
      } catch (err) {
        console.log("Error fetching wishlist:", err);
        setError("Không thể tải danh sách yêu thích. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (wishlistId: number) => {
    try {
      await wishlistService.removeFromWishlist(wishlistId);
      setWishlist(wishlist.filter((item) => item.wishListId !== wishlistId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      // You might want to show an error toast here
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích của bạn</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg shadow-sm p-4 space-y-4">
              <div className="aspect-square w-full bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mx-auto" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích của bạn</h1>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích của bạn</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.wishListId}
              className="border rounded-lg shadow-sm p-4 space-y-4 flex flex-col items-center"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src="/placeholder.svg"
                  alt={item.productName}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-lg font-medium text-center">{item.productName}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => removeFromWishlist(item.wishListId)}
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
