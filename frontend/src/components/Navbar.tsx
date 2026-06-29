import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-orange-600" />
            <span className="text-xl font-bold text-orange-600 hidden sm:inline-block">EcomDelivery</span>
          </Link>
        </div>

        <div className="flex-1 max-w-2xl px-4 hidden md:flex">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search for products, brands and shops"
              className="w-full bg-slate-100 border-none rounded-full pl-4 pr-10 focus-visible:ring-orange-500"
            />
            <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full rounded-r-full text-gray-500 hover:text-orange-600 hover:bg-transparent">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-orange-600 hover:bg-orange-50">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                3
              </span>
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-700 hover:text-orange-600 hover:bg-orange-50">
              My Orders
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-700 hover:text-orange-600 hover:bg-orange-50">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="hidden sm:flex bg-orange-600 hover:bg-orange-700 text-white">
              Sign Up
            </Button>
          </Link>
          <Link href="/profile" className="sm:hidden">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
              <User className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full bg-slate-100 border-none rounded-full pl-4 pr-10 focus-visible:ring-orange-500"
          />
          <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full rounded-r-full text-gray-500 hover:text-orange-600 hover:bg-transparent">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
