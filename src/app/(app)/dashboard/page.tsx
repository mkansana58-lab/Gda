'use client';
import {
  BookOpen,
  Bot,
  FileText,
  GraduationCap,
  Phone,
  Scaling,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useUser } from '@/context/user-context';

const features = [
  {
    title: 'Plan Form',
    description: 'Apply for various exams.',
    icon: FileText,
    href: '/plan-form',
    color: 'text-blue-500',
  },
  {
    title: 'Learning Hub',
    description: 'Access classes and materials.',
    icon: BookOpen,
    href: '/learning-hub',
    color: 'text-green-500',
  },
  {
    title: 'AI Tutor',
    description: 'Get answers to your questions.',
    icon: GraduationCap,
    href: '/ai-tutor',
    color: 'text-purple-500',
  },
  {
    title: 'AI Chat',
    description: 'Check your scholarship results.',
    icon: Bot,
    href: '/ai-chat',
    color: 'text-cyan-500',
  },
  {
    title: 'Cut-Off Checker',
    description: 'View previous year cut-offs.',
    icon: Scaling,
    href: '/cutoff-checker',
    color: 'text-red-500',
  },
  {
    title: 'Contact Us',
    description: 'Get in touch with us.',
    icon: Phone,
    href: '/contact',
    color: 'text-yellow-500',
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
        <p className="text-muted-foreground">
          Here's your personal dashboard.
        </p>
      </div>
      
      <div className="relative w-full overflow-hidden bg-primary/10 rounded-lg p-4">
        <p className="text-primary font-semibold whitespace-nowrap animate-marquee">
          सपनों को हकीकत बनाना है, तो आज से मेहनत शुरू करो।
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title}>
            <Card className="h-full hover:border-primary hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <feature.icon className={`w-8 h-8 ${feature.color} transition-transform duration-200 group-hover:scale-110`} />
                  <div>
                    <CardTitle className="font-headline group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
