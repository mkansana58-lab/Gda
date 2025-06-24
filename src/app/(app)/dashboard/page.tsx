
'use client';
import {
  Bookmark,
  BookOpen,
  MessageSquare,
  Bot,
  FlaskConical,
  TrendingUp,
  Star,
  Users,
  Settings,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useUser } from '@/context/user-context';
import { Logo } from '@/components/logo';

const features = [
  { title: 'छात्रवृत्ति', icon: Bookmark, href: '/plan-form' },
  { title: 'लर्निंग हब', icon: BookOpen, href: '/learning-hub' },
  { title: 'AI ट्यूटर', icon: MessageSquare, href: '/ai-tutor' },
  { title: 'AI चैट', icon: Bot, href: '/ai-chat' },
  { title: 'AI टेस्ट', icon: FlaskConical, href: '/ai-test' },
  { title: 'कट-ऑफ', icon: TrendingUp, href: '/cutoff-checker' },
  { title: 'टॉपर्स', icon: Star, href: '/toppers' },
  { title: 'शिक्षक', icon: Users, href: '/teachers' },
  { title: 'सेटिंग्स', icon: Settings, href: '#' },
];

export default function DashboardPage() {
  const { setProfileDialogOpen } = useUser();

  return (
    <div className="bg-primary text-primary-foreground min-h-screen">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-2xl font-bold font-headline">गोस्वामी</h1>
            <h2 className="text-2xl font-light font-headline -mt-2">डिफेंस एकेडमी</h2>
          </div>
        </div>

        {/* Quote */}
        <Card className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg">
          <p className="text-center text-lg font-medium">
            “संघर्ष की ताकत ही आपकी सफलता का निर्धारण करती है।”
          </p>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const isSettings = feature.title === 'सेटिंग्स';
            
            const content = (
              <Card className="bg-card text-primary aspect-square flex flex-col items-center justify-center text-center p-1 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer shadow-md">
                <feature.icon className="w-7 h-7 mb-2" />
                <h3 className="text-xs font-semibold leading-tight text-center">{feature.title}</h3>
              </Card>
            );

            if (isSettings) {
              return (
                <div key={index} onClick={() => setProfileDialogOpen(true)}>
                  {content}
                </div>
              );
            }

            return (
              <Link href={feature.href} key={index}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

    