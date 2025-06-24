'use client';

import {
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  Eye,
  Settings,
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

export function UserNav() {
  const { user, logout, setProfileDialogOpen } = useUser();
  const { setTheme } = useNextTheme();
  const { isEyeComfortMode, toggleEyeComfortMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-primary-foreground/10">
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
          <DropdownMenuItem onSelect={() => setProfileDialogOpen(true)}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>प्रोफ़ाइल</span>
          </DropdownMenuItem>
           <DropdownMenuItem onSelect={() => setProfileDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>सेटिंग्स</span>
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
  );
}
