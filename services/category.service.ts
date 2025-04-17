import apiClient from "./apiClient";

const categoryService = {
  getCategoryById: async (id: number) => {
    const response = await apiClient.get(`/category/${id}`);
    return response.data;
  },
  getCategoryParentById: async (id: number) => {
    const response = await apiClient.get(`/category-parent/${id}`);
    return response.data;
  },
  getCategoritesActive: async () => {
    const response = await apiClient.get(`/category/active`);
    return response.data;
  },
  getCategoriesParentActive: async () => {
    const response = await apiClient.get(`/category-parent/active`);
    return response.data;
  },
};

export default categoryService;
