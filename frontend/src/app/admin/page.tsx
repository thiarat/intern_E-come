import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, Users, TrendingUp, AlertCircle, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Sales', value: '฿124,500', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Total Orders', value: '342', icon: ShoppingBag, color: 'text-blue-600' },
    { title: 'Total Products', value: '1,204', icon: Package, color: 'text-orange-600' },
    { title: 'Active Users', value: '89', icon: Users, color: 'text-purple-600' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', total: '฿3,579', status: 'Pending', payment: 'Transfer (Check Slip)' },
    { id: '#ORD-002', customer: 'Jane Smith', total: '฿999', status: 'Shipped', payment: 'COD' },
    { id: '#ORD-003', customer: 'Bob Wilson', total: '฿4,500', status: 'Delivered', payment: 'Transfer (Verified)' },
  ];

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8 px-2">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="space-x-2">
          <Link href="/admin/products">
            <Button variant="outline" className="text-gray-700">Manage Products</Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline" className="text-gray-700">Manage Categories</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 shadow-sm border-orange-100 overflow-hidden">
          <div className="h-1 bg-orange-500 w-full"></div>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                      <td className="px-4 py-3">{order.customer}</td>
                      <td className="px-4 py-3">
                        {order.payment.includes('Check Slip') ? (
                          <span className="flex items-center gap-1 text-red-600 font-medium">
                            <AlertCircle className="h-4 w-4" /> {order.payment}
                          </span>
                        ) : (
                          order.payment
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-800">{order.total}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-orange-600">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200" variant="outline">
              <AlertCircle className="mr-2 h-4 w-4" />
              Verify Payment Slips (12)
            </Button>
            <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Process Pending Orders (8)
            </Button>
            <Link href="/admin/map" className="block w-full">
              <Button className="w-full justify-start bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200" variant="outline">
                <Map className="mr-2 h-4 w-4" />
                Delivery Route Map
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
