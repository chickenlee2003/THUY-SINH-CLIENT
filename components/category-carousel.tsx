"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import apiClient from "@/services/apiClient";

interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  status: string;
  categoryParentId: number;
}

export function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setCurrentIndex(prev => Math.min(prev + 1, Math.max(0, categories.length - 3)));
    }
  };

  if (isLoading) {
    return (
      <div className="relative py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="relative py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Danh mục nổi bật</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={scrollLeft}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={scrollRight}
            disabled={currentIndex >= categories.length - 3}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Link 
            href={`/products/category/${category.categoryId}`} 
            key={category.categoryId}
            className="min-w-[280px] snap-start"
          >
            <Card className="overflow-hidden h-full border hover:border-teal-500 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.categoryIcon || "/placeholder.svg"}
                  alt={category.categoryName}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-center">{category.categoryName}</h3>
                {category.categoryDescription && (
                  <p className="text-sm text-gray-500 text-center mt-1 line-clamp-2">
                    {category.categoryDescription}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
} 