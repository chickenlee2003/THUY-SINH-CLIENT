import apiClient from "./apiClient";

const productService = {
  getAllProducts: async () => {
    return await apiClient.get("/products");
  },
  getNewProducts: async () => {
    return await apiClient.get("/products/new");
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
  searchProducts: async (productName: string) => {
    return await apiClient.get(`/products/search?productName=${productName}`);
  },
  exportExcel: async () => {
    return await apiClient.get("/products/export/excel", {
      responseType: "blob", // Ensures the response is treated as a binary file
    });
  },
};

export default productService;
