"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-teal-600">Điều khoản và Điều kiện</h1>
            {/* <p className="text-gray-500 mt-2">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p> */}
          </div>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Điều khoản sử dụng</h2>
                <p className="text-gray-600">
                  Bằng việc truy cập và sử dụng website của Fish Market, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện được quy định dưới đây.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Đăng ký tài khoản</h2>
                <div className="space-y-3 text-gray-600">
                  <p>Khi đăng ký tài khoản, bạn đồng ý:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                    <li>Bảo mật thông tin tài khoản của mình</li>
                    <li>Chịu trách nhiệm về mọi hoạt động dưới tài khoản của mình</li>
                    <li>Thông báo ngay cho chúng tôi về bất kỳ truy cập trái phép nào</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Quyền riêng tư và bảo mật</h2>
                <div className="space-y-3 text-gray-600">
                  <p>Chúng tôi cam kết:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Bảo vệ thông tin cá nhân của người dùng</li>
                    <li>Không chia sẻ thông tin với bên thứ ba khi chưa được sự đồng ý</li>
                    <li>Áp dụng các biện pháp bảo mật phù hợp</li>
                    <li>Tuân thủ các quy định về bảo vệ dữ liệu</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Sử dụng dịch vụ</h2>
                <div className="space-y-3 text-gray-600">
                  <p>Khi sử dụng dịch vụ, bạn không được:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Vi phạm pháp luật hoặc quyền của người khác</li>
                    <li>Gửi thông tin sai lệch hoặc gây hiểu nhầm</li>
                    <li>Tải lên hoặc truyền bá mã độc</li>
                    <li>Gây rối hoặc phá hoại hệ thống</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Thanh toán và giao dịch</h2>
                <div className="space-y-3 text-gray-600">
                  <p>Đối với các giao dịch trên platform:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Đảm bảo thông tin thanh toán chính xác</li>
                    <li>Tuân thủ các quy định về giao dịch trực tuyến</li>
                    <li>Chấp nhận các điều khoản về hoàn trả và hủy đơn</li>
                    <li>Đồng ý với chính sách giá và phí dịch vụ</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Chấm dứt dịch vụ</h2>
                <p className="text-gray-600">
                  Chúng tôi có quyền chấm dứt hoặc đình chỉ tài khoản của bạn nếu vi phạm các điều khoản sử dụng hoặc có hành vi gây hại đến hệ thống.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Thay đổi điều khoản</h2>
                <p className="text-gray-600">
                  Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
                </p>
              </section>
            </div>
          </ScrollArea>

          <div className="flex justify-center space-x-4 pt-4">
            {/* <Button asChild variant="outline">
              <Link href="/">
                Quay lại trang chủ
              </Link>
            </Button> */}
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/">
                Trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 