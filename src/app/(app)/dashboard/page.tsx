'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import {
  FilePen,
  BookOpen,
  GraduationCap,
  MessageSquare,
  ClipboardCheck,
  Scaling,
  Trophy,
  Users,
  Contact,
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { href: '/plan-form', icon: FilePen, label: 'छात्रवृत्ति फॉर्म' },
  { href: '/learning-hub', icon: BookOpen, label: 'लर्निंग हब' },
  { href: '/ai-tutor', icon: GraduationCap, label: 'AI ट्यूटर' },
  { href: '/ai-chat', icon: MessageSquare, label: 'AI चैट' },
  { href: '/ai-test', icon: ClipboardCheck, label: 'AI टेस्ट' },
  { href: '/cutoff-checker', icon: Scaling, label: 'कट-ऑफ चेकर' },
  { href: '/toppers', icon: Trophy, label: 'टॉपर्स' },
  { href: '/teachers', icon: Users, label: 'शिक्षक' },
  { href: '/contact', icon: Contact, label: 'संपर्क करें' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full p-4 sm:p-6 bg-background">
      <header className="flex items-center gap-4 mb-6">
        <Logo className="h-14 w-14 p-2.5" />
        <div>
          <h1 className="text-2xl font-headline font-bold tracking-tight text-foreground">गो स्वामी</h1>
          <h2 className="text-2xl font-headline font-bold tracking-tight text-foreground -mt-2">डिफेंस एकेडमी</h2>
        </div>
      </header>

      <Card className="mb-6 bg-card border border-border">
        <CardContent className="p-4 sm:p-6">
          <p className="text-center font-headline text-2xl sm:text-3xl font-semibold text-card-foreground">
            "आपके संघर्ष की ताकत ही आपकी उपलब्धि की सफलता को निर्धारित करती है।"
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="aspect-square flex flex-col items-center justify-center bg-card hover:bg-accent/50 transition-colors shadow-lg border border-border">
              <CardContent className="flex flex-col items-center justify-center p-2 text-center">
                <item.icon className="mb-2 h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                <span className="text-xs sm:text-sm font-semibold leading-tight">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
