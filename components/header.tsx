"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  Clock,
  LifeBuoy,
  LogOut,
  SquareUserRound,
  Camera,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { CameraInterface } from "@/components/camera-interface";
import { FishRecognitionModal } from "@/components/fish-recognition-modal";
import productService from "@/services/product.service";

// Define the product interface
interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productDescription: string;
  productQuantity: number;
  productStatus: string;
  images: Array<{
    imageId: number;
    imageUrl: string;
  }>;
}

export function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [showCamera, setShowCamera] = useState(false);
  const [showRecognitionModal, setShowRecognitionModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatar(localStorage.getItem("avatar"));
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchProducts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle click outside search results to close them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search products using the API
  const searchProducts = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await productService.searchProducts(query);
      if (response.data) {
        setSearchResults(response.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  // Handle navigation to product detail
  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  const handleImageCapture = async (imageData: string) => {
    setShowCamera(false);
    setCapturedImage(imageData);
    setShowRecognitionModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
        setShowRecognitionModal(true);
      }
    };
    reader.readAsDataURL(file);

    // Clear the input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCloseRecognitionModal = () => {
    setShowRecognitionModal(false);
    setCapturedImage(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <>
      <header>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.jpg" alt="Cửa hàng thuỷ sinh" className="h-12" />
            </Link>

            {/* Search Bar */}
            <div
              className="flex-1 max-w-2xl flex items-center gap-2"
              ref={searchRef}
            >
              <div className="relative flex-1">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Tìm kiếm ..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() =>
                        searchQuery.trim() &&
                        searchResults.length > 0 &&
                        setShowResults(true)
                      }
                    />
                    {/* {searchQuery && (
                      <button 
                        type="button" 
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )} */}
                    <button
                      type="submit"
                      className="mr-7  absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b">
                      <span className="text-sm text-gray-500">
                        Kết quả tìm kiếm cho &quot;{searchQuery}&quot;
                      </span>
                    </div>
                    <ul>
                      {searchResults.map((product) => (
                        <li
                          key={product.productId}
                          className="border-b last:border-0"
                        >
                          <button
                            className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-50 transition-colors"
                            onClick={() =>
                              handleProductClick(product.productId)
                            }
                          >
                            <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                              {product.images && product.images.length > 0 && (
                                <img
                                  src={product.images[0].imageUrl}
                                  alt={product.productName}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium line-clamp-1">
                                {product.productName}
                              </h4>
                              <p className="text-sm text-teal-600">
                                {product.productPrice.toLocaleString("vi-VN")}{" "}
                                VNĐ
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 border-t bg-gray-50">
                      <Link
                        href={`/search?keyword=${encodeURIComponent(
                          searchQuery
                        )}`}
                        className="text-sm text-teal-600 hover:text-teal-700 block text-center"
                        onClick={() => setShowResults(false)}
                      >
                        Xem tất cả kết quả
                      </Link>
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {showResults &&
                  searchQuery.trim() &&
                  searchResults.length === 0 &&
                  !isLoading && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 p-4 text-center">
                      <p className="text-gray-500">
                        Không tìm thấy sản phẩm nào phù hợp
                      </p>
                    </div>
                  )}

                {/* Loading State */}
                {isLoading && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 p-4 text-center">
                    <p className="text-gray-500">Đang tìm kiếm...</p>
                  </div>
                )}
              </div>

              {/* Camera and Upload buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full flex-shrink-0 border-teal-600 text-teal-600 hover:bg-teal-50"
                  onClick={() => setShowCamera(true)}
                  title="Nhận diện cá bằng camera"
                >
                  <Camera className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full flex-shrink-0 border-teal-600 text-teal-600 hover:bg-teal-50"
                  onClick={triggerFileInput}
                  title="Tải lên hình ảnh để nhận diện cá"
                >
                  <Upload className="h-5 w-5" />
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {/* User, Wishlist, and Cart */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Wishlist Button */}
                  {/* <Link href="/wishlist" className="hover:text-teal-600">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Danh sách yêu thích</span>
                    </Button>
                  </Link> */}

                  {/* Avatar Dropdown */}
                  <div className="relative group z-50">
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar>
                        <AvatarImage
                          src={avatar || "/avatardf.png"}
                          alt="User Avatar"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block">
                        <p className="text-sm font-medium">Người dùng</p>
                      </div>
                    </div>
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="bg-white rounded-lg shadow-lg border w-56 py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <SquareUserRound className="w-4 h-4" />
                          Thông tin cá nhân
                        </Link>
                        <Link
                          href="/purchase-history"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <Clock className="w-4 h-4" />
                          Lịch sử mua hàng
                        </Link>

                        <Link
                          href="/support-page"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <LifeBuoy className="w-4 h-4" />
                          Hỗ trợ
                        </Link>
                        <div className="border-t my-2" />
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                          onClick={logout}
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="hover:text-teal-600">
                    Đăng nhập
                  </Link>
                  <span>/</span>
                  <Link href="/register" className="hover:text-teal-600">
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Shopping Cart */}
              <Link href="/cart">
                <Button variant="outline" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Giỏ hàng</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-teal-600 text-white">
          <div className="container mx-auto px-4">
            <ul className="flex items-center">
              <li>
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-teal-700"
                  >
                    Trang chủ
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-teal-700"
                  >
                    Danh mục
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/products/category-parent/1">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-teal-700"
                  >
                    Cá cảnh
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/products/category-parent/2">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-teal-700"
                  >
                    Phụ kiện thuỷ sinh
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Camera Interface */}
      {showCamera && (
        <CameraInterface
          onCapture={handleImageCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Fish Recognition Modal */}
      <FishRecognitionModal
        isOpen={showRecognitionModal}
        onClose={handleCloseRecognitionModal}
        imageData={capturedImage}
      />
    </>
  );
}
