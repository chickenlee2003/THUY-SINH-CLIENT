// Add or update these types in the existing file

export interface ReviewUser {
  name: string;
  avatar?: string;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: string;
  adminReply?: string;
  user?: ReviewUser;
}

export interface ReviewSubmitData {
  userId: number;
  productId: number;
  rating: number;
  comment: string;
}
