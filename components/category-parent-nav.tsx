"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import categoryService from "@/services/category.service";

interface CategoryParent {
  categoryParentId: number;
  categoryParentName: string;
}

export function CategoryParentNav() {
  const [categoryParents, setCategoryParents] = useState<CategoryParent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryParents = async () => {
      try {
        setIsLoading(true);
        const data = await categoryService.getCategoriesParentActive();
        // Limit to a reasonable number if needed
        const limitedData = data.slice(0, 6); // Adjust the limit as needed
        setCategoryParents(limitedData);
      } catch (error) {
        console.error("Failed to fetch category parents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryParents();
  }, []);

  if (isLoading) {
    // Optional: Return skeleton loading state
    return (
      <ul className="flex items-center space-x-2">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex items-center space-x-1 overflow-x-auto">
      {categoryParents.map((parent) => (
        <li key={parent.categoryParentId}>
          <Link href={`/products/category-parent/${parent.categoryParentId}`}>
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-teal-700 whitespace-nowrap"
            >
              {parent.categoryParentName}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
