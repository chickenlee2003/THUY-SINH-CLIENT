/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ILoginRequest {
  email: string;
  password: string;
}
interface LoginRequest {
  email: string;
  password: string;
}

interface ILoginResponse {
  id: number;
  token: string;
  role: string;
  
}


export interface IResponse {
  status: number;
  message: string;
  data: any;
}
export interface IPolicy {
  policyId: number;
  policyName: string;
  policyDescription: string;
  policyContent: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface IUser {
  userId?: number;
  email: string;
  fullName: string;
  password?: string;
  phoneNumber: string | null;
  avatar?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
  role?: "ROLE_USER" | "ROLE_ADMIN" | "ROLE_EMPLOYEE";
  locations?: any[];
}
export interface ICategoryParent {
  categoryParentId: number;
  categoryParentName: string;
  categoryParentIcon: string;
  status: "ACTIVE" | "INACTIVE";
  categories: ICategory[];
}

export interface ICategory {
  categoryId?: number;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  status: "ACTIVE" | "INACTIVE";
  categoryParentId: number;
}

export interface IProduct {
  productId?: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string;
  status: "ACTIVE" | "INACTIVE";
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrder {
  orderId?: number;
  userId: number;
  orderTotal: number;
  orderStatus: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELED";
  createdAt?: string;
  updatedAt?: string;
  orderDetails?: IOrderDetail[];
}

export interface IOrderDetail {
  orderDetailId?: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReview {
  reviewId?: number;
  userId: number;
  productId: number;
  reviewContent: string;
  reviewRating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILocation {
  locationId?: number;
  locationName: string;
  locationAddress: string;
  locationPhone: string;
  locationEmail: string;
  locationImage: string;
  locationDescription: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IAddress {
  latitude: number;
  longitude: number;
  description: string;
  userId: number; 
  locationId?: number;
}


export interface ICart {
  productId: number;
  quantity: number;
}

export interface ICartProduct extends IProduct {
  quantity: number;
}

export interface IOrderWithDetails extends IOrder {
  orderDetails: IOrderDetail[];
}

export interface IOrderWithUser extends IOrder {
  user: IUser;
}


export interface OrderCreateRequestDto {
  orderNote?: string; // Optional note for the order
  locationId: number; // ID of the location for delivery
  voucherId?: string; // Optional voucher code

}

export interface OrderResponseDTO {
  orderId: number;
  orderNote?: string;
  totalAmount: number;
  totalDiscount?: number;
  expectedDeliveryTime?: string;
  shippingFee?: number;
  orderStatus: string;
  userId: number;
  locationId?: number;
  voucherId?: number;
  orderDetails?: OrderDetailDTO[];
  location?: LocationDTO;
  payment?: PaymentResponseDTO;
}

export interface OrderDetailDTO {
  productId: number;
  orderDetailPrice: number;
  orderDetailQuantity: number;
  orderDetailAmount: number;
  // Add other fields as necessary
} 
