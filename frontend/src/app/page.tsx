import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home & Living', icon: '🏠' },
    { name: 'Health & Beauty', icon: '💄' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Groceries', icon: '🍎' },
    { name: 'Toys', icon: '🧸' },
    { name: 'Automotive', icon: '🚗' },
  ];

  const flashSales = [
    { id: 1, name: 'Wireless Earbuds Pro', price: 999, originalPrice: 2599, sold: 85, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' },
    { id: 2, name: 'Smart Watch Series 8', price: 3499, originalPrice: 5999, sold: 92, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80' },
    { id: 3, name: 'Mechanical Keyboard', price: 1290, originalPrice: 2190, sold: 45, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
    { id: 4, name: 'Air Fryer 5L', price: 1590, originalPrice: 2990, sold: 67, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
  ];

  const forYou = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 10,
    name: `Premium Product ${i + 1}`,
    price: Math.floor(Math.random() * 5000) + 100,
    sold: Math.floor(Math.random() * 1000),
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=500&q=80` // Dummy images
  }));

  return (
    <div className="flex flex-col gap-6 pb-12 pt-4">
      {/* Hero Banner */}
      <div className="w-full h-[200px] md:h-[400px] bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl md:rounded-2xl overflow-hidden relative shadow-lg mx-2 md:mx-0">
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-md">Mega Sale 11.11</h1>
          <p className="text-lg md:text-xl mb-6 max-w-md drop-shadow-md">Up to 80% off on all electronics and fashion items. Free shipping across Thailand!</p>
          <Button size="lg" className="w-fit bg-white text-orange-600 hover:bg-gray-100 font-bold">
            Shop Now
          </Button>
        </div>
      </div>

      {/* Categories */}
      <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm mx-2 md:mx-0">
        <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase">Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-orange-50 text-2xl md:text-3xl rounded-2xl group-hover:bg-orange-100 transition-colors shadow-sm border border-orange-100">
                {cat.icon}
              </div>
              <span className="text-xs md:text-sm text-center font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm mx-2 md:mx-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-orange-600 uppercase italic flex items-center gap-2">
              ⚡ Flash Sale
            </h2>
            <div className="hidden md:flex gap-1 items-center font-mono font-bold text-white">
              <span className="bg-black px-2 py-1 rounded">02</span> :
              <span className="bg-black px-2 py-1 rounded">45</span> :
              <span className="bg-black px-2 py-1 rounded">12</span>
            </div>
          </div>
          <Button variant="ghost" className="text-orange-600 font-bold hover:bg-orange-50">See All &gt;</Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashSales.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id} className="block">
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-gray-100 h-full">
                <div className="relative h-40 md:h-48 w-full bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                    -{Math.round((1 - item.price/item.originalPrice)*100)}%
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="text-sm text-gray-700 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-orange-600">฿{item.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">฿{item.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${item.sold}%` }}></div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">{item.sold} sold</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Just For You */}
      <section className="mx-2 md:mx-0">
        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase px-2 bg-orange-600 text-white w-fit py-1 border-b-4 border-orange-800">Just For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {forYou.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id} className="block">
              <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer border border-gray-100 flex flex-col h-full bg-white">
                <div className="relative h-40 md:h-48 w-full bg-gray-100">
                  {/* Fallback pattern for unresolvable unsplash images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex justify-center items-center">
                    <Package className="w-12 h-12 text-slate-300" />
                  </div>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors h-10">{item.name}</h3>
                  <div>
                    <div className="text-lg font-bold text-orange-600 mb-1">฿{item.price.toLocaleString()}</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-orange-400">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-xs text-gray-500">{item.sold} sold</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="w-64 border-orange-600 text-orange-600 hover:bg-orange-50">
            See More
          </Button>
        </div>
      </section>
    </div>
  );
}
