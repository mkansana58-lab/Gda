
'use client';

import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Bell, FilePen, Sparkles, CheckCircle, Newspaper } from 'lucide-react';
import { Separator } from './ui/separator';
import { useUser } from '@/context/user-context';
import { Notification as UserNotification, getNotifications, markAllAsRead } from '@/lib/notifications';
import { ScrollArea } from './ui/scroll-area';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const iconMap: { [key: string]: React.ElementType } = {
  Bell: Bell,
  FilePen: FilePen,
  Sparkles: Sparkles,
  CheckCircle: CheckCircle,
  Newspaper: Newspaper,
};

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!open || !user?.email) return;

    // Listener for GLOBAL notifications from Firestore
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const globalNotifications: UserNotification[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            globalNotifications.push({
                id: doc.id,
                icon: data.icon || 'Bell',
                title: data.title,
                description: data.description,
                read: false, // will be checked against localstorage
                timestamp: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            });
        });
        
        const userNotifications = getNotifications(user.email);
        const combined = [...globalNotifications, ...userNotifications];
        combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        const readGlobalIdsKey = `read-global-ids-${user.email}`;
        const readGlobalIdsRaw = localStorage.getItem(readGlobalIdsKey);
        const readGlobalIds = readGlobalIdsRaw ? new Set(JSON.parse(readGlobalIdsRaw)) : new Set();
        
        const finalNotifications = combined.map(n => ({
            ...n,
            read: n.read || readGlobalIds.has(n.id),
        }));

        setNotifications(finalNotifications.slice(0, 40));
    }, (error) => {
      console.error("Error fetching global notifications: ", error);
      const userNotifications = getNotifications(user.email ?? '');
      setNotifications(userNotifications);
    });

    const timeout = setTimeout(() => {
        if (!user?.email) return;
        markAllAsRead(user.email);
        
        const readGlobalIdsKey = `read-global-ids-${user.email}`;
        const readGlobalIdsRaw = localStorage.getItem(readGlobalIdsKey);
        const readGlobalIds = readGlobalIdsRaw ? new Set<string>(JSON.parse(readGlobalIdsRaw)) : new Set<string>();
        
        notifications.forEach(n => {
            if (n.id.length > 15) { // Simple check to only add firestore IDs
                 readGlobalIds.add(n.id);
            }
        });
        localStorage.setItem(readGlobalIdsKey, JSON.stringify(Array.from(readGlobalIds)));

        setNotifications(prev => prev.map(n => ({...n, read: true})));
    }, 3000);

    return () => {
        unsubscribe();
        clearTimeout(timeout);
    };
  }, [open, user, notifications]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>सूचनाएं</SheetTitle>
          <SheetDescription>आपकी हाल की गतिविधियाँ और अपडेट।</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 -mx-6">
            <div className="space-y-1 px-6">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => {
                        const IconComponent = iconMap[notification.icon] || Bell;
                        return (
                            <React.Fragment key={notification.id}>
                                <div className="flex items-start gap-4 p-3 relative rounded-lg hover:bg-secondary">
                                   <IconComponent className={`mt-1 h-5 w-5 flex-shrink-0 ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`} />
                                   <div className="flex-grow overflow-hidden">
                                       <p className={`font-semibold truncate ${!notification.read ? '' : 'text-muted-foreground'}`}>{notification.title}</p>
                                       <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{notification.description}</p>
                                   </div>
                                   {!notification.read && <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-ping"></div>}
                                </div>
                                {index < notifications.length - 1 && <Separator />}
                            </React.Fragment>
                        );
                    })
                ) : (
                    <div className="text-center text-muted-foreground pt-10">
                        <Bell className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4">अभी कोई सूचनाएं नहीं हैं।</p>
                    </div>
                )}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
