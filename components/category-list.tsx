"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Fish } from "lucide-react"; // Default icon
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import { API } from "@/utils/constants";

interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  status: string;
  categoryParentId: number | null;
  subcategories?: Category[];
}

const iconMap: { [key: string]: React.ElementType } = {
  fish: Fish, // Replace this with actual mappings
};

export function CategoryList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await apiClient.get(API.CATEGORY.GET);
      // Đảm bảo dữ liệu trả về là một mảng
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Không thể tải danh mục. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", categoryId.toString());
    router.push(`/products?${params.toString()}`);
  };

  // Hiển thị lỗi nếu xảy ra
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // Đảm bảo categories luôn là một mảng trước khi map
  return (
    <div className="space-y-8">
      {(categories || []).map((category) => {
        const IconComponent = iconMap[category.categoryIcon] || Fish;
        return (
          <div key={category.categoryId} className="space-y-4">
            <button
              onClick={() => handleCategoryClick(category.categoryId)}
              className={cn(
                "flex w-full items-center gap-4 rounded-lg border p-4 hover:border-teal-600 hover:text-teal-600"
              )}
            >
              <IconComponent className="h-12 w-12" />
              <span className="text-xl font-medium">
                {category.categoryName}
              </span>
            </button>

            {category.subcategories && (
              <div className="ml-16 grid gap-2">
                {category.subcategories.map((subcategory) => {
                  const SubIconComponent =
                    iconMap[subcategory.categoryIcon] || Fish;
                  return (
                    <button
                      key={subcategory.categoryId}
                      onClick={() =>
                        handleCategoryClick(subcategory.categoryId)
                      }
                      className={cn(
                        "flex w-full items-center gap-4 rounded-lg p-2 hover:text-teal-600"
                      )}
                    >
                      <SubIconComponent className="h-5 w-5" />
                      <span>{subcategory.categoryName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
