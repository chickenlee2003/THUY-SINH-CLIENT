"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Home, LifeBuoy, MapPin, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatus } from "@/components/order-status";
import { formatCurrency, formatDate } from "@/lib/utils";
import orderService from "@/services/order.service";
import apiClient from "@/services/apiClient";
import { OrderResponseDTO, OrderDetailDTO } from "@/types/backend";
import Link from "next/link";
import { toast } from "react-toastify";

// Extended OrderDetailDTO for component use
interface ExtendedOrderDetailDTO extends OrderDetailDTO {
  productName?: string;
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const handlePayment = async () => {
    if (!order) return;
    try {
      console.log("Initiating payment for order:", order);
      const paymentData = {
        paymentAmount: order.totalAmount,
        orderId: order.orderId,
      };
      console.log("Payment data:", paymentData);
      const response = await apiClient.post("/pay", paymentData);
      window.location.href = response.data.url;
    } catch (err) {
      console.log("Error initiating payment:", err);
      toast.error("Lỗi khi khởi tạo thanh toán.");
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const orderData = await orderService.getOrderById(Number(orderId));
        setOrder(orderData);
      } catch (err) {
        console.log("Error fetching order:", err);
        setErrorMessage("Failed to fetch order.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    if (vnp_ResponseCode) {
      if (vnp_ResponseCode === "00") {
        toast.success("Thanh toán thành công!");

        // Update both order status and payment status
        const updateStatuses = async () => {
          try {
            console.log("Updating order and payment status...");
            // First update order status to PROCESSING
            await apiClient.put(`/orders/status/${orderId}`, {
              orderStatus: "PROCESSING",
            });
            console.log("Order status updated to PROCESSING");

            // Then update payment status to COMPLETED
            await apiClient.put(`/orders/payment/${orderId}`, {
              paymentStatus: "COMPLETED",
            });
            console.log("Payment status updated to COMPLETED");

            // Refresh order data
            const updatedOrder = await orderService.getOrderById(
              Number(orderId)
            );
            setOrder(updatedOrder);
            console.log("Order data refreshed:", updatedOrder);
          } catch (error) {
            console.log("Error updating statuses:", error);
            toast.error("Có lỗi khi cập nhật trạng thái đơn hàng.");
          }
        };

        updateStatuses();
      } else {
        toast.error("Thanh toán thất bại. Mã lỗi: " + vnp_ResponseCode);

        // Update payment status to FAILED
        const updateFailedStatus = async () => {
          try {
            await apiClient.put(`/api/v1/orders/payment-status/${orderId}`, {
              paymentStatus: "FAILED",
            });

            // Refresh order data
            const updatedOrder = await orderService.getOrderById(
              Number(orderId)
            );
            setOrder(updatedOrder);
          } catch (error) {
            console.log("Error updating payment status:", error);
            toast.error("Có lỗi khi cập nhật trạng thái thanh toán.");
          }
        };

        updateFailedStatus();
      }

      // Xóa tham số callback khỏi URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams, orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  if (errorMessage) {
    return <div className="container mx-auto px-4 py-8">{errorMessage}</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        Không tìm thấy thông tin đơn hàng
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Chi tiết đơn hàng #{order.orderId}
      </h1>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatus status={order.orderStatus} />
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt hàng:</span>
                  <span className="font-medium">{formatDate(new Date())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dự kiến giao hàng:</span>
                  <span className="font-medium">
                    {order.expectedDeliveryTime
                      ? formatDate(new Date(order.expectedDeliveryTime))
                      : "Không có thông tin"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.orderAddress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Số điện thoai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.orderPhoneNumber}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {order.orderDetails?.map((item) => (
                  <li
                    key={item.productId}
                    className="py-4 flex justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {(item as ExtendedOrderDetailDTO).productName ||
                          `Sản phẩm #${item.productId}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.orderDetailQuantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.orderDetailPrice)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {order.orderNote && (
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.orderNote}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
                {order.shippingFee && (
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}
                {order.totalDiscount && (
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(order.totalDiscount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Tổng cộng</span>
                  <span className="text-lg">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              {order.payment && (
                <>
                  {/* mặc đinh là qua vnpay */}
                  <p className="font-medium">VNPAY</p>
                  <p className="text-sm text-gray-500">
                    Thanh toán trực tuyến qua VNPAY
                  </p>
                  {/* <p className="font-medium">
                    {order.payment.paymentMethodName || "Không có thông tin"}
                  </p> */}
                  <p
                    className={`text-sm ${
                      order.payment.paymentStatus === "COMPLETED"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.payment.paymentStatus === "COMPLETED"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </p>
                </>
              )}
              {order.payment && order.payment.paymentStatus !== "COMPLETED" && (
                <Button className="mt-4 w-full" onClick={handlePayment}>
                  Thanh toán ngay
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" /> Về trang chủ
              </Button>
            </Link>
            <Link href="/support-page">
              <Button variant="outline" className="w-full">
                <LifeBuoy className="mr-2 h-4 w-4" /> Liên hệ hỗ trợ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
