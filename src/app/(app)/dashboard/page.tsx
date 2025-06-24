'use client';
import { Card, CardContent } from '@/components/ui/card';
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
import { Logo } from '@/components/logo';

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
    <div className="p-4 sm:p-6 space-y-6">
      <header className="flex items-center gap-4 text-foreground">
        <Logo className="h-12 w-12 bg-card text-primary" />
        <div>
          <h1 className="text-xl font-bold font-headline leading-none">Goswami</h1>
          <h2 className="text-xl font-bold font-headline leading-none">Defence Academy</h2>
        </div>
      </header>

       <Card className="bg-card text-card-foreground shadow-lg rounded-2xl">
         <CardContent className="p-4 sm:p-6">
           <p className="text-center font-headline text-xl sm:text-2xl font-semibold">
             "आपके संघर्ष की ताकत ही आपकी उपलब्धि की सफलता को निर्धारित करती है।"
           </p>
         </CardContent>
       </Card>

      <div className="grid grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href} className="block">
              <Card className="flex flex-col items-center justify-center bg-card text-card-foreground hover:bg-accent transition-colors shadow-lg aspect-square rounded-2xl">
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
