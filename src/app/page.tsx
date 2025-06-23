'use client';

import { Logo } from '@/components/logo';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-3xl font-bold tracking-tight text-primary">
              Go Swami Defence Academy
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2 font-semibold">
              "राष्ट्र प्रथम, शिक्षा सर्वोपरि"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
