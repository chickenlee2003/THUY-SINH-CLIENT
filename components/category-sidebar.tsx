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
  Shell,
  ShellIcon as ShrimpIcon,
  Anchor,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "fish-food", icon: Cookie, label: "Thức ăn" },
  { id: "accessories", icon: Package, label: "Phụ kiện" },
  { id: "aquarium-tanks", icon: Container, label: "Hồ cá" },
  { id: "fresh-water-fishes", icon: Droplets, label: "Cá nước ngọt" },
  { id: "monster-fishes", icon: MonsterFish, label: "Cá săn mồi" },
  { id: "snails", icon: Shell, label: "Ốc" },
  { id: "shrimp", icon: ShrimpIcon, label: "Tôm" },
  { id: "marinefish", icon: Anchor, label: "Cá nước mặn" },
  { id: "all", icon: Fish, label: "Tất cả sản phẩm" },
];

interface CategorySidebarProps {
  activeCategory?: string;
}

export function CategorySidebar({
  activeCategory = "all",
}: CategorySidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", categoryId);
    router.push(`/products?${params.toString()}`);
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
