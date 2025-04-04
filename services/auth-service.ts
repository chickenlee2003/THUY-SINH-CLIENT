import apiClient from "./apiClient";
import { ILoginRequest, ILoginResponse } from "../types/backend";

export const authService = {
  async login(credentials: ILoginRequest): Promise<ILoginResponse> {
    const response = await apiClient.post("/auth/login", credentials);
    const { id, token, role, avatar , fullName } = response.data;
    console.log("Login response:", response.data);
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
    localStorage.setItem("role", role);
   localStorage.setItem("avatar", avatar);
   localStorage.setItem("fullName", fullName);
    
//reload page after login and redirect to home page
    window.location.href = "/";
    

    return response.data;

  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("avatar");
    localStorage.removeItem("fullName");
    localStorage.clear();
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
};
