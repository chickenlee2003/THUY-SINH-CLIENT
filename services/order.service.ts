import apiClient from "./apiClient";
import { OrderCreateRequestDto, OrderResponseDTO } from "@/types/backend"; // Adjust the import path as necessary

const orderService = {
  // Create a new order
  createOrder: async (userId: number, orderData: OrderCreateRequestDto): Promise<OrderResponseDTO> => {
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

  // Update order status
  updateOrderStatus: async (orderId: number, status: string): Promise<OrderResponseDTO> => {
    const response = await apiClient.put(`/orders/status/${orderId}`, { orderStatus: status });
    return response.data;
  },

  // Update order payment status
  updateOrderPaymentStatus: async (orderId: number, paymentStatus: string): Promise<OrderResponseDTO> => {
    const response = await apiClient.put(`/orders/payment-status/${orderId}`, { paymentStatus });
    return response.data;
  },


};

export default orderService;

