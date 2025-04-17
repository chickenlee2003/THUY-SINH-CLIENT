"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import categoryService from "@/services/category.service";

interface CategoryType {
  id: string;
  label: string;
}

interface CategorySidebarProps {
  activeCategory?: string;
  onCategorySelect?: (categoryId: number | null) => void;
}

export function CategorySidebar({
  activeCategory = "all",
  onCategorySelect,
}: CategorySidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<CategoryType[]>([
    { id: "/", label: "Tất cả sản phẩm" },
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategoritesActive();

        // Map API data to category format
        const mappedCategories = data
          .map((cat: any) => {
            return {
              id: `/category/${cat.categoryId}`,
              label: cat.categoryName,
            };
          })
          // Limit to max 11 categories (plus "All Products" = 12 total)
          .slice(0, 11);

        // Add "Tất cả sản phẩm" at the end
        setCategories([
          ...mappedCategories,
          { id: "/", label: "Tất cả sản phẩm" },
        ]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", categoryId);
    const categoryUrl = categoryId;

    // Extract category ID if numeric value is present in the categoryId string
    if (onCategorySelect) {
      const match = categoryId.match(/\/category(?:-parent)?\/(\d+)/);
      const numericId = match ? parseInt(match[1]) : null;
      onCategorySelect(numericId);
    }

    router.push(`/products/${categoryUrl}`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "flex w-full items-center px-5 py-3.5 text-left transition-all duration-200",
                "hover:bg-gray-50 hover:text-teal-700 hover:pl-6",
                "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-200",
                activeCategory === category.id
                  ? "bg-gradient-to-r from-teal-50 to-white border-l-4 border-teal-500 text-teal-700 font-medium"
                  : "text-gray-700 border-l-4 border-transparent"
              )}
            >
              <span className="text-sm sm:text-base">{category.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
