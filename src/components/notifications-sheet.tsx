'use client';

import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Bell, FilePen, Sparkles, CheckCircle } from 'lucide-react';
import { Separator } from './ui/separator';
import { useUser } from '@/context/user-context';
import { Notification, getNotifications, markAllAsRead } from '@/lib/notifications';

const iconMap = {
  Bell: Bell,
  FilePen: FilePen,
  Sparkles: Sparkles,
  CheckCircle: CheckCircle,
};

const motivationalQuotes = [
  "सपनों को हकीकत बनाना है, तो आज से मेहनत शुरू करो।",
  "सफलता का कोई रहस्य नहीं है, यह तैयारी, कड़ी मेहनत और असफलता से सीखने का परिणाम है।",
  "कल के लिए सबसे अच्छी तैयारी यही है कि आज अपना सर्वश्रेष्ठ करो।",
  "जो छात्र प्रश्न पूछता है, वह पाँच मिनट के लिए मूर्ख रहता है, लेकिन जो नहीं पूछता, वह हमेशा के लिए मूर्ख रहता है।",
  "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।"
];

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();

  const storageKey = `user-notifications-${user?.email || 'guest'}`;
  const dateStorageKey = `last-motivational-date-${user?.email || 'guest'}`;

  useEffect(() => {
    if (open && user) {
      const storedNotifications = getNotifications(user.email);
      let currentNotifications = [...storedNotifications];
      
      const today = new Date().toDateString();
      const lastMotivationalDate = localStorage.getItem(dateStorageKey);

      if (lastMotivationalDate !== today) {
         const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
         const motivationalNotif: Notification = {
            id: `motiv-${Date.now()}`,
            icon: 'Sparkles',
            title: "आज का विचार",
            description: quote,
            read: false,
            timestamp: new Date().toISOString()
         };
         currentNotifications.unshift(motivationalNotif);
         localStorage.setItem(dateStorageKey, today);
         // Also save this new notification
         localStorage.setItem(storageKey, JSON.stringify(currentNotifications.slice(0, 20)));
      }
      
      setNotifications(currentNotifications.slice(0, 20).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      
      // Mark all as read after a short delay
      setTimeout(() => {
        markAllAsRead(user.email);
        setNotifications(prev => prev.map(n => ({...n, read: true})));
      }, 2000);
    }
  }, [open, storageKey, dateStorageKey, user]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>सूचनाएं</SheetTitle>
          <SheetDescription>आपकी हाल की गतिविधियाँ और अपडेट।</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-1">
            {notifications.length > 0 ? (
                notifications.map((notification, index) => {
                    const IconComponent = iconMap[notification.icon] || Bell;
                    return (
                        <React.Fragment key={notification.id}>
                            <div className="flex items-start gap-4 p-3 relative rounded-lg hover:bg-secondary">
                               <IconComponent className={`mt-1 h-5 w-5 flex-shrink-0 ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`} />
                               <div className="flex-grow">
                                   <p className={`font-semibold ${!notification.read ? '' : 'text-muted-foreground'}`}>{notification.title}</p>
                                   <p className="text-sm text-muted-foreground">{notification.description}</p>
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
      </SheetContent>
    </Sheet>
  );
}
