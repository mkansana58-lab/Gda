
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Send, Globe } from "lucide-react";
import Link from 'next/link';

const liveClassLinks = [
    {
        platform: "YouTube",
        description: "हमारे आधिकारिक यूट्यूब चैनल पर लाइव स्ट्रीमिंग देखें।",
        icon: Youtube,
        href: "https://youtube.com/@mohitkansana-s1h?si=vXGmKt03HwtcG55s",
        actionText: "YouTube पर शामिल हों"
    },
    {
        platform: "Telegram",
        description: "लाइव क्लास अपडेट और लिंक के लिए हमारा टेलीग्राम चैनल ज्वाइन करें।",
        icon: Send,
        href: "#", // Placeholder
        actionText: "Telegram पर शामिल हों"
    },
    {
        platform: "Google Site",
        description: "हमारी समर्पित क्लासरूम साइट पर सामग्री और शेड्यूल तक पहुँचें।",
        icon: Globe,
        href: "#", // Placeholder
        actionText: "वेबसाइट पर जाएं"
    }
];


export default function LiveClassesPage() {
    return (
        <div className="flex flex-col gap-8 p-4">
            <div>
                <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">लाइव कक्षाएं</h1>
                <p className="text-muted-foreground">विभिन्न प्लेटफार्मों पर हमारे लाइव सत्रों से जुड़ें।</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {liveClassLinks.map(link => (
                     <Card key={link.platform} className="flex flex-col hover:shadow-lg hover:border-primary/50 transition-all duration-200 bg-card">
                        <CardHeader className="flex-row items-start gap-4">
                           <div className="p-3 bg-primary/10 rounded-lg">
                                <link.icon className="w-8 h-8 text-primary"/>
                           </div>
                           <div className="flex-1">
                                <CardTitle className="font-headline">{link.platform}</CardTitle>
                                <CardDescription>{link.description}</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        </CardContent>
                        <CardFooter>
                           <Button className="w-full" asChild disabled={link.href === "#"}>
                                <Link href={link.href} target="_blank" rel="noopener noreferrer">{link.actionText}</Link>
                           </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

