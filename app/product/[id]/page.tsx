"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductDetails } from "@/components/product-details";
import { ProductReviews } from "@/components/product-reviews";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import productService from "@/services/product.service";
import { use } from "react";

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productQuantity: number;
  productStatus: "AVAILABLE" | "UNAVAILABLE" ;
  categoryId: number;
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
  reviews: any[]; // Thay đổi kiểu dữ liệu reviews nếu cần
  createdAt: string;
}

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(Number(id));
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">Không tìm thấy sản phẩm</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm">
        
        <Link href="/" className="hover:text-teal-600">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/products/category/${product.categoryId}`}
          className="hover:text-teal-600"
        >
          Danh mục {product.categoryId} 
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>{product.productName}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductImageGallery images={product.images} />
        <ProductDetails {...product} />
      </div>

      {/* <ProductReviews
        productId={product.productId}
        reviews={product.reviews}
        description={product.productDescription}
      /> */}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <Skeleton className="aspect-square rounded-lg" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}