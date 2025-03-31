import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface CartSummaryProps {
  subtotal: number
  shippingFee: number
  total: number
  voucherCode?: string
  onApplyVoucher: (code: string) => void
}

export function CartSummary({ subtotal, shippingFee, total, voucherCode, onApplyVoucher }: CartSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString()} VNĐ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển</span>
            {/* miễn phí với đơn hàng hơn 1.000.000đ */}
            
            <span>{shippingFee.toLocaleString()} VNĐ</span>

          </div>
          <div>
            <p> Miễn phí  với đơn hàng hơn 1.000.000đ </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Input placeholder="Nhập mã giảm giá" value={voucherCode} onChange={(e) => onApplyVoucher(e.target.value)} />
          <Button variant="outline">Áp dụng</Button>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-medium">
            <span>Tổng cộng</span>
            <span className="text-lg text-teal-600">{total.toLocaleString()}VNĐ</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">(Đã bao gồm VAT nếu có)</p>
        </div>
      </CardContent>
    </Card>
  )
}
