/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressSelector } from "@/components/address-selector";
import { CartSummary } from "@/components/cart-summary";
import cartItemService from "@/services/cartItem.service";
import locationService from "@/services/location.service";
import orderService from "@/services/order.service";
import { toast } from "react-toastify";
import addressService from "@/services/address.service";

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface Location {
  locationId: number;
  latitude: number;
  longitude: number;
  description: string;
  userId: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [voucherCode, setVoucherCode] = useState<string | undefined>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // State for new address
  const [newAddress, setNewAddress] = useState<Location>({
    locationId: 0,
    latitude: 0,
    longitude: 0,
    description: "",
    userId: 0,
  });
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    setIsClient(true);
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceCode: string) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtCode: string) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const fetchCartItems = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          toast.error("Vui lòng đăng nhập để tiếp tục");
          router.push("/login");
          return;
        }

        const items = await cartItemService.getCartByUserId(Number(userId));
        const formattedItems: CartItem[] = items.data.cartItems.map(
          (item: any) => ({
            productId: item.productDTO.productId,
            productName: item.productDTO.productName,
            price: item.productDTO.productPrice,
            quantity: item.quantity,
            image: item.productDTO.images[0]?.imageUrl || "/placeholder.svg",
            stock: item.productDTO.productQuantity,
          })
        );
        setCartItems(formattedItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Không thể tải thông tin giỏ hàng");
      }
    };

    const fetchLocations = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) return;

        const fetchedLocations = await locationService.getLocationByUserId(
          Number(userId)
        );
        setLocations(fetchedLocations.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Không thể tải địa chỉ giao hàng");
      }
    };

    fetchCartItems();
    fetchLocations();
  }, [isClient, router]);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        return;
      }

      // Get the names of the selected province, district, and ward
      const provinceName =
        provinces.find(
          (province) => province.code.toString() === selectedProvince
        )?.name || "";
      const districtName =
        districts.find(
          (district) => district.code.toString() === selectedDistrict
        )?.name || "";
      const wardName =
        wards.find((ward) => ward.code.toString() === selectedWard)?.name || "";

      // Create the full address description
      const fullAddress = `${newAddress.description}, ${wardName}, ${districtName}, ${provinceName}`;

      const addressToSubmit = {
        ...newAddress,
        description: fullAddress,
        userId: Number(userId),
      };

      const response = await addressService.addAddress(addressToSubmit);
      setLocations((prev) => [...prev, response.data]);
      setShowAddAddress(false);
      setSelectedAddress(response.data.locationId);
      toast.success("Thêm địa chỉ thành công!");

      // Reset form
      setNewAddress({
        locationId: 0,
        latitude: 0,
        longitude: 0,
        description: "",
        userId: 0,
      });
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Không thể thêm địa chỉ");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        router.push("/login");
        return;
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shippingFee = subtotal >= 1000000 ? 0 : 35000;

      const orderData = {
        locationId: selectedAddress,
        orderNote,
        voucherId: voucherCode,
        shippingFee,
      };

      const orderResponse = await orderService.createOrder(
        Number(userId),
        orderData
      );
      toast.success("Đặt hàng thành công!");
      router.push(`/orders/${orderResponse.orderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAddress = (locationId: number) => {
    setSelectedAddress(locationId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Đơn hàng</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Địa chỉ giao hàng</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddAddress(!showAddAddress)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showAddAddress ? "Hủy" : "Thêm địa chỉ mới"}
              </Button>
            </CardHeader>
            <CardContent>
              {showAddAddress ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="description">Mô tả địa chỉ</Label>
                    <Input
                      id="description"
                      value={newAddress.description}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          description: e.target.value,
                        })
                      }
                      placeholder="Ví dụ: Nhà riêng, Công ty..."
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedProvince(value);
                        fetchDistricts(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem
                            key={province.code}
                            value={province.code.toString()}
                          >
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedDistrict(value);
                        fetchWards(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Quận/Huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem
                            key={district.code}
                            value={district.code.toString()}
                          >
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Select onValueChange={(value) => setSelectedWard(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Phường/Xã" />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem
                            key={ward.code}
                            value={ward.code.toString()}
                          >
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    Thêm địa chỉ
                  </Button>
                </form>
              ) : (
                <AddressSelector
                  selectedId={selectedAddress}
                  onSelect={handleSelectAddress}
                  locations={locations}
                />
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium">{item.productName}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat("vi-VN").format(item.price)} VNĐ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Note */}
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <CartSummary
            subtotal={cartItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            )}
            shippingFee={
              cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ) >= 1000000
                ? 0
                : 35000
            }
            total={
              cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ) +
              (cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ) >= 1000000
                ? 0
                : 35000)
            }
            voucherCode={voucherCode}
            onApplyVoucher={setVoucherCode}
          />

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedAddress || isSubmitting}
            onClick={handlePlaceOrder}
          >
            {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </div>
      </div>
    </div>
  );
}
