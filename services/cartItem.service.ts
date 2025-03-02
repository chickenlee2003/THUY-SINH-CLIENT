import apiClient from "./apiClient";

const cartItemService = {
  // Add an item to the cart
  addItemToCart: async (productId: number, quantity: number, userId: number) => {
    return await apiClient.post(`/cartItems/item/add?productId=${productId}&quantity=${quantity}&userId=${userId}`);
  },

  // Remove an item from the cart
  removeItemFromCart: async (cartId: number, productId: number) => {
    return await apiClient.delete(`/cartItems/${cartId}/remove/${productId}`);
  },

  // Update the quantity of an item in the cart
  updateItemQuantity: async (cartId: number, productId: number, quantity: number) => {
    return await apiClient.put(`/cartItems/${cartId}/update/${productId}/quantity/${quantity}`);
  },

  // Get a specific cart item
  getCartItem: async (cartId: number, productId: number) => {
    return await apiClient.get(`/cartItems/${cartId}/item/${productId}`);
  },

  // Get the cart for a specific user
  getCartByUserId: async (userId: number) => {
    return await apiClient.get(`/carts/user/${userId}`);
  },
};

export default cartItemService;

