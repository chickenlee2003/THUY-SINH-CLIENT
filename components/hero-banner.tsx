import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-[url('/banner2.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/90 to-transparent" />
      <div className="relative px-8 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          CÁ CẢNH
        </h1>
        <Button
          asChild
          size="lg"
          className="bg-white text-teal-600 hover:bg-gray-100"
        >
          <Link href="/products/category-parent/1">Mua Ngay</Link>
        </Button> 
      </div>
    </div>
  );
}
