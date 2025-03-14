"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, ShoppingBag,  Heart,   TicketCheck, User, Trash2, LogOut } from "lucide-react"

interface SidebarProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  activePath: string
}

export default function Sidebar({ user, activePath }: SidebarProps) {
  const navItems = [
    { path: "/dashboard", label: "Bảng điều khiển", icon: Home },
    { path: "/purchase-history", label: "Lịch sử mua hàng", icon: ShoppingBag },
    // { path: "/downloads", label: "Tải xuống", icon: Download },
    { path: "/wishlist", label: "Danh sách yêu thích", icon: Heart },
    { path: "/support-ticket", label: "Hỗ trợ", icon: TicketCheck },
    { path: "/profile", label: "Quản lý hồ sơ", icon: User },
    { path: "/delete-account", label: "Xóa tài khoản", icon: Trash2 },
  ]

  return (
    <div className="w-72 border-r bg-white p-4">
      <div className="flex flex-col items-center mb-8 pt-4">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={user.avatar || "/avatardf.png"} alt="Avatar" />
          <AvatarFallback className="text-3xl">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-medium">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                activePath === item.path ? "bg-teal-50 text-teal-600 font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-8">
        <Button variant="default" className="w-full bg-teal-600 hover:bg-teal-700">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}

