import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function AdminCategoriesPage() {
  const categories = [
    { id: 'CAT-01', name: 'Electronics', productCount: 45, status: 'Active' },
    { id: 'CAT-02', name: 'Fashion & Clothing', productCount: 120, status: 'Active' },
    { id: 'CAT-03', name: 'Home & Living', productCount: 34, status: 'Active' },
    { id: 'CAT-04', name: 'Sports & Outdoors', productCount: 89, status: 'Active' },
    { id: 'CAT-05', name: 'Toys & Hobbies', productCount: 12, status: 'Inactive' },
  ];

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-2 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin" className="hover:text-orange-600 flex items-center gap-1"><ArrowLeft className="h-4 w-4"/> Back to Dashboard</Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-orange-100 overflow-hidden mb-6">
            <div className="h-1 bg-orange-500 w-full"></div>
            <CardHeader className="py-4 border-b bg-gray-50 flex flex-row justify-between items-center">
              <CardTitle className="text-lg">All Categories</CardTitle>
              <div className="relative w-64">
                <Input 
                  placeholder="Search categories..." 
                  className="pl-9 bg-white h-8"
                />
                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-white border-b">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Category Name</th>
                      <th className="px-6 py-4 text-center">Products</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-500">{cat.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center text-orange-600">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-gray-800">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">{cat.productCount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${cat.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          `}>
                            {cat.status}
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
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-sm sticky top-20">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-lg">Quick Add</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category Name</label>
                <Input placeholder="e.g. Beauty & Personal Care" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category Icon/Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors">
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                  <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</span>
                </div>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold mt-2">
                Save Category
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
