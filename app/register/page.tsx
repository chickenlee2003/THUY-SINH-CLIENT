"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import userService from "@/services/userService";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !fullName || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    //validate email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      toast.error("Email không hợp lệ.");
      return;
    }
    // fullname must be at least 3 characters
    if (fullName.length < 3) {
      toast.error("Họ và tên phải có ít nhất 3 ký tự.");
      return;
    }

    try {
      const newUser = {
        email,
        fullName,
        password,
        phoneNumber: phoneNumber || null,
      };
      // Đảm bảo bạn đang đợi kết quả từ API
      const response = await userService.createUser(newUser);
      console.log("User created:", response);
      if (response.status === 200) {
        // Kiểm tra phản hồi từ server
        toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        router.push("/login");
      } else {
        toast.error("Đăng ký không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error( error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Phía trái - Hình ảnh */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
         src="/reg.jpg"
          alt="Aquarium"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Phía phải - Form đăng ký */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <img
              src="/logo.jpg"
              alt="Fish Logo"
              className="h-12 w-12 text-teal-600"
            />
            <h2 className="mt-6 text-3xl font-bold text-teal-600">
              TẠO TÀI KHOẢN
            </h2>
            <p className="mt-2 text-sm text-gray-600">Đăng ký tài khoản mới.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid  gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ và tên
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="kietlt@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <Checkbox id="terms" className="border-gray-300" required />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Tôi đồng ý với{" "}
                  <Link
                    href="/terms"
                    className="text-teal-600 hover:text-teal-500"
                  >
                    Điều khoản và Điều kiện
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                Đăng ký
              </Button>
            </div>
          </form>

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng ký với
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button type="button" variant="outline" className="w-full">
                <img
                  src="/placeholder.svg"
                  alt="Google"
                  className="h-5 w-5 mr-2"
                />
                Tiếp tục với Google
              </Button>
            </div>
          </div> */}

          <p className="mt-4 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
