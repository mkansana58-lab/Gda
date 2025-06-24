'use client';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function DashboardPage() {
  return (
    <div className="bg-primary text-primary-foreground h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Logo />
                <div>
                    <h1 className="text-2xl font-bold font-headline">गोस्वामी</h1>
                    <h2 className="text-2xl font-light font-headline -mt-2">डिफेंस एकेडमी</h2>
                </div>
            </div>

            {/* Quote */}
            <Card className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg w-full">
            <p className="text-center text-lg font-medium">
                “संघर्ष की ताकत ही आपकी सफलता का निर्धारण करती है।”
            </p>
            </Card>
      </div>
    </div>
  );
}
