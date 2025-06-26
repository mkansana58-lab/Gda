
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Newspaper, ClipboardCheck, BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/user-context';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/courses', icon: BookMarked, label: 'Courses' },
  { href: '/ai-test', icon: ClipboardCheck, label: 'Test' },
  { href: '/posts', icon: Newspaper, label: 'Posts' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { setProfileDialogOpen } = useUser();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card text-card-foreground md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground transition-colors hover:text-[hsl(var(--ring))]',
              pathname === item.href && 'text-[hsl(var(--ring))]'
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setProfileDialogOpen(true)}
          className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground transition-colors hover:text-[hsl(var(--ring))]"
        >
          <User className="h-6 w-6" />
          <span className="text-xs font-medium">Account</span>
        </button>
      </div>
    </div>
  );
}
