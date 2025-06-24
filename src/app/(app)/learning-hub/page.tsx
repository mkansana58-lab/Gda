'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Video, Download } from "lucide-react";
import Link from 'next/link';

const learningSections = [
    {
        title: "लाइव कक्षाएं",
        description: "विशेषज्ञ प्रशिक्षकों के साथ हमारे इंटरैक्टिव लाइव सत्रों में शामिल हों।",
        icon: Video,
        actionText: "जल्द आ रहा है",
        href: "#",
        disabled: true
    },
    {
        title: "रिकॉर्डेड वीडियो",
        description: "छूटी हुई कक्षाओं को पकड़ें या अपनी गति से विषयों को संशोधित करें।",
        icon: Youtube,
        actionText: "यूट्यूब पर देखें",
        href: "https://youtube.com/@mohitkansana-s1h?si=vXGmKt03HwtcG55s",
        disabled: false
    },
    {
        title: "डाउनलोड",
        description: "अध्ययन सामग्री, नोट्स और अभ्यास पत्रों तक पहुँच प्राप्त करें।",
        icon: Download,
        actionText: "जल्द आ रहा है",
        href: "#",
        disabled: true
    },
]

export default function LearningHubPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">लर्निंग हब</h1>
                <p className="text-muted-foreground">सभी शिक्षण संसाधनों के लिए आपका वन-स्टॉप डेस्टिनेशन।</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {learningSections.map(section => (
                    <Card key={section.title} className="flex flex-col hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                        <CardHeader className="flex-row items-start gap-4">
                           <div className="p-3 bg-primary/10 rounded-lg">
                                <section.icon className="w-8 h-8 text-primary"/>
                           </div>
                           <div className="flex-1">
                                <CardTitle className="font-headline">{section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            {/* Placeholder content can go here */}
                        </CardContent>
                        <CardFooter>
                           <Button className="w-full" asChild disabled={section.disabled}>
                                <Link href={section.href} target={section.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">{section.actionText}</Link>
                           </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card className="mt-4">
                <CardHeader>
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div>
                        <CardTitle className="font-headline">यूट्यूब पर और अन्वेषण करें</CardTitle>
                        <CardDescription>हमारे आधिकारिक चैनल पर हमारी वीडियो सामग्री की पूरी लाइब्रेरी देखें।</CardDescription>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <a href="https://youtube.com/@mohitkansana-s1h?si=vXGmKt03HwtcG55s" target="_blank" rel="noopener noreferrer">
                            <Youtube className="mr-2 h-4 w-4" />
                            सभी कक्षाएं देखें
                        </a>
                    </Button>
                   </div>
                </CardHeader>
            </Card>
        </div>
    );
}
