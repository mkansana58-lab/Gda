
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { FilePen, ClipboardCheck, GraduationCap, Scaling, Trophy, Users, ListChecks, Phone } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { href: '/plan-form', icon: FilePen, label: 'छात्रवृत्ति' },
  { href: '/ai-test', icon: ClipboardCheck, label: 'AI टेस्ट' },
  { href: '/ai-tutor', icon: GraduationCap, label: 'AI ट्यूटर' },
  { href: '/cutoff-checker', icon: Scaling, label: 'कट-ऑफ' },
  { href: '/toppers', icon: Trophy, label: 'टॉपर्स' },
  { href: '/teachers', icon: Users, label: 'शिक्षक' },
  { href: '/school-priority-list', icon: ListChecks, label: 'स्कूल सूची' },
  { href: '/contact', icon: Phone, label: 'संपर्क' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">डैशबोर्ड</h1>
            <p className="text-muted-foreground">
            मुख्य सुविधाओं तक त्वरित पहुंच।
            </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
            {menuItems.map((item) => (
            <Card key={item.href} className="hover:border-primary hover:shadow-lg transition-all">
                <CardContent className="p-3 pt-4 sm:p-4 sm:pt-6">
                    <Link href={item.href} className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                            <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary"/>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold font-headline leading-tight">{item.label}</span>
                    </Link>
                </CardContent>
            </Card>
            ))}
        </div>
    </div>
  );
}
