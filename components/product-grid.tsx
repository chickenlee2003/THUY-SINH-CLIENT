import { ProductCard } from "./product-card";

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productQuantity: number;
  productStatus: "AVAILABLE" | "UNAVAILABLE" | "DISCONTINUED";
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
  categoryId: number;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.productId} {...product} />
      ))}
    </div>
  );
}
