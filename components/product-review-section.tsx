"use client"

import { useState, useEffect } from "react"
import { Star, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-toastify"
import { formatDate } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import reviewService from "@/services/review.service"
import type { ReviewResponse, ReviewSubmitData } from "@/types/backend"

interface ProductReviewSectionProps {
  productId: number;
  initialReviews?: ReviewResponse[];
}

export function ProductReviewSection({ productId, initialReviews = [] }: ProductReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>(initialReviews);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 8;

  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Get current reviews for pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);
      try {
        console.log("Fetching reviews for product ID:", productId);
        const reviewsData = await reviewService.getProductReviews(productId);
        console.log("Reviews data received:", reviewsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Không thể tải đánh giá sản phẩm. Vui lòng thử lại sau.");
        // Initialize with empty array if API fails
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (initialReviews.length === 0) {
      fetchReviews();
    } else {
      console.log("Using initial reviews:", initialReviews);
      setReviews(initialReviews);
      setIsLoading(false);
    }
  }, [productId, initialReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }

    if (userRating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (comment.trim() === "") {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = Number(localStorage.getItem("id"));
      
      const reviewData: ReviewSubmitData = {
        userId,
        productId,
        rating: userRating,
        comment
      };

      const newReview = await reviewService.createReview(reviewData);
      
      // Add the new review to the list
      setReviews([newReview, ...reviews]);
      
      // Reset to page 1 to show the new review
      setCurrentPage(1);

      // Reset form
      setUserRating(0);
      setComment("");

      toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
    } catch {
      toast.error("Không thể gửi đánh giá. Chỉ những người đã mua sản phẩm mới có thể đánh giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format review count display
  const formatReviewCount = (count: number): string => {
    if (count === 0) return "Chưa có đánh giá";
    return `${count} ${count === 1 ? 'đánh giá' : 'đánh giá'}`;
  };

  // Render pagination controls
  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={number === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => paginate(number)}
              className={number === currentPage ? "bg-teal-600" : ""}
            >
              {number}
            </Button>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Đánh giá & Nhận xét</h2>
        <span className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
          <span className="mx-1">|</span>
          <span>{formatReviewCount(reviews.length)}</span>
        </span>
      </div>

      {/* Rating summary */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="bg-gray-50 p-6 rounded-lg text-center md:w-64">
          <div className="text-5xl font-bold text-teal-600 mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 flex justify-center items-center gap-1">
            <div className="flex items-center">
              <span className="font-medium">{formatReviewCount(reviews.length)}</span>
            </div>
          </div>
        </div>

        {/* Review form */}
        {isAuthenticated ? (
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-4">Viết đánh giá của bạn</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Đánh giá của bạn</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoverRating || userRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-2">
                  Nhận xét của bạn
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Viết đánh giá của bạn</h3>
            <p className="text-gray-500 mb-4">Bạn cần đăng nhập để đánh giá sản phẩm này</p>
            <Button asChild>
              <a href="/login">Đăng nhập</a>
            </Button>
          </div>
        )}
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tất cả đánh giá</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {formatReviewCount(reviews.length)}
            </span>
            {reviews.length > 0 && (
              <span className="text-sm text-gray-500">
                Trang {currentPage} / {totalPages}
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải đánh giá...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
            <p className="text-sm mt-2">Hãy là người đầu tiên đánh giá sản phẩm!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentReviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    {review?.user?.avatar ? (
                      <AvatarImage src={review.user.avatar} alt={review.user.name || 'User'} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium">{review?.user?.name || 'Anonymous User'}</h4>
                      <span className="text-sm text-gray-500">
                        {review.createdAt ? formatDate(new Date(review.createdAt)) : ""}
                      </span>
                    </div>

                    <div className="flex my-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    
                    {review.adminReply && (
                      <div className="mt-4 pl-4 border-l-2 border-teal-500">
                        <p className="text-sm font-medium">Phản hồi từ cửa hàng:</p>
                        <p className="mt-1 text-gray-700">{review.adminReply}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {renderPaginationControls()}
          </div>
        )}
      </div>
    </div>
  )
}
