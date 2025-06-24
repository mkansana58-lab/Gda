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
  Mail,
  Settings,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useUser } from '@/context/user-context';
import { Logo } from '@/components/logo';

const features = [
  { title: 'Scholarship Form', icon: Bookmark, href: '/plan-form' },
  { title: 'Learning Hub', icon: BookOpen, href: '/learning-hub' },
  { title: 'AI Tutor', icon: MessageSquare, href: '/ai-tutor' },
  { title: 'AI Chat', icon: Bot, href: '/ai-chat' },
  { title: 'AI Test', icon: FlaskConical, href: '/ai-test' },
  { title: 'Cut-off Checker', icon: TrendingUp, href: '/cutoff-checker' },
  { title: 'Topper List', icon: Star, href: '/toppers' },
  { title: 'Our Teachers', icon: Users, href: '/teachers' },
  { title: 'Contact Us', icon: Mail, href: '/contact' },
  { title: 'Settings', icon: Settings, href: '#' },
];

export default function DashboardPage() {
  const { setProfileDialogOpen } = useUser();

  return (
    <div className="bg-primary text-primary-foreground -m-4 sm:-m-6 min-h-screen">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-2xl font-bold font-headline">Goswami</h1>
            <h2 className="text-2xl font-light font-headline -mt-2">Defence Academy</h2>
          </div>
        </div>

        {/* Quote */}
        <Card className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg">
          <p className="text-center text-lg font-medium">
            “The strength of your struggle determines the success of your achievement.”
          </p>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const isSettings = feature.title === 'Settings';
            
            const content = (
              <div className="bg-card text-primary aspect-square flex flex-col items-center justify-center text-center p-1 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer shadow-md">
                <feature.icon className="w-7 h-7 mb-2" />
                <h3 className="text-xs font-semibold leading-tight text-center">{feature.title}</h3>
              </div>
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
