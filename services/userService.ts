import apiClient from "./apiClient";
import { ILoginRequest, IUser } from "../types/backend";

const userService = {
  login: async (data: ILoginRequest) => {
    return await apiClient.post("/auth/login", data);
  },
  updateUser: async (id: number, data: IUser) => {
    return await apiClient.put(`/users/${id}`, data);
  },
  createUser: async (
    data: Omit<
      IUser,
      "userId" | "createdAt" | "updatedAt" | "role" | "locations"
    >
  ) => {
    const res = await apiClient.post("/users", data);
    console.log("User created:", res);
    return res;
  },
  logout: async () => {
    return await apiClient.post("/auth/logout");
  },
};

export default userService;
