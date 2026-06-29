import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin, Settings, Bell, Shield, LogOut } from 'lucide-react';

export default function UserProfilePage() {
  return (
    <div className="py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-orange-50 p-4 rounded-lg mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
              JD
            </div>
            <div>
              <div className="font-bold text-gray-800">John Doe</div>
              <div className="text-xs text-gray-500">Silver Member</div>
            </div>
          </div>
          
          <nav className="flex flex-col space-y-1">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-md bg-orange-100 text-orange-700 font-medium">
              <User className="h-5 w-5" /> Profile Settings
            </Link>
            <Link href="/profile/addresses" className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
              <MapPin className="h-5 w-5" /> Address Book
            </Link>
            <Link href="/profile/notifications" className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" /> Notifications
            </Link>
            <Link href="/profile/security" className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
              <Shield className="h-5 w-5" /> Account Security
            </Link>
            <Link href="/profile/preferences" className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
              <Settings className="h-5 w-5" /> Preferences
            </Link>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-5 w-5 mr-3" /> Logout
              </Button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card className="shadow-sm border-orange-100 overflow-hidden">
            <div className="h-1 bg-orange-500 w-full"></div>
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" disabled />
                  <p className="text-xs text-gray-500">Email cannot be changed.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="081-234-5678" />
                </div>
                <div className="space-y-2 md:col-span-2 flex justify-end pt-4 border-t">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8">
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-lg">Default Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-bold text-gray-800">John Doe <span className="text-sm font-normal text-gray-500 ml-2">(081-234-5678)</span></div>
                  <div className="text-sm text-gray-600">123/45 Sukhumvit Road, Khlong Toei Nuea</div>
                  <div className="text-sm text-gray-600">Watthana, Bangkok 10110</div>
                  <div className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-xs font-medium text-gray-600 rounded">Home</div>
                </div>
                <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
