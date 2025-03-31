"use client";

// import Link from 'next/link'
import { useRouter, useSearchParams } from "next/navigation";
import {
  Fish,
  Cookie,
  Package,
  Container,
  Droplets,
  FishIcon as MonsterFish,
  ShellIcon as ShrimpIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "category-parent/4", icon: Cookie, label: "Thức ăn" },
  { id: "/category-parent/2", icon: Package, label: "Phụ kiện" },
  { id: "/category/4", icon: Container, label: "Hồ cá" },
  { id: "/category-parent/1", icon: Droplets, label: "Cá nước ngọt" },
  { id: "/category-parent/5", icon: MonsterFish, label: "Cá săn mồi" },
  { id: "/category-parent/6", icon: ShrimpIcon, label: "Tép cảnh" },
  { id: "/category/11", icon: Fish, label: "Một số loại cá khác" },
  // { id: "marinefish", icon: Anchor, label: "Cá nước mặn" },
  { id: "/", icon: Fish, label: "Tất cả sản phẩm" },
];

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

  const handleCategoryClick = (categoryId: string) => {
    debugger;
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
    <div className="bg-white rounded-lg shadow">
      <ul className="divide-y">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors",
                activeCategory === category.id && "bg-gray-50 text-teal-600"
              )}
            >
              <category.icon
                className={cn(
                  "h-5 w-5",
                  activeCategory === category.id
                    ? "text-teal-600"
                    : "text-gray-500"
                )}
              />
              <span>{category.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
