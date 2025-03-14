"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import apiClient from "@/services/apiClient";

interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  status: string;
  categoryParentId: number;
}

export function CategoryShowcase() {
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-r from-teal-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Khám phá danh mục sản phẩm</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp đa dạng các loại cá cảnh và phụ kiện chất lượng cao, 
            được tuyển chọn kỹ lưỡng để đáp ứng nhu cầu của mọi người yêu thích thủy sinh.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              href={`/products/category/${category.categoryId}`} 
              key={category.categoryId}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 group-hover:shadow-xl">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.categoryIcon || "/placeholder.svg"}
                    alt={category.categoryName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                </div>
                <CardContent className="relative p-5 bg-white">
                  <h3 className="text-xl font-bold text-center mb-2 text-teal-800">
                    {category.categoryName}
                  </h3>
                  <div className="flex justify-center">
                    <span className="inline-flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-800">
                      Xem sản phẩm
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/categories">
            <Button variant="outline" className="rounded-full px-6">
              Xem tất cả danh mục
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 