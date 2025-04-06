"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductDetails } from "@/components/product-details";
import { ProductReviews } from "@/components/product-reviews";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import productService from "@/services/product.service";
import reviewService from "@/services/review.service";
import { use } from "react";
import type { ReviewResponse } from "@/types/backend";
import { RelatedProduct } from "@/components/related-product";

interface ProductReview {
  reviewId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productQuantity: number;
  productSold: number;
  productStatus: "AVAILABLE" | "UNAVAILABLE";
  categoryId: number;
  categoryName: string;
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
  reviews: ProductReview[]; 
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
  const [apiReviews, setApiReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductData() {
      setIsLoading(true);
      setError(null);
      try {
        // First get the product details
        const productResponse = await productService.getProductById(Number(id));
        setProduct(productResponse.data);
        
        // Then try to get reviews separately to handle potential review API errors
        try {
          const reviewsResponse = await reviewService.getProductReviews(Number(id));
          setApiReviews(reviewsResponse);
        } catch (reviewErr) {
          console.error("Error fetching reviews:", reviewErr);
          // Don't set error state for the whole page if just reviews fail
          setApiReviews([]);
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductData();
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
          {product.categoryName} 
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>{product.productName}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductImageGallery images={product.images} />
        <ProductDetails {...product} />
      </div>
      
      {/* Product Description */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
        <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: product.productDescription }} />
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <RelatedProduct categoryId={product.categoryId} />
      </div>

      {/* Product Reviews */}
      <div className="mt-16">
        <ProductReviews
          productId={product.productId}
          reviews={apiReviews}
        />
      </div>
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