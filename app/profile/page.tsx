"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import userService from "@/services/user.service" // Import userService
import { useAuth } from "@/hooks/use-auth" // Import useAuth hook

export default function ProfilePage() {
  const { isAuthenticated } = useAuth(); // Get authentication state
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const response = await userService.getUserById(Number(localStorage.getItem("id"))); // Replace with actual user ID
    
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userService.updateUser(1, user); // Replace with actual user ID
      console.log("Cập nhật thông tin thành công:", response.data);
    } catch (error) {
      console.error("Cập nhật thông tin thất bại:", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Quản lý Hồ sơ</h1>

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6">Thông tin cơ bản</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Họ tên</Label>
              <Input id="name" name="name" value={user.name} onChange={handleChange} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="Số điện thoại của bạn"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="photo">Ảnh đại diện</Label>
              <div className="flex mt-1">
                <Button variant="outline" className="mr-2">
                  Duyệt
                </Button>
                <Button variant="outline">Chọn tệp</Button>
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu mới</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Mật khẩu mới"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={user.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                className="mt-1"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Cập nhật hồ sơ
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Address */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Địa chỉ</h2>

        <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-lg p-8">
          <Button variant="ghost" className="flex flex-col items-center text-gray-500">
            <Plus className="h-8 w-8 mb-2" />
            <span>Thêm địa chỉ mới</span>
          </Button>
        </div>
      </div>
    </>
  );
} 