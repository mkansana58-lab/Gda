
'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Send, Globe, MessageSquare, BookOpen, Loader2 } from "lucide-react";
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";

interface LiveClass {
    id: string;
    title: string;
    description: string;
    platform: string;
    link: string;
}

export default function LiveClassesPage() {
    const [adminClasses, setAdminClasses] = useState<LiveClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

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
            toast({
                variant: 'destructive',
                title: 'लाइव क्लास लोड करने में त्रुटि',
                description: 'डेटाबेस से लाइव क्लास लोड करने की अनुमति नहीं है। कृपया अपने फायरबेस सुरक्षा नियमों की जांच करें।',
                duration: 7000,
            });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

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
                <p className="text-muted-foreground">नवीनतम लाइव कक्षाओं से जुड़ें।</p>
            </div>

            <div className="space-y-4">
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
