export interface OrderDetail {
  productId: number;
  productName: string;
  orderDetailPrice: number;
  orderDetailQuantity: number;
}

export interface Location {
  locationId: number;
  longitude: string;
  latitude: string;
  description: string;
}

export interface Payment {
  paymentId: number;
  paymentAmount: number;
  paymentStatus: "PENDING" | "COMPLETED";
  paymentMethodId: number | null;
  paymentMethodName: string | null;
}

export interface OrderResponseDTO {
  orderId: number;
  orderNote: string;
  totalAmount: number;
  expectedDeliveryTime?: string;
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
  userId: number;
  locationId: number;
  orderDetails: OrderDetail[];
  location: Location;
  payment: Payment;
}

export interface OrderCreateRequestDto {
  orderNote: string;
  expectedDeliveryTime?: string;
  locationId: number;
  orderDetails: {
    productId: number;
    quantity: number;
  }[];
} 