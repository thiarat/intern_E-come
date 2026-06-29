'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, Navigation, Clock, Truck } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const storeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3203/3203061.png', // Just a placeholder icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function MapClient() {
  const storeLocation = { lat: 13.7563, lng: 100.5018 };
  
  // Dummy data for delivery routes
  const deliveries = [
    { id: '#ORD-001', customer: 'John Doe', lat: 13.7663, lng: 100.5118, status: 'Pending', distance: '2.5 km', time: '10 mins' },
    { id: '#ORD-004', customer: 'Alice Wong', lat: 13.7463, lng: 100.4918, status: 'In Transit', distance: '1.8 km', time: '8 mins' },
    { id: '#ORD-005', customer: 'Tom Hardy', lat: 13.7763, lng: 100.5318, status: 'Pending', distance: '4.2 km', time: '15 mins' },
  ];

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Map className="h-6 w-6 text-orange-600" /> Delivery Route Optimization
        </h1>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">Optimize All Routes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 shadow-sm h-[600px] flex flex-col">
          <CardHeader className="py-4 border-b">
            <CardTitle className="text-lg">Live Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative z-0">
            <MapContainer center={[13.7563, 100.5018]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Store */}
              <Marker position={storeLocation} icon={customIcon}>
                <Popup>
                  <strong>Main Hub (Store)</strong>
                </Popup>
              </Marker>

              {/* Deliveries */}
              {deliveries.map((delivery) => (
                <Marker key={delivery.id} position={{ lat: delivery.lat, lng: delivery.lng }} icon={customIcon}>
                  <Popup>
                    <strong>{delivery.id}</strong><br/>
                    {delivery.customer}<br/>
                    Status: {delivery.status}
                  </Popup>
                </Marker>
              ))}

              {/* Draw lines from store to deliveries for visualization */}
              {deliveries.map((delivery) => (
                <Polyline 
                  key={`line-${delivery.id}`} 
                  positions={[
                    [storeLocation.lat, storeLocation.lng],
                    [delivery.lat, delivery.lng]
                  ]} 
                  color={delivery.status === 'In Transit' ? 'blue' : 'orange'} 
                  weight={3}
                  dashArray="5, 10"
                />
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deliveries.map((d) => (
              <div key={d.id} className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800">{d.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">{d.customer}</div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Navigation className="h-4 w-4" /> {d.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {d.time}
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">View Order</Button>
                  {d.status === 'Pending' && (
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      <Truck className="h-3 w-3 mr-1" /> Dispatch
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
