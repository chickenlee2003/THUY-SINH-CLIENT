"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-teal-600">Chính sách giao hàng</h1>
          </div>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Thời gian giao hàng</h2>
                <p className="text-gray-600">
                  Chúng tôi cam kết giao hàng trong vòng 3 ngày làm việc kể từ khi nhận được đơn hàng.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Phí giao hàng</h2>
                <div className="space-y-3 text-gray-600">
                  <p>Phí giao hàng là 35.000đ cho đơn hàng dưới 1.000.000đ và miễn phí cho đơn hàng trên  1.000.000đ.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Địa chỉ giao hàng</h2>
                <div className="space-y-3 text-gray-600">
                  <p>Chúng tôi hỗ trợ giao hàng toàn quốc. Vui lòng kiểm tra lại thông tin địa chỉ trước khi xác nhận đơn hàng để đảm bảo giao hàng chính xác.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Đóng gói sản phẩm</h2>
                <p className="text-gray-600">
                  Mọi sản phẩm sẽ được đóng gói cẩn thận để đảm bảo an toàn trong suốt quá trình vận chuyển. Chúng tôi đảm bảo rằng các sản phẩm thủy sinh của bạn sẽ được bảo vệ một cách tốt nhất.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Theo dõi đơn hàng</h2>
                <p className="text-gray-600">
                  Sau khi đơn hàng được xử lý, bạn sẽ nhận được mã vận đơn để theo dõi quá trình giao hàng của mình. Nếu có bất kỳ sự cố nào trong quá trình vận chuyển, vui lòng liên hệ với chúng tôi ngay.
                </p>
              </section>
            </div>
          </ScrollArea>

          <div className="flex justify-center space-x-4 pt-4">
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/">
                Quay lại trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
