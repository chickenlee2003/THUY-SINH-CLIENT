import apiClient from "./apiClient";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
