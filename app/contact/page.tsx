import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <img
          src="/logo.jpg"
          alt="Cửa hàng thuỷ sinh"
          className="mx-auto h-24 mb-6"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Kết nối với chúng tôi</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-teal-600 shrink-0" />
              <a
                href="mailto:support@kolathurfishmarket.com"
                className="text-gray-600 hover:text-teal-600"
              >
                tuankiet191103@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-teal-600 shrink-0" />
              <a
                href="tel:+917338701314"
                className="text-gray-600 hover:text-teal-600"
              >
                034 930 1982
              </a>
            </div>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-1" />
              <address className="text-gray-600 not-italic">
                180/8D đường 30/4, Hưng lợi, Ninh Kiều, Cần thơ
                <br />
              </address>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-6">Kết nối ngay</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên:</Label>
              <Input id="name" placeholder="Your Name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email"> Email:</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại:</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone Number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Lời nhắn của bạn:</Label>
              <Textarea
                id="message"
                placeholder="Type Your Message Here..."
                className="min-h-[150px]"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              Gửi tin nhắn
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
