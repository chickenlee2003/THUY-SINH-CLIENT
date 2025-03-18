"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Breadcrumb } from "@/components/breadcrumb";
import productService from "@/services/product.service";

// Define the product interface based on the API response
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
  reviews: Array<unknown>;
  createdAt: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (keyword) {
          const response = await productService.searchProducts(keyword);
          setProducts(response.data || []);
        } else {
          setProducts([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Có lỗi xảy ra khi tìm kiếm sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: `Tìm kiếm: "${keyword}"`, href: `/search?keyword=${encodeURIComponent(keyword)}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">
          Kết quả tìm kiếm cho &quot;{keyword}&quot;
        </h1>
        {!loading && products.length > 0 && (
          <p className="text-gray-600">Tìm thấy {products.length} sản phẩm</p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-600 mb-6">
            Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với từ khóa &quot;{keyword}&quot;
          </p>
          <div className="space-y-4">
            <p className="font-medium">Bạn có thể thử:</p>
            <ul className="text-left list-disc list-inside space-y-2">
              <li>Kiểm tra lại chính tả</li>
              <li>Sử dụng từ khóa khác</li>
              <li>Sử dụng từ khóa ngắn hơn</li>
            </ul>
            <Link href="/categories">
              <span className="inline-block mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Xem tất cả danh mục
              </span>
            </Link>
          </div>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              productId={product.productId}
              productName={product.productName}
              productPrice={product.productPrice}
              productDescription={product.productDescription}
              productQuantity={product.productQuantity}
              productStatus={product.productStatus}
              images={product.images}
            />
          ))}
        </div>
      )}
    </div>
  );
} 