'use client';

import {
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  Shield,
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
      if (adminUser) {
          setIsAdmin(true);
      } else {
          setIsAdmin(false);
      }
  }, [user]); // Re-check when user logs in or out

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage src={user?.profilePhotoUrl} alt={user?.name ?? ''} />
            <AvatarFallback className="bg-secondary">{user?.name?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => setProfileDialogOpen(true)}>
            <UserIcon className="mr-2 h-4 w-4 text-primary" />
            <span>प्रोफ़ाइल और सेटिंग्स</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isAdmin && (
            <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push('/admin/dashboard')}>
                    <Shield className="mr-2 h-4 w-4 text-primary" />
                    <span>एडमिन पैनल</span>
                </DropdownMenuItem>
            </>
        )}
        <DropdownMenuSeparator />
         <DropdownMenuGroup>
          <DropdownMenuLabel>उपस्थिति</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
               <div className="flex items-center">
                 <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                 <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                 <span className="ml-2">थीम बदलें</span>
               </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>लाइट</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>डार्क</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>सिस्टम</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4 text-primary" />
          <span>लॉग आउट</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
