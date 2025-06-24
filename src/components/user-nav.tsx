'use client';

import { useState } from 'react';
import {
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  Bell,
  Eye,
} from 'lucide-react';
import { useTheme as useNextTheme } from 'next-themes';
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
import { useTheme } from '@/context/theme-provider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ProfileEditDialog } from './profile-edit-dialog';
import { NotificationsSheet } from './notifications-sheet';

export function UserNav() {
  const { user, logout } = useUser();
  const { setTheme } = useNextTheme();
  const { isEyeComfortMode, toggleEyeComfortMode } = useTheme();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profilePhotoUrl} alt={user?.name ?? ''} />
              <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
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
            <DropdownMenuItem onSelect={() => setIsProfileDialogOpen(true)}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>प्रोफ़ाइल संपादित करें</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsNotificationsOpen(true)}>
              <Bell className="mr-2 h-4 w-4" />
              <span>सूचनाएं</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
           <DropdownMenuGroup>
            <DropdownMenuLabel>उपस्थिति</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="ml-2">थीम बदलें</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme('light')}>लाइट</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>डार्क</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>सिस्टम</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center justify-between w-full">
                  <Label htmlFor="eye-comfort-mode" className="flex items-center gap-2 font-normal">
                      <Eye className="h-4 w-4"/> आई कम्फर्ट
                  </Label>
                  <Switch
                      id="eye-comfort-mode"
                      checked={isEyeComfortMode}
                      onCheckedChange={toggleEyeComfortMode}
                  />
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>लॉग आउट</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileEditDialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen} />
      <NotificationsSheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
    </>
  );
}
