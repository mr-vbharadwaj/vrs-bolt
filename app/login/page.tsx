"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to authenticate the user
    // For this example, we'll simulate authentication and role-based redirection
    if (email && password) {
      let role = 'student'; // Default role
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('faculty')) {
        role = 'faculty';
      }

      toast({
        title: "Logged in successfully",
        description: `Welcome back to VRS, ${role}!`,
        duration: 5000,
      });

      // Redirect based on role
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background bg-opacity-50 relative">
      <Image
        src="/vrs-logo.png"
        alt="VRS Logo"
        layout="fill"
        objectFit="cover"
        className="opacity-10"
      />
      <Card className="w-[350px] backdrop-blur-md bg-white bg-opacity-30 shadow-lg">
        <CardHeader>
          <CardTitle>Login to VRS</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/')}>Cancel</Button>
            <Button type="submit">Login</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}