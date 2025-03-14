"use client"
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import productService from "@/services/product.service";

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  images: Array<{ imageId: number; imageUrl: string }>;
  productQuantity: number;
  productStatus: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
}

export function BestSellingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 6; // Số sản phẩm hiển thị trên mỗi trang

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getProductBestSelling();
        // Ensure productStatus is one of the allowed values
        const formattedProducts = response.data.map((product: {
          productId: number;
          productName: string;
          productPrice: number;
          images: Array<{ imageId: number; imageUrl: string }>;
          productQuantity: number;
          productStatus: string;
        }) => ({
          ...product,
          productStatus: mapProductStatus(product.productStatus)
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Failed to fetch best selling products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  // Helper function to map string status to enum values
  const mapProductStatus = (status: string): "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED" => {
    switch (status.toUpperCase()) {
      case "AVAILABLE":
        return "AVAILABLE";
      case "OUT_OF_STOCK":
        return "OUT_OF_STOCK";
      case "DISCONTINUED":
        return "DISCONTINUED";
      default:
        return "AVAILABLE"; // Default fallback
    }
  };

  // Tính toán sản phẩm hiển thị cho trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sản phẩm bán chạy</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sản phẩm bán chạy</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Không có sản phẩm bán chạy nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.productId}
              productId={product.productId}
              productName={product.productName}
              productPrice={product.productPrice}
              images={product.images}
              productQuantity={product.productQuantity}
              productStatus={product.productStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
} 