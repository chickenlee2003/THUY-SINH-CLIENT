import apiClient from "./apiClient";

const productService = {
  getAllProducts: async () => {
    return await apiClient.get("/products");
  },
  getProductById: async (id: number) => {
    return await apiClient.get(`/products/${id}`);
  },
  getProductsByCategory: async (categoryId: number) => {
    return await apiClient.get(`/products/category/${categoryId}`);
  },
 
};

export default productService;