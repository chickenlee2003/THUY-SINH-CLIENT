"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid } from "@/components/product-grid";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import productService from "@/services/product.service";
import { CategorySidebar } from "@/components/category-sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Review {
  reviewId: number;
  reviewContent: string;
  reviewRating: number;
  userId: number;
  productId: number;
  createdAt: string;
}

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productQuantity: number;
  productSold: number;
  productStatus: "AVAILABLE" | "UNAVAILABLE" | "DISCONTINUED";
  categoryId: number;
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
  reviews: Review[];
  createdAt: string;
}

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("default");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productService.getProductsByCategory(Number(id));
        setAllProducts(response.data);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [id]);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  // Effect for sorting and filtering
  useEffect(() => {
    // Show loading when changing sort or filter
    if (products.length === 0 || !allProducts.length) return;
    
    setIsFiltering(true);
    
    const timer = setTimeout(() => {
      const sortedProducts = [...allProducts];
      
      // Apply category filter first if selected
      const filteredByCategory = selectedCategory
        ? sortedProducts.filter(product => product.categoryId === selectedCategory)
        : sortedProducts;
      
      // Then apply sorting
      switch (sort) {
        case "price-low":
          filteredByCategory.sort((a, b) => a.productPrice - b.productPrice);
          break;
        case "price-high":
          filteredByCategory.sort((a, b) => b.productPrice - a.productPrice);
          break;
        case "name-asc":
          filteredByCategory.sort((a, b) => a.productName.localeCompare(b.productName));
          break;
        case "name-desc":
          filteredByCategory.sort((a, b) => b.productName.localeCompare(a.productName));
          break;
        case "bestseller":
          filteredByCategory.sort((a, b) => (b.productSold || 0) - (a.productSold || 0));
          break;
        case "newest":
          filteredByCategory.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        default:
          break;
      }
      
      setProducts(filteredByCategory);
      setIsFiltering(false);
    }, 200); 
    
    return () => clearTimeout(timer);
  }, [sort, selectedCategory, allProducts]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (!id) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategorySidebar 
            activeCategory={`/category/${id}`}
            onCategorySelect={(categoryId) => setSelectedCategory(categoryId)}
          />
        </div>
        <div className="md:col-span-3">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Sản phẩm theo danh mục</h1>
            <div className="flex items-center gap-2">
              {isFiltering && (
                <div className="flex items-center text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Đang tải...
                </div>
              )}
              <Select 
                defaultValue="default" 
                onValueChange={(value) => {
                  setSort(value);
                }}
                disabled={isFiltering}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="price-low">Giá: Thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá: Cao đến thấp</SelectItem>
                  <SelectItem value="name-asc">Tên: A đến Z</SelectItem>
                  <SelectItem value="name-desc">Tên: Z đến A</SelectItem>
                  <SelectItem value="bestseller">Bán chạy nhất</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có sản phẩm nào trong danh mục này.</p>
            </div>
          ) : (
            <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              <ProductGrid products={currentItems} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={prevPage} 
                    disabled={currentPage === 1 || isFiltering}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(i + 1)}
                      className="min-w-[40px]"
                      disabled={isFiltering}
                    >
                      {i + 1}
                    </Button>
                  )).slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={nextPage} 
                    disabled={currentPage === totalPages || isFiltering}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  );
}