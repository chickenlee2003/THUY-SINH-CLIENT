"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CategoryList } from "@/components/category-list";

export default function AllCategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Link href="/" className="hover:text-teal-600">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>Tất cả danh mục</span>
      </div>

      <h1 className="mb-8 text-2xl font-bold">Tất cả danh mục</h1>

      <CategoryList />
    </div>
  );
}
