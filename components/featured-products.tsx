import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

const products: Product[] = [
  {
    id: "1",
    name: "Green Stone 1kg",
    price: 90.0,
    image: "/placeholder.svg",
    stock: 100,
  },
  {
    id: "2",
    name: "Blue Stone 1kg",
    price: 90.0,
    image: "/placeholder.svg",
    stock: 100,
  },
  {
    id: "3",
    name: "Black stones 1kg",
    price: 90.0,
    image: "/placeholder.svg",
    stock: 100,
  },
  {
    id: "4",
    name: "White stones 1kg",
    price: 90.0,
    image: "/placeholder.svg",
    stock: 100,
  },
  {
    id: "5",
    name: "Mixed colour stone 1kg",
    price: 140.0,
    image: "/placeholder.svg",
    stock: 100,
  },
  {
    id: "6",
    name: "Colour stone 1kg",
    price: 80.0,
    image: "/placeholder.svg",
    stock: 100,
  },
];

export function FeaturedProducts() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sản phẩm </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
