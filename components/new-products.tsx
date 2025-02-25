import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Cá Betta Cái",
    price: 700.0,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Cá Betta Chiến Đấu",
    price: 200.0,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Cá Betta Trăng Tròn Siêu",
    price: 200.0,
    image: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Cá Betta Trăng Tròn Cái",
    price: 200.0,
    image: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Cá Betta Đuôi Vương Miện Đực",
    price: 200.0,
    image: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Cá Betta Đuôi Vương Miện Vua",
    price: 240.0,
    image: "/placeholder.svg",
  },
];

export function NewProducts() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sản Phẩm Mới</h2>
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-sm text-teal-600 hover:underline"
          >
            Xem Tất Cả
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="border-0 shadow-none">
            <CardContent className="p-0 space-y-2">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 p-2">
                <h3 className="font-medium text-center">{product.name}</h3>
                <p className="text-teal-600 font-semibold text-center">
                  ₹{product.price.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
