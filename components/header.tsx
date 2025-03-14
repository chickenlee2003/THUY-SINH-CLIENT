"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  Home,
  Clock,
  LifeBuoy,
  LogOut,
  SquareUserRound,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import userService from "@/services/userService";
import { CameraInterface } from "@/components/camera-interface";
import { useToast } from "@/components/ui/use-toast";

// Mock user data
// const mockUser = {
//   name: "Tuấn Kiệt Lê",
//   email: "tuan.kiet@example.com",
//   avatar: "/placeholder.svg", // Replace with actual image URL
// };
// const UserProfile = userService.getUser(Number(localStorage.getItem("id")));
const UserProfile = typeof window !== 'undefined' 
  ? userService.getUser(Number(localStorage.getItem("id")))
  : null;

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  const handleImageCapture = async (imageData: string) => {
    setShowCamera(false);

    toast({
      title: "Processing image...",
      description: "Please wait a moment.",
    });

    try {
      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      // Send to prediction API
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.prediction) {
        toast({
          title: "Prediction Result",
          description: `This could be: ${result.prediction}`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Unable to Identify",
          description: "Sorry, we couldn't identify the fish in the image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error predicting image:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the image.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <header>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="Cửa hàng thuỷ sinh"
                className="h-12"
              />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="TÌm kiếm ..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full flex-shrink-0 border-teal-600 text-teal-600 hover:bg-teal-50"
                onClick={() => setShowCamera(true)}
                title="Identify fish by image"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>

            {/* User, Wishlist, and Cart */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Wishlist Button */}
                  <Link href="/wishlist" className="hover:text-teal-600">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Danh sách yêu thích</span>
                    </Button>
                  </Link>

                  {/* Avatar Dropdown */}
                  <div className="relative group z-50">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar>
                        <AvatarImage
                          src={UserProfile?.avatar || "/avatardf.png"}
                          alt={UserProfile?.name || ""}
                        />
                        <AvatarFallback>
                          {UserProfile?.name?.charAt(0) || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block">
                        <p className="text-sm font-medium">{user?.name}</p>
                      </div>
                    </div>
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="bg-white rounded-lg shadow-lg border w-56 py-2">
                        {/* <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <Home className="w-4 h-4" />
                          Danh mục
                        </Link> */}
                          <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <SquareUserRound className="w-4 h-4" />
                          Thông tin cá nhân
                        </Link>
                        <Link
                          href="/purchase-history"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <Clock className="w-4 h-4" />
                          Lịch sử mua hàng
                        </Link>

                        <Link
                          href="/support-page"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <LifeBuoy className="w-4 h-4" />
                          Hỗ trợ
                        </Link>
                        <div className="border-t my-2" />
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                          onClick={logout}
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="hover:text-teal-600">
                    Đăng nhập
                  </Link>
                  <span>/</span>
                  <Link href="/register" className="hover:text-teal-600">
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Shopping Cart */}
              <Link href="/cart">
                <Button variant="outline" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Giỏ hàng</span>
                  {/* <span>0vnđ</span>
                  <span className="text-xs">(0 sản phẩm)</span> */}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-teal-600 text-white">
          <div className="container mx-auto px-4">
            <ul className="flex items-center">
              {/* <li>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-teal-700">
                  Categories
                </Button>
              </li> */}
              <li>
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-teal-700"
                  >
                    Trang chủ
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-teal-700"
                  >
                    Danh mục
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/products/category-parent/1">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-teal-700"
                  >
                    Cá cảnh
                  </Button>
                </Link>
              </li>
              <li>
              <Link href="/products/category-parent/2">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-teal-700"
                >
                  Phụ kiện
                </Button>
               </Link> 
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {showCamera && (
        <CameraInterface onCapture={handleImageCapture} onClose={() => setShowCamera(false)} />
      )}
    </>
  );
}
