import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-xl border-orange-100">
        <CardHeader className="space-y-1 bg-orange-50 rounded-t-xl border-b border-orange-100 mb-4 text-center">
          <CardTitle className="text-2xl font-bold text-orange-600">Login to EcomDelivery</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" className="focus-visible:ring-orange-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-orange-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" className="focus-visible:ring-orange-500" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6">Login</Button>
          <div className="text-sm text-center text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-orange-600 hover:underline font-bold">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
