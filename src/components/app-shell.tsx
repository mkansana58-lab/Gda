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
  ClipboardCheck,
  Trophy,
  Users,
  MessageSquare,
  ListChecks,
  Bell,
  PanelLeft,
  Ticket,
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
  useSidebar,
} from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { useUser } from '@/context/user-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { BottomNav } from './bottom-nav';
import { Button } from './ui/button';
import { useState } from 'react';
import { NotificationsSheet } from './notifications-sheet';
import { Logo } from './logo';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'डैशबोर्ड' },
  { href: '/plan-form', icon: FilePen, label: 'छात्रवृत्ति फॉर्म' },
  { href: '/admit-card', icon: Ticket, label: 'एडमिट कार्ड' },
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
  const { isMobile, setOpenMobile, toggleSidebar } = useSidebar();
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
          <div className="flex items-center gap-3 p-4">
            <Logo className="h-12 w-12" />
            <div className="flex flex-col">
              <h2 className="font-headline text-xl font-semibold">गो स्वामी</h2>
              <p className="text-sm text-muted-foreground -mt-1">
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
          <div className="flex items-center gap-3 p-2 border-t border-sidebar-border">
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
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border/20 bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-foreground hover:bg-white/20">
            <PanelLeft className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationsOpen(true)}
              className="text-foreground hover:bg-white/20"
            >
              <Bell className="h-6 w-6" />
              <span className="sr-only">सूचनाएं</span>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto pb-28 md:pb-8">
          {children}
        </main>
        <BottomNav />
        <NotificationsSheet
          open={isNotificationsOpen}
          onOpenChange={setIsNotificationsOpen}
        />
      </div>
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
