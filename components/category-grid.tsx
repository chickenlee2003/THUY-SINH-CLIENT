"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/services/apiClient";

interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  status: string;
  categoryParentId: number;
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link 
          href={`/category/${category.categoryId}`} 
          key={category.categoryId}
          className="transform transition-transform hover:scale-105"
        >
          <Card className="overflow-hidden border-2 border-transparent hover:border-teal-500">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={category.categoryIcon || "/placeholder.svg"}
                alt={category.categoryName}
                className="h-full w-full object-cover transition-transform hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white text-center">
                  {category.categoryName}
                </h3>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 