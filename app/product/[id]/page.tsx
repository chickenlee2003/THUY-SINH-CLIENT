import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductDetails } from "@/components/product-details";
import { ProductReviews } from "@/components/product-reviews";

// This would typically come from an API or database
const products = {
  "1": {
    productId: 1,
    productName: "Gold Fish",
    productPrice: 25.0,
    productDescription: "Beautiful golden fish, perfect for your aquarium.",
    productQuantity: 100,
    productStatus: "AVAILABLE",
    categoryId: 2,
    images: [
      {
        imageId: 1,
        imageUrl: "/placeholder.svg",
      },
      {
        imageId: 2,
        imageUrl: "/placeholder.svg",
      },
    ],
    reviews: [],
    createdAt: "2025-01-17T08:32:47.700124",
  },
};

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products[params.id as keyof typeof products];

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/" className="hover:text-teal-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>{product.productName}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductImageGallery images={product.images} />
        <ProductDetails {...product} />
      </div>

      <ProductReviews
        productId={product.productId}
        reviews={product.reviews}
        description={product.productDescription}
      />
    </div>
  );
}
