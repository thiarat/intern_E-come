'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useRouter } from 'next/navigation';

// Fix leaflet marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
}

export default function CheckoutClient() {
  const router = useRouter();
  const [position, setPosition] = useState<{lat: number, lng: number} | null>({ lat: 13.7563, lng: 100.5018 }); // Default BKK
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'TRANSFER'>('COD');
  
  const total = 3579; // Dummy data

  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
    router.push('/');
  };

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Delivery Address */}
          <Card className="shadow-sm border-orange-100 overflow-hidden">
            <div className="h-1 bg-orange-500 w-full"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                <MapPin className="h-5 w-5" /> Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="081-xxx-xxxx" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Detailed Address</Label>
                  <Input placeholder="House No, Street, Building, etc." />
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label>Pin Location on Map</Label>
                <p className="text-xs text-gray-500 mb-2">Click on the map to pin your exact delivery location.</p>
                <div className="h-[300px] w-full rounded-md overflow-hidden border z-0 relative">
                  <MapContainer center={[13.7563, 100.5018]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                </div>
                {position && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Location pinned: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-300'}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">Cash on Delivery</span>
                    {paymentMethod === 'COD' && <CheckCircle2 className="h-5 w-5 text-orange-500" />}
                  </div>
                  <p className="text-sm text-gray-500">Pay when you receive the order</p>
                </div>
                
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'TRANSFER' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-300'}`}
                  onClick={() => setPaymentMethod('TRANSFER')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">Bank Transfer</span>
                    {paymentMethod === 'TRANSFER' && <CheckCircle2 className="h-5 w-5 text-orange-500" />}
                  </div>
                  <p className="text-sm text-gray-500">Transfer directly to our account</p>
                </div>
              </div>

              {paymentMethod === 'TRANSFER' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-bold mb-2">Bank Account Details</h4>
                  <p className="text-sm">Bank: Kasikorn Bank (KBANK)</p>
                  <p className="text-sm">Account Name: EcomDelivery Co., Ltd.</p>
                  <p className="text-sm font-mono font-bold mt-1">123-4-56789-0</p>
                  
                  <div className="mt-4 space-y-2">
                    <Label>Upload Payment Slip</Label>
                    <Input type="file" accept="image/*" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-80">
          <Card className="shadow-sm sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal (2 items)</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6 pt-4 border-t">
                <span className="font-bold text-gray-800">Total Payment</span>
                <span className="text-2xl font-bold text-orange-600">฿{total.toLocaleString()}</span>
              </div>
              
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg shadow-lg"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
