import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Star, Share2, Heart, ShieldCheck, Truck, Package } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Mock data for the product based on ID
  const product = {
    id: params.id,
    name: 'Premium Wireless Noise-Cancelling Earbuds Pro',
    price: 2599,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 1245,
    sold: 4500,
    description: 'Experience pure sound with our active noise-cancelling technology. Up to 24 hours of battery life with the charging case. Water-resistant and perfect for workouts.',
    features: [
      'Active Noise Cancellation',
      'Transparency Mode',
      'Spatial Audio',
      'Sweat and Water Resistant',
      'Up to 24 hours of listening time'
    ],
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3eea475ea75?w=800&q=80',
      'https://images.unsplash.com/photo-1572569533941-45bd4c3d317f?w=800&q=80'
    ]
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="py-8 space-y-6">
      <div className="text-sm text-gray-500 mb-4 px-2">
        <Link href="/" className="hover:text-orange-600">Home</Link> &gt; 
        <Link href="#" className="hover:text-orange-600 mx-1">Electronics</Link> &gt; 
        <Link href="#" className="hover:text-orange-600 mx-1">Audio</Link> &gt; 
        <span className="text-gray-800 ml-1">Earbuds</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 md:px-0">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((img, idx) => (
              <div key={idx} className={`relative aspect-square bg-gray-100 rounded-md border-2 overflow-hidden cursor-pointer ${idx === 0 ? 'border-orange-500' : 'border-transparent hover:border-orange-300'}`}>
                <Image src={img} alt={`${product.name} view ${idx+1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center text-orange-500 font-bold">
              <span className="mr-1 border-b border-orange-500">{product.rating}</span>
              <Star className="h-4 w-4 fill-orange-500" />
              <Star className="h-4 w-4 fill-orange-500" />
              <Star className="h-4 w-4 fill-orange-500" />
              <Star className="h-4 w-4 fill-orange-500" />
              <Star className="h-4 w-4 fill-orange-500" />
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="text-gray-600"><span className="border-b border-gray-600 font-medium">{product.reviews.toLocaleString()}</span> Ratings</div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="text-gray-600"><span className="font-medium">{product.sold.toLocaleString()}</span> Sold</div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 line-through text-lg">฿{product.originalPrice.toLocaleString()}</span>
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
            </div>
            <div className="text-4xl font-bold text-orange-600">
              ฿{product.price.toLocaleString()}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-start">
              <span className="w-24 text-gray-500 text-sm mt-1">Shipping</span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-5 w-5 text-gray-500" />
                  <span>Free Shipping within Thailand</span>
                </div>
                <div className="text-sm text-gray-500 ml-7">Estimated delivery: 2-3 business days</div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <span className="w-24 text-gray-500 text-sm">Quantity</span>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="sm" className="rounded-none h-8 w-8 px-0 text-lg">-</Button>
                <div className="w-12 text-center text-sm">1</div>
                <Button variant="ghost" size="sm" className="rounded-none h-8 w-8 px-0 text-lg">+</Button>
              </div>
              <span className="text-gray-500 text-sm">145 pieces available</span>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <Button variant="outline" className="flex-1 bg-orange-50 border-orange-600 text-orange-600 hover:bg-orange-100 hover:text-orange-700 h-12 text-base font-medium">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add To Cart
            </Button>
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-bold">
              Buy Now
            </Button>
          </div>
          
          <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100 justify-center text-gray-600">
            <button className="flex items-center gap-2 text-sm hover:text-orange-600"><Share2 className="h-4 w-4" /> Share</button>
            <button className="flex items-center gap-2 text-sm hover:text-orange-600"><Heart className="h-4 w-4" /> Favorite (1.2k)</button>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 px-2 md:px-0">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-none">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold bg-gray-50 p-3 rounded-md mb-4 uppercase">Product Description</h2>
              <div className="prose max-w-none text-gray-700 text-sm leading-relaxed">
                <p>{product.description}</p>
                <h3 className="font-bold mt-4 mb-2 text-gray-900">Key Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-sm border-none bg-orange-50/50">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" /> Buyer Protection
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <div className="font-bold text-gray-800">100% Authentic</div>
                  or get double your money back
                </li>
                <li className="flex gap-2">
                  <div className="font-bold text-gray-800">15 Days Return</div>
                  change of mind applicable
                </li>
                <li className="flex gap-2">
                  <div className="font-bold text-gray-800">Free Shipping</div>
                  on orders over ฿500
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
