import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import Link from "next/link";

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
    name: "Gold",
    price: 9.0,
    image: "/placeholder.svg",
    stock: 680,
  },
  {
    id: "2",
    name: "Pink Zebra Danio",
    price: 9.0,
    image: "/placeholder.svg",
    stock: 200,
  },
  {
    id: "3",
    name: "Green Zebra Danio",
    price: 9.0,
    image: "/placeholder.svg",
    stock: 150,
  },
  {
    id: "4",
    name: "Angel Fish",
    price: 25.0,
    image: "/placeholder.svg",
    stock: 80,
  },
  {
    id: "5",
    name: "Guppy Female",
    price: 15.0,
    image: "/placeholder.svg",
    stock: 300,
  },
  {
    id: "6",
    name: "Molly",
    price: 10.0,
    image: "/placeholder.svg",
    stock: 250,
  },
];

export function BestSelling() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bán chạy nhất</h2>
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
