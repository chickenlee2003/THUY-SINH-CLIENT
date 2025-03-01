import apiClient from "./apiClient";
import { ILoginRequest, ILoginResponse } from "../types/backend";

export const authService = {
  async login(credentials: ILoginRequest): Promise<ILoginResponse> {
    const response = await apiClient.post("/auth/login", credentials);
    const { id, token } = response.data;
    localStorage.setItem("token", token);
    return { id, token };
  },

  async logout(): Promise<void> {
    await apiClient.post("/api/v1/auth/logout");
    localStorage.removeItem("token");
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
};
