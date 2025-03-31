import apiClient from "./apiClient";
import type { ReviewResponse, ReviewSubmitData } from "@/types/backend";

const reviewService = {
  // Lấy tất cả đánh giá của một sản phẩm
  getProductReviews: async (productId: number): Promise<ReviewResponse[]> => {
    try {
      const response = await apiClient.get(`/reviews/product/${productId}`);
      
      console.log("Review response data:", response.data);
      if (Array.isArray(response.data)) {
        return response.data.map(review => ({
          id: review.reviewId || review.id || 0,
          userId: review.userId || 0,
          productId: review.productId || productId,
          rating: review.rating || 0,
          comment: review.comment || '',
          createdAt: review.createdAt || new Date().toISOString(),
          adminReply: review.adminReply,
          user: review.user ? {
            name: review.user.fullName || 'Anonymous User',
            avatar: review.user.avatar
          } : {
            name: 'Anonymous User',
            avatar: undefined
          }
        }));
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      return [];
    }
  },

  // Lấy điểm đánh giá trung bình của sản phẩm
  getAverageRating: async (productId: number): Promise<number> => {
    try {
      const response = await apiClient.get(`/reviews/product/${productId}/average-rating`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching average rating for product ${productId}:`, error);
      return 0;
    }
  },

  // Tạo đánh giá mới
  createReview: async (data: ReviewSubmitData): Promise<ReviewResponse> => {
    const response = await apiClient.post("/reviews", data);
    
    const review = response.data;
    return {
      id: review.reviewId || review.id || 0,
      userId: review.userId || 0,
      productId: review.productId || data.productId,
      rating: review.rating || 0,
      comment: review.comment || '',
      createdAt: review.createdAt || new Date().toISOString(),
      adminReply: review.adminReply,
      user: review.user ? {
        name: review.user.fullName || 'Anonymous User',
        avatar: review.user.avatar
      } : {
        name: 'Anonymous User',
        avatar: undefined
      }
    };
  },

  // Xóa đánh giá
  deleteReview: async (reviewId: number): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },

  // Lấy tất cả đánh giá của người dùng
  getAllReviewsByUser: async (userId: number): Promise<ReviewResponse[]> => {
    try {
      const response = await apiClient.get(`/reviews/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching reviews for user ${userId}:`, error);
      return [];
    }
  },

  // Kiểm tra xem người dùng đã đánh giá sản phẩm chưa
  hasUserReviewed: async (userId: number, productId: number): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/reviews/check-reviewed?userId=${userId}&productId=${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error checking if user ${userId} has reviewed product ${productId}:`, error);
      return false;
    }
  },
};

export default reviewService;