"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/side-bar"
import userService from "@/services/user.service"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: ""
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userService.getUserById(Number(localStorage.getItem("id")));
        setUser({
          name: response.data.fullName,
          email: response.data.email,
          avatar: response.data.avatar
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} activePath={pathname} />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
} 