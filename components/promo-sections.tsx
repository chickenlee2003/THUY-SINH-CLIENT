import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromoSections() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative overflow-hidden rounded-lg bg-[url('/dichvubaotrijpg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            DỊCH VỤ BẢO TRÌ
          </h2>
          <Button
            asChild
            variant="outline"
            className="bg-white/10 text-white border-white hover:bg-white/20"
          >
            {/* <Link href="/services/maintenance">Đặt ngay</Link> */}
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-[url('/beca.jfif')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative p-8">
          <h2 className="text-3xl font-bold text-white mb-4">HỒ CÁ</h2>
          <Button
            asChild
            variant="outline"
            className="bg-white/10 text-white border-white hover:bg-white/20"
          >
            {/* <Link href="/services/aquascaping">Đặt ngay</Link> */}
          </Button>
        </div>
      </div>
    </div>
  );
}
