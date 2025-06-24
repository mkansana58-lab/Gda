'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { BellRing, CheckCircle } from 'lucide-react';
import { Separator } from './ui/separator';

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const notifications = [
    {
        icon: BellRing,
        title: "अकादमी में आपका स्वागत है!",
        description: "हम आपको अपने साथ पाकर बहुत खुश हैं। अपनी तैयारी आज से शुरू करें।",
        read: false,
    },
    {
        icon: CheckCircle,
        title: "आपकी प्रोफ़ाइल पूरी हो गई है",
        description: "आपकी सभी जानकारी सफलतापूर्वक सहेज ली गई है।",
        read: true,
    }
]

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>सूचनाएं</SheetTitle>
          <SheetDescription>आपकी हाल की गतिविधियाँ और अपडेट।</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
            {notifications.map((notification, index) => (
                <div key={index}>
                    <div className="flex items-start gap-4 p-2">
                        <notification.icon className={`mt-1 h-5 w-5 flex-shrink-0 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                        <div className="flex-grow">
                            <p className={`font-semibold ${notification.read ? 'text-muted-foreground' : ''}`}>{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                         {!notification.read && <div className="h-2.5 w-2.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>}
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                </div>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
