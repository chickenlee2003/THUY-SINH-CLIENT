import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img
              src="/placeholder.svg"
              alt="Chợ Cá Kolathur"
              className="h-12"
            />
            <p className="text-sm">
              Cửa hàng Thủy sinh chuyên nghiệp trực tuyến. Tại đây bạn có thể
              tìm thấy cá nước mặn, cá nước ngọt, bể cá, thức ăn cho cá, bộ lọc
              bể, trang trí & cây cảnh, v.v.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">LIÊN KẾT HỮU ÍCH</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-white">
                  Điều khoản & Điều kiện
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm hover:text-white">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm hover:text-white">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href="/seller-policy"
                  className="text-sm hover:text-white"
                >
                  Chính sách người bán
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">LIÊN HỆ</h3>
            <div className="space-y-2 text-sm">
              <p>Địa chỉ</p>
              <p>
                180 / 8D hẻm 558 đường 30/4
                <br />
                P. Hưng Lợi, Q. Ninh Kiều, TP.
              </p>
              <p>Điện thoại</p>
              <p>0349301982</p>
              <p>Email</p>
              <p>spsuperprosp@gmail.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">BẢN TIN</h3>
            <p className="text-sm">
              Đăng ký nhận bản tin của chúng tôi để cập nhật thường xuyên về Ưu
              đãi, Phiếu giảm giá & hơn thế nữa
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Địa chỉ Email của bạn"
                className="flex-1 px-3 py-2 bg-gray-800 rounded text-white"
              />
              <Button>Đăng ký</Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">THEO DÕI CHÚNG TÔI</h3>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-center">© 2025 FishShop</p>
        </div>
      </div>
    </footer>
  );
}
