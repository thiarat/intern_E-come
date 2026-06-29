'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, Package } from 'lucide-react';

export default function CartPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'Wireless Earbuds Pro', price: 999, quantity: 1, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80' },
    { id: 2, name: 'Mechanical Keyboard', price: 1290, quantity: 2, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=200&q=80' },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <Package className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <Card className="hidden md:block shadow-sm">
            <CardContent className="p-4 flex items-center text-sm font-bold text-gray-500 uppercase">
              <div className="flex-1 pl-4">Product</div>
              <div className="w-32 text-center">Price</div>
              <div className="w-32 text-center">Quantity</div>
              <div className="w-32 text-center">Total</div>
              <div className="w-12 text-center">Action</div>
            </CardContent>
          </Card>

          {items.map((item) => (
            <Card key={item.id} className="shadow-sm">
              <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0 border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                </div>
                
                <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                  <div className="w-32 text-center font-medium text-gray-600 md:block hidden">
                    ฿{item.price.toLocaleString()}
                  </div>
                  
                  <div className="w-32 flex items-center justify-center">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="w-10 text-center text-sm font-medium">{item.quantity}</div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-32 text-center font-bold text-orange-600">
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </div>
                  
                  <div className="w-12 flex justify-end md:justify-center">
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="w-full lg:w-80">
          <Card className="shadow-sm sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6 pt-4 border-t">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-orange-600">฿{total.toLocaleString()}</span>
              </div>
              
              <Link href="/checkout" className="w-full">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg shadow-lg">
                  Checkout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
