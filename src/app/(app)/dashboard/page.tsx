'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FilePen,
  ClipboardCheck,
  GraduationCap,
  MessageSquare,
  Scaling,
  Trophy,
  Users,
  BookOpen,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { href: '/learning-hub', icon: BookOpen, label: 'लर्निंग हब' },
  { href: '/ai-test', icon: ClipboardCheck, label: 'टेस्ट सीरीज़' },
  { href: '/ai-tutor', icon: GraduationCap, label: 'AI ट्यूटर' },
  { href: '/school-priority-list', icon: ListChecks, label: 'सैनिक स्कूल सूची' },
  { href: '/cutoff-checker', icon: Scaling, label: 'कट-ऑफ चेकर' },
  { href: '/toppers', icon: Trophy, label: 'टॉपर्स' },
  { href: '/teachers', icon: Users, label: 'हमारे शिक्षक' },
  { href: '/contact', icon: MessageSquare, label: 'हमसे संपर्क करें' },
  { href: '/plan-form', icon: FilePen, label: 'छात्रवृत्ति फॉर्म' },
];

const Marquee = ({ text }: { text: string }) => (
  <div className="relative flex w-full overflow-x-hidden rounded-lg bg-card p-2 text-center text-card-foreground">
    <p className="marquee-text font-semibold">{text}</p>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-center font-headline">मुख्य विशेषताएं</h1>
      
      <div className="grid grid-cols-3 gap-3">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href} className="flex flex-col">
            <Card className="flex h-24 flex-col items-center justify-center bg-card text-card-foreground shadow-lg transition-all hover:bg-primary/20">
              <CardContent className="flex flex-col items-center justify-center p-2 text-center">
                <item.icon className="mb-1 h-7 w-7 text-primary" />
                <span className="text-xs font-semibold leading-tight">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-auto bg-primary text-primary-foreground">
        <CardHeader className="p-3">
          <CardTitle className="text-lg font-headline text-center">रक्षकों की एक पीढ़ी को प्रेरित करना</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <Marquee text='"अपने सपनों की दिशा में आत्मविश्वास से बढ़ें।" "सफलता का कोई रहस्य नहीं है, यह तैयारी और कड़ी मेहनत का परिणाम है।" "कल के लिए सबसे अच्छी तैयारी यही है कि आज अपना सर्वश्रेष्ठ करो।"' />
        </CardContent>
      </Card>
    </div>
  );
}
