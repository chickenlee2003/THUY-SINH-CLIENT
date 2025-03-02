"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface Address {
  id: number;
  addressLine: string;
}

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user's addresses from the API
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses"); // Giả sử có API để lấy địa chỉ
        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Gửi thông tin đơn hàng đến API
      const orderData = {
        addressId: selectedAddress,
        note,
        paymentMethod: "VNPay", // Phương thức thanh toán mặc định
      };
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        // Chuyển hướng hoặc thông báo thành công
        toast.success("Đặt hàng thành công!");
        window.location.href = result.redirectUrl; // Giả sử API trả về URL để chuyển hướng
      } else {
        toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error during checkout", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Thông tin đặt hàng</h1>
      <div className="mb-4">
        <label className="block mb-2">Chọn địa chỉ giao hàng:</label>
        <select
          value={selectedAddress || ""}
          onChange={(e) => setSelectedAddress(Number(e.target.value))}
          className="border rounded p-2 w-full"
        >
          <option value="" disabled>-- Chọn địa chỉ --</option>
          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.addressLine}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Ghi chú:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border rounded p-2 w-full"
          rows={4}
          placeholder="Nhập ghi chú cho đơn hàng..."
        />
      </div>
      <Button
        className="bg-teal-600 hover:bg-teal-700 text-white"
        onClick={handleCheckout}
        disabled={isLoading || selectedAddress === null}
      >
        {isLoading ? "Đang xử lý..." : "Đặt hàng"}
      </Button>
    </div>
  );
} 