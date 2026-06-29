import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function AdminProductsPage() {
  const products = [
    { id: 'PRD-001', name: 'Premium Wireless Noise-Cancelling Earbuds Pro', price: 2599, stock: 145, category: 'Electronics', status: 'In Stock', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&q=80' },
    { id: 'PRD-002', name: 'Mechanical Keyboard', price: 1290, stock: 45, category: 'Electronics', status: 'Low Stock', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=100&q=80' },
    { id: 'PRD-003', name: 'Smart Watch Series 8', price: 3499, stock: 0, category: 'Electronics', status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80' },
    { id: 'PRD-004', name: 'Running Shoes X-Ultra', price: 1890, stock: 230, category: 'Sports', status: 'In Stock', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80' },
  ];

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-2 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin" className="hover:text-orange-600 flex items-center gap-1"><ArrowLeft className="h-4 w-4"/> Back to Dashboard</Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
      </div>

      <Card className="shadow-sm border-orange-100 overflow-hidden mb-6">
        <div className="h-1 bg-orange-500 w-full"></div>
        <CardHeader className="py-4 border-b bg-gray-50 flex flex-row justify-between items-center">
          <CardTitle className="text-lg">All Products</CardTitle>
          <div className="relative w-64">
            <Input 
              placeholder="Search products..." 
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-white border-b">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded bg-gray-100 overflow-hidden border">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">฿{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : ''}
                        ${product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-gray-50">
            <div>Showing 1 to 4 of 4 entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
