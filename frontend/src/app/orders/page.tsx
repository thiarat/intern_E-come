import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

export default function MyOrdersPage() {
  const orders = [
    {
      id: '#ORD-003',
      date: '2023-11-15',
      status: 'Delivered',
      total: 4500,
      items: [
        { name: 'Mechanical Keyboard', qty: 1, price: 1290, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=200&q=80' },
        { name: 'Wireless Mouse', qty: 1, price: 3210, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80' }
      ]
    },
    {
      id: '#ORD-004',
      date: '2023-11-20',
      status: 'In Transit',
      total: 2599,
      items: [
        { name: 'Premium Wireless Noise-Cancelling Earbuds Pro', qty: 1, price: 2599, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80' }
      ]
    },
    {
      id: '#ORD-005',
      date: '2023-11-22',
      status: 'Pending',
      total: 999,
      items: [
        { name: 'Smart Band', qty: 1, price: 999, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=200&q=80' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-50';
      case 'In Transit': return 'text-blue-600 bg-blue-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 className="h-5 w-5" />;
      case 'In Transit': return <Truck className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="py-8 min-h-[70vh]">
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="shadow-sm border-gray-200 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b py-3 px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex gap-4 items-center">
                  <span className="font-bold text-gray-800">{order.id}</span>
                  <span className="text-sm text-gray-500">Placed on {order.date}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0 border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-medium text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                      <div className="text-sm text-gray-500 mb-2">Quantity: {item.qty}</div>
                    </div>
                    <div className="font-bold text-gray-800 text-lg whitespace-nowrap">
                      ฿{item.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-orange-50/30 p-6 flex flex-col sm:flex-row justify-between items-center border-t gap-4">
                <div className="text-gray-600">
                  Total Order Amount: <span className="text-2xl font-bold text-orange-600 ml-2">฿{order.total.toLocaleString()}</span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  {order.status === 'Delivered' && (
                    <Button variant="outline" className="flex-1 sm:flex-none border-orange-600 text-orange-600 hover:bg-orange-50">
                      Buy Again
                    </Button>
                  )}
                  {order.status === 'In Transit' && (
                    <Button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" /> Track Driver
                    </Button>
                  )}
                  <Button variant="ghost" className="flex-1 sm:flex-none text-gray-600 hover:text-orange-600 flex items-center gap-1">
                    Order Details <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Just an inline icon component to avoid needing another import up top for map pin
function MapPinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
