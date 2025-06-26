
'use client';

import {
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  Shield,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function UserNav() {
  const { user, logout, setProfileDialogOpen } = useUser();
  const { setTheme } = useTheme();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
      // Check for admin status on the client side after hydration
      const adminUser = localStorage.getItem('adminUser');
      setIsAdmin(!!adminUser);
  }, [user]); // Re-check when user logs in or out

  if (!user) {
    return null; // Don't render anything if user is not loaded to avoid hydration errors
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage src={user.profilePhotoUrl} alt={user.name} />
            <AvatarFallback className="bg-secondary">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => setProfileDialogOpen(true)}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>प्रोफ़ाइल और सेटिंग्स</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isAdmin && (
            <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push('/admin/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>एडमिन पैनल</span>
                </DropdownMenuItem>
            </>
        )}
        <DropdownMenuSeparator />
         <DropdownMenuSub>
            <DropdownMenuSubTrigger>
               <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
               <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
               <span className="ml-2">थीम</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setTheme('light')}>लाइट</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme('dark')}>डार्क</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme('system')}>सिस्टम</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>लॉग आउट</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
