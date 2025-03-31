"use client";

import { ProductReviewSection } from "@/components/product-review-section";
import type { ReviewResponse } from "@/types/backend";

interface ProductReviewsProps {
  productId: number;
  reviews: ReviewResponse[];
}

export function ProductReviews({
  productId,
  reviews,
}: ProductReviewsProps) {
  return (
    <div className="mt-16">
      <ProductReviewSection
        productId={productId}
        initialReviews={reviews}
      />
    </div>
  );
}
