
'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Send, Globe, MessageSquare, BookOpen, Loader2 } from "lucide-react";
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LiveClass {
    id: string;
    title: string;
    description: string;
    platform: string;
    link: string;
}

const staticLiveClassLinks = [
    {
        platform: "WhatsApp",
        description: "लाइव क्लास अपडेट और लिंक के लिए हमारा व्हाट्सएप ग्रुप ज्वाइन करें।",
        icon: MessageSquare,
        href: "https://whatsapp.com/channel/0029Vb5rFygInlqTaS2GLK2W",
        actionText: "WhatsApp पर शामिल हों"
    },
    {
        platform: "YouTube",
        description: "हमारे आधिकारिक यूट्यूब चैनल पर लाइव स्ट्रीमिंग देखें।",
        icon: Youtube,
        href: "https://youtube.com/@mohitkansana-s1h?si=QMGo6pzOAIjREffW",
        actionText: "YouTube पर शामिल हों"
    },
    {
        platform: "Telegram",
        description: "लाइव क्लास अपडेट और लिंक के लिए हमारा टेलीग्राम चैनल ज्वाइन करें।",
        icon: Send,
        href: "https://t.me/MohitKansana82",
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
    const [adminClasses, setAdminClasses] = useState<LiveClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "liveClasses"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const classes: LiveClass[] = [];
            querySnapshot.forEach((doc) => {
                classes.push({ id: doc.id, ...doc.data() } as LiveClass);
            });
            setAdminClasses(classes);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching live classes: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'youtube': return <Youtube className="w-8 h-8 text-primary"/>;
            case 'telegram': return <Send className="w-8 h-8 text-primary"/>;
            case 'whatsapp': return <MessageSquare className="w-8 h-8 text-primary"/>;
            case 'google site': return <Globe className="w-8 h-8 text-primary"/>;
            default: return <BookOpen className="w-8 h-8 text-primary"/>;
        }
    }

    return (
        <div className="flex flex-col gap-8 p-4">
            <div>
                <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">लाइव कक्षाएं</h1>
                <p className="text-muted-foreground">विभिन्न प्लेटफार्मों पर हमारे लाइव सत्रों से जुड़ें।</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {staticLiveClassLinks.map(link => (
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

            <div className="space-y-4">
                <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight border-b pb-2">नवीनतम लाइव कक्षाएं</h2>
                {isLoading ? (
                     <div className="flex items-center justify-center py-8">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span>लाइव कक्षाएं लोड हो रही हैं...</span>
                    </div>
                ) : adminClasses.length > 0 ? (
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {adminClasses.map(link => (
                             <Card key={link.id} className="flex flex-col hover:shadow-lg hover:border-primary/50 transition-all duration-200 bg-card">
                                <CardHeader className="flex-row items-start gap-4">
                                   <div className="p-3 bg-primary/10 rounded-lg">
                                       {getPlatformIcon(link.platform)}
                                   </div>
                                   <div className="flex-1">
                                        <CardTitle className="font-headline">{link.title}</CardTitle>
                                        <CardDescription>{link.description}</CardDescription>
                                   </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                </CardContent>
                                <CardFooter>
                                   <Button className="w-full" asChild disabled={!link.link || link.link === "#"}>
                                        <Link href={link.link} target="_blank" rel="noopener noreferrer">अभी जुड़ें</Link>
                                   </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                 ) : (
                    <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                            अभी कोई लाइव क्लास उपलब्ध नहीं है।
                        </CardContent>
                    </Card>
                 )}
            </div>
        </div>
    );
}
