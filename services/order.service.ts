import apiClient from "./apiClient";
import { OrderCreateRequestDto, OrderResponseDTO } from "@/types/backend"; // Adjust the import path as necessary

const orderService = {
  // Create a new order
  createOrder: async (
    userId: number,
    orderData: OrderCreateRequestDto
  ): Promise<OrderResponseDTO> => {
    const response = await apiClient.post(`/orders/user/${userId}`, orderData);
    return response.data;
  },

  // Get all orders for a user
  getUserOrders: async (userId: number): Promise<OrderResponseDTO[]> => {
    const response = await apiClient.get(`/orders/user/${userId}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: number): Promise<OrderResponseDTO> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    return apiClient.put(`/orders/status/${orderId}`, { orderStatus: status });
  },

  updatePaymentStatus: async (orderId: number, status: string) => {
    return apiClient.put(`/orders/payment/${orderId}`, {
      paymentStatus: status,
    });
  },

  // Cancel order
  cancelOrder: async (orderId: number) => {
    return apiClient.put(`/orders/status/${orderId}`, {
      orderStatus: "CANCELLED",
    });
  },

  // Check if a user has purchased a specific product
  hasUserPurchasedProduct: async (
    userId: number,
    productId: number
  ): Promise<boolean> => {
    const response = await apiClient.get(
      `/orders/user/${userId}/has-purchased/product/${productId}`
    );
    return response.data;
  },
};

export default orderService;
