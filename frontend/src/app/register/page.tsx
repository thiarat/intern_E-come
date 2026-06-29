import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-xl border-orange-100">
        <CardHeader className="space-y-1 bg-orange-50 rounded-t-xl border-b border-orange-100 mb-4 text-center">
          <CardTitle className="text-2xl font-bold text-orange-600">Create an Account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" className="focus-visible:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" className="focus-visible:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="focus-visible:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" className="focus-visible:ring-orange-500" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6">Sign Up</Button>
          <div className="text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 hover:underline font-bold">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
