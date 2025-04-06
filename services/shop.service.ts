import apiClient from "./apiClient";

const shopService = {
  getShopById: async (id: number) => {
    const response = await apiClient.get(`/shops/${id}`);
    return response.data;
  },
};

export default shopService;
