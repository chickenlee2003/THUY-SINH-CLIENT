"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, CreditCard, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderResponseDTO } from "@/types/backend";
import orderService from "@/services/order.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "react-toastify";
import apiClient from "@/services/apiClient";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Thêm interface mở rộng cho OrderDetailDTO
interface ExtendedOrderDetailDTO {
  productId: number;
  productName?: string;
  orderDetailPrice: number;
  orderDetailQuantity: number;
}

export default function PurchaseHistoryPage() {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = Number(localStorage.getItem("id"));
        if (!userId) {
          toast.error("Vui lòng đăng nhập để xem lịch sử mua hàng");
          return;
        }
        const response = await orderService.getUserOrders(userId);
        console.log("Fetched orders:", response);
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Không thể tải lịch sử đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Lọc danh sách đơn hàng theo trạng thái
  const filteredOrders = filterStatus
    ? orders.filter((order) => order.orderStatus === filterStatus)
    : orders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600";
      case "PROCESSING":
        return "text-blue-600";
      case "SHIPPING":
        return "text-purple-600";
      case "COMPLETED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatOrderDate = (order: OrderResponseDTO) => {
    try {
      if (order.expectedDeliveryTime) {
        return formatDate(new Date(order.expectedDeliveryTime));
      }
      return "Chưa có ngày giao hàng";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Ngày không hợp lệ";
    }
  };

  const handlePayment = async (order: OrderResponseDTO) => {
    try {
      const paymentData = {
        paymentAmount: order.totalAmount,
        orderId: order.orderId,
      };

      const response = await apiClient.post("/pay", paymentData);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Lỗi khi khởi tạo thanh toán");
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;

    setIsCancelling(true);
    try {
      await apiClient.put(`/orders/status/${cancelOrderId}`, {
        orderStatus: "CANCELLED",
      });

      // Cập nhật danh sách đơn hàng
      setOrders(
        orders.map((order) =>
          order.orderId === cancelOrderId
            ? { ...order, orderStatus: "CANCELLED" }
            : order
        )
      );

      toast.success("Đơn hàng đã được hủy thành công");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Không thể hủy đơn hàng");
    } finally {
      setIsCancelling(false);
      setCancelOrderId(null);
    }
  };

  // Kiểm tra xem đơn hàng có thể hủy không
  const canCancelOrder = (order: OrderResponseDTO) => {
    return (
      order.orderStatus === "PENDING" || order.orderStatus === "PROCESSING"
    );
  };

  // Kiểm tra xem đơn hàng có thể thanh toán không
  const canPayOrder = (order: OrderResponseDTO) => {
    return (
      order.orderStatus !== "CANCELLED" &&
      order.orderStatus !== "COMPLETED" &&
      order.payment.paymentStatus !== "COMPLETED"
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Lịch sử mua hàng</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Lịch sử mua hàng</h1>

      {/* Bộ lọc trạng thái */}
      <div className="mb-6 flex flex-wrap gap-4">
        {[
          "All",
          "PENDING",
          "PROCESSING",
          "SHIPPING",
          "COMPLETED",
          "CANCELLED",
        ].map((status) => (
          <Button
            key={status}
            variant={
              filterStatus === (status === "All" ? null : status)
                ? "default"
                : "outline"
            }
            onClick={() => setFilterStatus(status === "All" ? null : status)}
            className={status !== "All" ? getStatusColor(status) : ""}
          >
            {status === "All" ? "Tất cả" : getStatusText(status)}
          </Button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-600">Không tìm thấy đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="border rounded-lg p-4 shadow-sm"
            >
              {/* Order Summary */}
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="w-5/12">
                  <p className="font-medium">Đơn hàng #{order.orderId}</p>
                  <p className="text-sm text-gray-500">
                    Giao hàng: {formatOrderDate(order)}
                  </p>
                  <p className={`text-sm ${getStatusColor(order.orderStatus)}`}>
                    Trạng thái: {getStatusText(order.orderStatus)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Địa chỉ: {order.orderAddress}
                  </p>
                  <p className="text-sm text-gray-500">
                    Số điện thoại: {order.orderPhoneNumber}
                  </p>
                </div>

                <div className="w-2/12 text-right">
                  <p className="text-sm text-gray-500">Tổng tiền:</p>
                  <p className="text-lg font-bold text-teal-600">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>

                <div className="w-5/12 flex flex-col sm:flex-row gap-2">
                  {canPayOrder(order) && (
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handlePayment(order)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Thanh toán
                    </Button>
                  )}

                  {canCancelOrder(order) &&
                    order.payment.paymentStatus !== "COMPLETED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancelOrderId(order.orderId)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Hủy đơn
                      </Button>
                    )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleOrderDetails(order.orderId)}
                  >
                    {expandedOrder === order.orderId ? (
                      <>
                        Ẩn chi tiết <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Xem chi tiết <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrder === order.orderId && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  {order.orderDetails &&
                    order.orderDetails.map((item: ExtendedOrderDetailDTO) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center"
                      >
                        <p>{item.productName}</p>
                        <div className="flex items-center gap-4">
                          <p>
                            {formatCurrency(item.orderDetailPrice)} x{" "}
                            {item.orderDetailQuantity}
                          </p>
                          <p className="font-bold">
                            {formatCurrency(
                              item.orderDetailPrice * item.orderDetailQuantity
                            )}
                          </p>
                        </div>
                      </div>
                    ))}

                  {/* Tổng giá và ghi chú */}
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span>{order.shippingFee || 0} VNĐ</span>
                    </div>

                    {order.orderNote && (
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Ghi chú:</span>
                        <span>{order.orderNote}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Trạng thái thanh toán:
                      </span>
                      <span
                        className={
                          order.payment.paymentStatus === "COMPLETED"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {order.payment.paymentStatus === "COMPLETED"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-teal-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    {/* <div className="flex space-x-4 pt-4">
                        <Link   href={`/orders/${order.orderId}`}   className="text-blue-600 hover:underline">
                        chi tiết                         </Link>
      
                    </div> */}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hộp thoại xác nhận hủy đơn hàng */}
      <AlertDialog
        open={!!cancelOrderId}
        onOpenChange={() => setCancelOrderId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Không, giữ lại
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? "Đang hủy..." : "Có, hủy đơn hàng"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
