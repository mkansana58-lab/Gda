
'use client';

import { Logo } from '@/components/logo';
import { LoginForm } from '@/components/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  return (
      <div className="w-full max-w-md">
        <Card className="shadow-2xl bg-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              गो स्वामी डिफेंस एकेडमी
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
  );
}
