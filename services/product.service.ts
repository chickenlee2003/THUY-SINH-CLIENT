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
  getProductsByCategoryName: async (categoryName: string) => {
    return await apiClient.get(`/products/category/name/${categoryName}`);
  },
  getProductBestSelling: async () => {
    return await apiClient.get("/products/sold");
  },
  getProductsByCategoryParent: async (categoryParentId: number) => {
    return await apiClient.get(`/products/category/parent/${categoryParentId}`);
  },
};

export default productService;