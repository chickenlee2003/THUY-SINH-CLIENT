"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import fishRecognitionService from "@/services/fish-recognition.service";
import { useRouter } from "next/navigation";

interface FishRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string | null;
}

export function FishRecognitionModal({
  isOpen,
  onClose,
  imageData,
}: FishRecognitionModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<"camera" | "upload" | null>(
    null
  );

  useEffect(() => {
    if (!isOpen || !imageData) return;

    // Determine if image is from camera or upload based on data URL format
    // Camera images typically start with "data:image/png" while uploads can be various formats
    setImageSource(
      imageData.startsWith("data:image/png") ? "camera" : "upload"
    );

    const predictFish = async () => {
      setIsLoading(true);
      setResult(null);
      setError(null);

      try {
        const result = await fishRecognitionService.recognizeFish(imageData);

        if (result.prediction) {
          setResult(result.prediction);
        } else if (result.error) {
          setError(result.error);
        } else {
          setError("Không thể nhận diện được loại cá trong ảnh");
        }
      } catch (error) {
        console.error("Error predicting image:", error);
        setError("Có lỗi xảy ra khi xử lý ảnh");
      } finally {
        setIsLoading(false);
      }
    };

    predictFish();
  }, [isOpen, imageData]);

  const handleFindSimilarProducts = () => {
    if (result) {
      router.push(`/search?keyword=${encodeURIComponent(result)}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {imageSource === "upload"
              ? "Nhận diện hình ảnh tải lên"
              : "Kết quả nhận diện"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {/* Image preview */}
          <div className="relative w-full max-h-[300px] overflow-hidden rounded-lg">
            <img
              src={imageData || "/placeholder.svg"}
              alt="Captured"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
              <p className="text-sm text-gray-500">
                Đang phân tích hình ảnh...
              </p>
            </div>
          )}

          {/* Result */}
          {!isLoading && result && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 w-full text-center">
              <h3 className="text-lg font-medium text-teal-800">
                Kết quả nhận diện
              </h3>
              <p className="text-xl font-bold text-teal-600 mt-1">{result}</p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full text-center">
              <h3 className="text-lg font-medium text-red-800">
                Không thể nhận diện
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
            {result && (
              <Button className="flex-1" onClick={handleFindSimilarProducts}>
                Tìm sản phẩm tương tự
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
