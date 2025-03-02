"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import cartItemService from "@/services/cartItem.service"; // Import the cart item service
import { toast } from "react-toastify";
import apiClient from "@/services/apiClient"; // Import the apiClient for making API requests

interface CartItem {
  cartItemId: number;
  productDTO: {
    productId: number;
    productName: string;
    productPrice: number;
    productDescription: string;
    productQuantity: number;
    productStatus: string;
    images: Array<{ imageId: number; imageUrl: string }>;
  };
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const userId = Number(localStorage.getItem("id")); // Get user ID from local storage
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const response = await cartItemService.getCartByUserId(userId);
          setCartItems(response.data.cartItems); // Assuming the response structure
          setTotalAmount(response.data.totalAmount); // Use total amount from API response
        } catch (error) {
          console.error("Failed to fetch cart items:", error);
        }
      }
    };

    fetchCartItems();
  }, [userId]);

  // Add a function to calculate the total amount
  const calculateTotalAmount = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.productDTO.productPrice * item.quantity), 0);
  };

  // Update the removeFromCart function to recalculate totalAmount
  const removeFromCart = async (cartItemId: number) => {
    const cartId = await cartItemService.getCartByUserId(Number(localStorage.getItem("id")));
    const itemToUpdate = cartItems.find(item => item.cartItemId === cartItemId);
    try {
      if (itemToUpdate?.productDTO.productId) {
        await cartItemService.removeItemFromCart(cartId.data.cartId, itemToUpdate.productDTO.productId);
        const updatedCartItems = cartItems.filter((item) => item.cartItemId !== cartItemId);
        setCartItems(updatedCartItems);
        setTotalAmount(calculateTotalAmount(updatedCartItems)); // Recalculate total amount
      } else {
        console.error("Product ID is undefined, cannot remove item from cart.");
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  // Update the updateQuantity function to prevent exceeding available stock
  const updateQuantity = async (cartItemId: number, amount: number) => {
    const itemToUpdate = cartItems.find(item => item.cartItemId === cartItemId);
    const cartId = await cartItemService.getCartByUserId(Number(localStorage.getItem("id")));
    if (itemToUpdate) {
      const newQuantity = Math.max(1, itemToUpdate.quantity + amount);
      // Check if the new quantity exceeds the available stock
      if (newQuantity > itemToUpdate.productDTO.productQuantity) {
// toast err
        toast.error("Không thể thêm nhiều hơn số lượng hàng có sẵn.");
        // console.error("Cannot add more than available stock.");
        return; // Exit the function if the new quantity exceeds available stock
      }
      try {
        await cartItemService.updateItemQuantity(cartId.data.cartId, itemToUpdate.productDTO.productId, newQuantity);
        const updatedCartItems = cartItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        );
        setCartItems(updatedCartItems);
        setTotalAmount(calculateTotalAmount(updatedCartItems)); // Recalculate total amount
      } catch (error) {
        console.error("Failed to update item quantity:", error);
      }
    }
  };

  // Define the handlePayment function
  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Chuyển hướng đến trang checkout
      window.location.href = "/checkout"; // Đường dẫn đến trang checkout
    } catch (err) {
      console.error("Error during payment", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>
      {cartItems.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="w-32 h-32 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.productDTO.images[0]?.imageUrl || "/placeholder.svg"}
                    alt={item.productDTO.productName}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-lg font-medium">{item.productDTO.productName}</h2>
                  <p className="text-teal-600 font-semibold">
                    {new Intl.NumberFormat('vi-VN').format(item.productDTO.productPrice)} VNĐ
                  </p>
                  <div className="text-gray-500">{item.productDTO.productDescription}</div>
                  
                  <div className="text-gray-500">Có sẵn: {item.productDTO.productQuantity}</div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="rounded-r-none"
                    >
                      -
                    </Button>
                    <div className="w-12 border-y text-center">
                      {item.quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="rounded-l-none"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(item.cartItemId)}
                >
                  Xoá
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Tổng tiền</span>
            <span className="text-xl font-bold text-teal-600">
              {new Intl.NumberFormat('vi-VN').format(totalAmount)} VNĐ
            </span>
          </div>

          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" 
              onClick={handlePayment}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>
              Tiếp tục mua hàng
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">
          Không có sản phẩm nào trong giỏ hàng của bạn.
        </p>
      )}
    </div>
  );
}