"use client";

// import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  Home,
  Clock,
  LifeBuoy,
  LogOut,
  SquareUserRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import userService from "@/services/userService";
// Mock user data
// const mockUser = {
//   name: "Tuấn Kiệt Lê",
//   email: "tuan.kiet@example.com",
//   avatar: "/placeholder.svg", // Replace with actual image URL
// };
const UserProfile = userService.getUser(Number(localStorage.getItem("id")));

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <header>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/placeholder.svg"
              alt="Kolathur Fish Market"
              className="h-12"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="search"
                placeholder="TÌm kiếm ..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
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
                        href="/support"
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
                <span>0vnđ</span>
                <span className="text-xs">(0 sản phẩm)</span>
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
              <Link href="/all-category">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-teal-700"
                >
                  Danh mục
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/category/aquarium-fishes">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-teal-700"
                >
                  Cá cảnh
                </Button>
              </Link>
            </li>
            <li>
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-teal-700"
              >
                Phụ kiện
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
