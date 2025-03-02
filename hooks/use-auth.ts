"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { toast } from "react-toastify";

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setIsLoading(false);
  }, []);
  

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      router.push("/");
      router.refresh();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
}
