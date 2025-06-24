'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Video, MessageSquare, FilePen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/user-context';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/learning-hub', icon: Video, label: 'Learn' },
  { href: '/ai-tutor', icon: MessageSquare, label: 'Tutor' },
  { href: '/plan-form', icon: FilePen, label: 'Apply' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setProfileDialogOpen } = useUser();

  return (
    <div className="fixed bottom-0 left-0 w-full p-2 md:hidden z-30">
      <div className="w-full mx-auto bg-card/90 backdrop-blur-sm border rounded-full shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center h-14 w-16 rounded-full text-muted-foreground hover:bg-accent/50 transition-colors',
                pathname === item.href ? 'text-primary' : ''
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setProfileDialogOpen(true)}
            className="flex flex-col items-center justify-center h-14 w-16 rounded-full text-muted-foreground hover:bg-accent/50 transition-colors"
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
