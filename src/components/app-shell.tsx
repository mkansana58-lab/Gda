
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FilePen,
  GraduationCap,
  Home,
  Phone,
  Scaling,
  ShieldCheck,
  ClipboardCheck,
  Trophy,
  Users,
  MessageSquare,
  ListChecks,
  Bell,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { useUser } from '@/context/user-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { BottomNav } from './bottom-nav';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { NotificationsSheet } from './notifications-sheet';
import { Button } from './ui/button';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'डैशबोर्ड' },
  { href: '/plan-form', icon: FilePen, label: 'छात्रवृत्ति फॉर्म' },
  { href: '/learning-hub', icon: BookOpen, label: 'लर्निंग हब' },
  { href: '/ai-tutor', icon: GraduationCap, label: 'AI ट्यूटर' },
  { href: '/ai-chat', icon: MessageSquare, label: 'AI चैट' },
  { href: '/ai-test', icon: ClipboardCheck, label: 'AI टेस्ट' },
  { href: '/cutoff-checker', icon: Scaling, label: 'कट-ऑफ चेकर' },
  { href: '/toppers', icon: Trophy, label: 'टॉपर्स' },
  { href: '/teachers', icon: Users, label: 'शिक्षक' },
  { href: '/school-priority-list', icon: ListChecks, label: 'स्कूल सूची' },
  { href: '/contact', icon: Phone, label: 'संपर्क' },
];

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { isMobile, setOpenMobile } = useSidebar();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="font-headline text-lg font-semibold">गो स्वामी</h2>
              <p className="text-xs text-muted-foreground -mt-1">
                डिफेंस एकेडमी
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  onClick={handleLinkClick}
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 border-t">
            <Avatar>
              <AvatarImage src={user?.profilePhotoUrl} alt={user?.name ?? ''} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-primary px-4 text-primary-foreground sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden hover:bg-primary-foreground/10" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary-foreground/10"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">सूचनाएं</span>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="h-full pb-24">
            <div className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6">
                 {children}
            </div>
        </main>
        <BottomNav />
        <NotificationsSheet
          open={isNotificationsOpen}
          onOpenChange={setIsNotificationsOpen}
        />
      </SidebarInset>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
