'use client';
import {
  BookOpen,
  Bot,
  FilePen,
  GraduationCap,
  Phone,
  Scaling,
  ClipboardCheck,
  Trophy,
  Users,
  MessageCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useUser } from '@/context/user-context';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'Scholarship Form',
    description: 'Apply for scholarships.',
    icon: FilePen,
    href: '/plan-form',
  },
  {
    title: 'Learning Hub',
    description: 'Access classes & materials.',
    icon: BookOpen,
    href: '/learning-hub',
  },
  {
    title: 'AI Tutor',
    description: 'Get answers to your questions.',
    icon: GraduationCap,
    href: '/ai-tutor',
  },
  {
    title: 'AI Chat',
    description: 'Check your scholarship results.',
    icon: Bot,
    href: '/ai-chat',
  },
  {
    title: 'AI Test',
    description: 'Take a practice test.',
    icon: ClipboardCheck,
    href: '/ai-test',
  },
  {
    title: 'Cut-Off Checker',
    description: 'Check selection chances.',
    icon: Scaling,
    href: '/cutoff-checker',
  },
  {
    title: "Toppers List",
    description: "See our top performing students.",
    icon: Trophy,
    href: "/toppers",
  },
  {
    title: "Our Teachers",
    description: "Meet our expert faculty.",
    icon: Users,
    href: "/teachers",
  },
  {
    title: 'Contact Us',
    description: 'Get in touch with us.',
    icon: Phone,
    href: '/contact',
  },
];

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <div className="w-full overflow-hidden whitespace-nowrap mt-2">
            <p className="marquee-text text-muted-foreground">
                सपनों को हकीकत बनाना है, तो आज से मेहनत शुरू करो।
            </p>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title}>
            <Card className="h-full hover:border-primary hover:shadow-lg transition-all duration-200 group aspect-square flex flex-col items-center justify-center text-center p-4">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <feature.icon className="w-8 h-8 text-primary transition-transform duration-200 group-hover:scale-110" />
              </div>
              <h3 className="font-headline text-lg font-semibold group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </Card>
          </Link>
        ))}
      </div>

       <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MessageCircle className="w-12 h-12" />
            <div>
              <h3 className="text-xl font-bold font-headline">Join our Community!</h3>
              <p className="opacity-90">Get updates, notes, and interact with peers on WhatsApp.</p>
            </div>
          </div>
          <Button
            asChild
            className="bg-white text-green-600 hover:bg-gray-100 font-bold sm:w-auto w-full"
          >
            <a href="https://chat.whatsapp.com/H36NUumZ77h9QfyOSncJAR" target="_blank" rel="noopener noreferrer">
              Join WhatsApp Group
            </a>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
