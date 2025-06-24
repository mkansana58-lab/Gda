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
  <div className="relative flex w-full overflow-x-hidden">
    <p className="marquee-text font-semibold">{text}</p>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <h1 className="text-2xl font-bold text-center font-headline">मुख्य विशेषताएं</h1>
      
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="bg-card text-card-foreground hover:bg-primary/20 transition-all aspect-square flex items-center justify-center shadow-lg border-border">
              <CardContent className="p-1 flex flex-col items-center text-center gap-1">
                <item.icon className="w-6 h-6 text-primary" />
                <span className="text-[10px] sm:text-xs font-semibold leading-tight">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-center">रक्षकों की एक पीढ़ी को प्रेरित करना</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-card text-card-foreground rounded-lg p-2 text-center relative overflow-hidden">
             <Marquee text='"अपने सपनों की दिशा में आत्मविश्वास से बढ़ें। वह जीवन जिएं जिसकी आपने कल्पना की है।"    "सफलता का कोई रहस्य नहीं है, यह तैयारी और कड़ी मेहनत का परिणाम है।"    "कल के लिए सबसे अच्छी तैयारी यही है कि आज अपना सर्वश्रेष्ठ करो।"' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
