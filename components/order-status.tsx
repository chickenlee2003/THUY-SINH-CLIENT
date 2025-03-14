import { CheckCircle, Truck, Package, Clock } from "lucide-react";

interface OrderStatusProps {
  status: string;
  className?: string; // Thêm className props
}

export function OrderStatus({ status, className }: OrderStatusProps) {
  const steps = [
    { key: "PENDING", label: "Đang xử lý", icon: Clock },
    { key: "PROCESSING", label: "Đang chuẩn bị", icon: Package },
    { key: "SHIPPED", label: "Đang giao hàng", icon: Truck },
    { key: "DELIVERED", label: "Đã giao hàng", icon: CheckCircle },
  ];

  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <div className={`flex justify-between ${className || ""}`}>
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = index <= currentStep;
        return (
          <div key={step.key} className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                isActive
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-gray-300 text-gray-300"
              }`}
            >
              <StepIcon
                className="h-5 w-5"
                aria-label={step.label} // Thêm aria-label
              />
            </div>
            <span
              className={`mt-2 text-xs ${
                isActive ? "text-teal-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}