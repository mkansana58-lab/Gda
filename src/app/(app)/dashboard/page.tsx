
'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  FilePen,
  Radio,
  GraduationCap,
  MessageSquare,
  ClipboardCheck,
  Ticket,
  Trophy,
  Contact,
  Video,
  BookMarked,
  Newspaper,
  Scaling,
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const menuItems = [
  { href: '/plan-form', icon: FilePen, label: 'छात्रवृत्ति फॉर्म' },
  { href: '/admit-card', icon: Ticket, label: 'एडमिट कार्ड' },
  { href: '/courses', icon: BookMarked, label: 'हमारे कोर्स' },
  { href: '/live-classes', icon: Radio, label: 'लाइव कक्षाएं' },
  { href: '/posts', icon: Newspaper, label: 'डेली पोस्ट्स' },
  { href: '/ai-test', icon: ClipboardCheck, label: 'AI टेस्ट' },
  { href: '/ai-tutor', icon: GraduationCap, label: 'AI ट्यूटर' },
  { href: '/ai-chat', icon: MessageSquare, label: 'AI चैट' },
  { href: '/current-affairs', icon: Newspaper, label: 'करेंट अफेयर्स' },
  { href: '/cutoff-checker', icon: Scaling, label: 'कट-ऑफ देखें' },
  { href: '/toppers', icon: Trophy, label: 'टॉपर्स' },
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
           <p className="text-center font-signature text-xl sm:text-2xl font-semibold text-primary/90">
             "आपके संघर्ष की ताकत ही आपकी उपलब्धि की सफलता को निर्धारित करती है।"
           </p>
         </CardContent>
       </Card>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href} className="block group">
              <Card className="flex flex-col items-center justify-center bg-card text-card-foreground group-hover:bg-accent group-hover:border-primary/50 transition-all shadow-lg aspect-square rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-2 text-center">
                  <item.icon className="mb-2 h-7 w-7 sm:h-8 sm:w-8 text-primary transition-transform group-hover:scale-110" />
                  <span className="text-xs sm:text-sm font-semibold leading-tight">{item.label}</span>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
