"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, HelpCircle, Truck, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      
      // Show success message
      setSubmitStatus({
        type: "success",
        message: "Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Hỗ trợ khách hàng</h1>
      <p className="text-gray-500 mb-8">Chúng tôi luôn sẵn sàng hỗ trợ bạn với mọi thắc mắc về sản phẩm và dịch vụ</p>
      {/* md:grid-cols-2 */}
      <div className="grid gap-8 ">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-teal-500" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-teal-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:support@fishmarket.com" className="text-teal-600 hover:underline">
                    spsuperprosp@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-teal-500" />
                <div>
                  <p className="font-medium">Hotline</p>
                  <a href="tel:1900123456" className="text-teal-600 hover:underline">
                    0349301982
                  </a>
                  <p className="text-sm text-gray-500">Hỗ trợ: 10:00 - 19:00 (Thứ 2 - Chủ nhật)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-teal-500" />
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <p>180/8D, Hưng Lợi, Ninh Kiều, Cần Thơ</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-teal-500" />
                Câu hỏi thường gặp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-teal-500" />
                  Chính sách giao hàng
                </h3>
                <p className="text-gray-600 mt-1">
                   Chúng tôi vận chuyển cá toàn quốc với phí 30.000đ . Cá được đóng gói cẩn thận với túi oxy đảm bảo an toàn. Thời gian giao hàng từ 1-3 ngày tùy khu vực.
                </p>
              </div>
              
              <Separator />

              
              <Separator />
              
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-teal-500" />
                  Chính sách đổi trả
                </h3>
                <p className="text-gray-600 mt-1">
                  Chúng tôi hỗ trợ đổi trả trong vòng 2 giờ sau khi nhận hàng nếu sản phẩm 
                  không đảm bảo chất lượng hoặc không đúng với mô tả.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-teal-500" />
                Gửi tin nhắn cho chúng tôi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitStatus.type && (
                <div 
                  className={`mb-4 p-3 rounded-md ${
                    submitStatus.type === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Nhập số điện thoại của bạn"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung tin nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Nhập nội dung tin nhắn của bạn"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}