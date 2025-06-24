'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  FilePen,
  ClipboardCheck,
  GraduationCap,
  MessageSquare,
  Scaling,
  Trophy,
  Users,
  Phone,
  BookOpen,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const menuItems = [
  { href: '/plan-form', icon: FilePen, label: 'छात्रवृत्ति' },
  { href: '/learning-hub', icon: BookOpen, label: 'लर्निंग हब' },
  { href: '/ai-tutor', icon: GraduationCap, label: 'AI ट्यूटर' },
  { href: '/ai-chat', icon: MessageSquare, label: 'AI चैट' },
  { href: '/ai-test', icon: ClipboardCheck, label: 'AI टेस्ट' },
  { href: '/cutoff-checker', icon: Scaling, label: 'कट-ऑफ' },
  { href: '/toppers', icon: Trophy, label: 'टॉपर्स' },
  { href: '/teachers', icon: Users, label: 'शिक्षक' },
  { href: '/school-priority-list', icon: ListChecks, label: 'स्कूल सूची' },
  { href: '/contact', icon: Phone, label: 'संपर्क' },
];

export default function DashboardPage() {
  return (
    <div className="bg-primary min-h-full -m-4 sm:-m-6 pt-4 text-white">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Logo className="bg-white text-primary p-2 [&>svg]:h-8 [&>svg]:w-8" />
          <div>
            <h1 className="text-xl font-bold font-headline">गो स्वामी डिफेंस एकेडमी</h1>
          </div>
        </div>
        
        <Card className="bg-white/95 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-base sm:text-lg font-semibold text-primary">
              "संघर्ष की ताकत ही आपकी उपलब्धि की सफलता को निर्धारित करती है।"
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2">
          {menuItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <Card className="bg-white/95 text-primary hover:bg-white transition-all aspect-square flex items-center justify-center shadow-lg">
                <CardContent className="p-2 pt-3 flex flex-col items-center text-center gap-2">
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  <span className="text-xs sm:text-sm font-semibold font-headline leading-tight">{item.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
