'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockPurchaseHistory = [
  {
    id: '1001',
    date: '2024-01-01',
    status: 'Delivered',
    total: 5000,
    coupon: { code: 'NEWYEAR2024', discount: 500 }, // Mã giảm giá
    items: [
      { name: 'Betta Fish Female', price: 1000, quantity: 2 },
      { name: 'Crown Tail Betta', price: 3000, quantity: 1 },
    ],
  },
  {
    id: '1002',
    date: '2024-01-15',
    status: 'Processing',
    total: 2000,
    coupon: null, // Không có mã giảm giá
    items: [
      { name: 'Aquarium Tank', price: 2000, quantity: 1 },
    ],
  },
  {
    id: '1003',
    date: '2024-02-01',
    status: 'Cancelled',
    total: 3000,
    coupon: { code: 'FISHFRENZY', discount: 300 }, // Mã giảm giá
    items: [
      { name: 'Full Moon Betta', price: 3000, quantity: 1 },
    ],
  },
];

export default function PurchaseHistoryPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Lọc danh sách đơn hàng theo trạng thái
  const filteredOrders = filterStatus
    ? mockPurchaseHistory.filter((order) => order.status === filterStatus)
    : mockPurchaseHistory;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>

      {/* Bộ lọc trạng thái */}
      <div className="mb-6 flex gap-4">
        {['All', 'Delivered', 'Processing', 'Cancelled'].map((status) => (
          <Button
            key={status}
            variant={filterStatus === (status === 'All' ? null : status) ? 'default' : 'outline'}
            onClick={() =>
              setFilterStatus(status === 'All' ? null : status)
            }
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-600">No orders found for this status.</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 shadow-sm">
              {/* Order Summary */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">Date: {order.date}</p>
                  <p className="text-sm text-gray-500">Status: {order.status}</p>
                  {order.coupon && (
                    <p className="text-sm text-teal-600">
                      Coupon Applied: {order.coupon.code} (₹{order.coupon.discount.toLocaleString()} off)
                    </p>
                  )}
                </div>
                <div className="text-teal-600 font-bold">
                  ₹{(order.total - (order.coupon?.discount || 0)).toLocaleString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrder === order.id ? (
                    <>
                      Hide Details <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View Details <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {/* Order Details */}
              {expandedOrder === order.id && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <p>{item.name}</p>
                      <div className="flex items-center gap-4">
                        <p>
                          ₹{item.price.toLocaleString()} x {item.quantity}
                        </p>
                        <p className="font-bold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Tổng giá và giảm giá */}
                  <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{order.total.toLocaleString()}</span>
                  </div>
                  {order.coupon && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Coupon Discount</span>
                      <span className="text-teal-600">-₹{order.coupon.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>₹{(order.total - (order.coupon?.discount || 0)).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
