import { IUser } from "@/types/backend";
import apiClient from "./apiClient";

const userService = {
  getUserById: async (id: number) => {
    return await apiClient.get(`/users/${id}`);
  },
  updateUser: async (id: number, data: IUser) => {
    return await apiClient.put(`/users/${id}`, data);
  },
};

export default userService; 