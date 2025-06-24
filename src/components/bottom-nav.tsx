'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, GraduationCap, FilePen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/user-context';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/learning-hub', icon: BookOpen, label: 'Learn' },
  { href: '/ai-tutor', icon: GraduationCap, label: 'Tutor' },
  { href: '/plan-form', icon: FilePen, label: 'Apply' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setProfileDialogOpen } = useUser();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-30 md:hidden">
      <div className="flex items-center justify-around h-16 bg-card/80 backdrop-blur-lg rounded-full shadow-2xl border border-white/10">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center h-full w-16 text-muted-foreground hover:text-primary transition-colors',
              pathname === item.href ? 'text-primary' : ''
            )}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setProfileDialogOpen(true)}
          className="flex flex-col items-center justify-center h-full w-16 text-muted-foreground hover:text-primary transition-colors"
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Account</span>
        </button>
      </div>
    </div>
  );
}
