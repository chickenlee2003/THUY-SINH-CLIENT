"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import productService from "@/services/product.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySidebar } from "@/components/category-sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productQuantity: number;
  productStatus: "AVAILABLE" | "UNAVAILABLE" | "DISCONTINUED";
  categoryId: number;
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const response = await productService.getAllProducts();
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally { 
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const sortedProducts = [...products];
    switch (sort) {
      case "price-low":
        sortedProducts.sort((a, b) => a.productPrice - b.productPrice);
        break;
      case "price-high":
        sortedProducts.sort((a, b) => b.productPrice - a.productPrice);
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  }, [sort]);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.categoryId === selectedCategory)
    : products;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <CategorySidebar activeCategory="/" />
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Tất cả sản phẩm</h1>
            <Select defaultValue="default" onValueChange={setSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="price-low">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá: Cao đến thấp</SelectItem>
                <SelectItem value="name-asc">Tên: A đến Z</SelectItem>
                <SelectItem value="name-desc">Tên: Z đến A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có sản phẩm nào.</p>
            </div>
          ) : (
            <>
              <ProductGrid products={currentItems} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={prevPage} 
                    disabled={currentPage === 1}
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
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
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