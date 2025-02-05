'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string; // Thêm size vào CartItem
  image: string;
  availableSizes: string[]; // Danh sách kích thước có sẵn
}

const mockCart: CartItem[] = [
  {
    id: '1',
    name: 'Betta Fish Female',
    price: 500.0,
    quantity: 2,
    size: 'Small',
    image: '/placeholder.svg',
    availableSizes: ['Small', 'Medium', 'Large'],
  },
  {
    id: '2',
    name: 'Crown Tail Betta',
    price: 800.0,
    quantity: 1,
    size: 'Medium',
    image: '/placeholder.svg',
    availableSizes: ['Small', 'Medium', 'Large'],
  },
  {
    id: '3',
    name: 'Full Moon Betta Fish',
    price: 600.0,
    quantity: 3,
    size: 'Large',
    image: '/placeholder.svg',
    availableSizes: ['Small', 'Medium', 'Large'],
  },
];

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(mockCart);

  const updateQuantity = (id: string, amount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const updateSize = (id: string, newSize: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, size: newSize } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
      {cart.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="w-32 h-32 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <p className="text-teal-600 font-semibold">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Size:</span>
                    <select
                      value={item.size}
                      onChange={(e) => updateSize(item.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {item.availableSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="rounded-r-none"
                    >
                      -
                    </Button>
                    <div className="w-12 border-y text-center">{item.quantity}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="rounded-l-none"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Total Price</span>
            <span className="text-xl font-bold text-teal-600">₹{totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="flex-1">
              Continue Shopping
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Your cart is empty. Add some products to get started!</p>
      )}
    </div>
  );
}
