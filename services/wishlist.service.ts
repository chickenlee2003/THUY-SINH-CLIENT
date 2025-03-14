import apiClient from "./apiClient";

export const wishlistService = {
  addToWishlist: async (productId: number) => {
    return await apiClient.post('/wishlists', {
      productId
    });
  },

  getWishlistByUserId: async (userId: number) => {
    return await apiClient.get(`/wishlists/user/${userId}`);
  },

  removeFromWishlist: async (wishlistId: number) => {
    return await apiClient.delete(`/wishlists/${wishlistId}`);
  }
};

