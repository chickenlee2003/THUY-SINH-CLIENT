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
};

export default categoryService;
