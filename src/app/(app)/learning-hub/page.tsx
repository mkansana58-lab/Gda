
'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText } from "lucide-react";
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";

interface DownloadableFile {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
}

export default function LearningHubPage() {
    const [files, setFiles] = useState<DownloadableFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "downloads"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const downloadableFiles: DownloadableFile[] = [];
            querySnapshot.forEach((doc) => {
                downloadableFiles.push({ id: doc.id, ...doc.data() } as DownloadableFile);
            });
            setFiles(downloadableFiles);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching downloads: ", error);
            toast({
                variant: 'destructive',
                title: 'डाउनलोड्स लोड करने में त्रुटि',
                description: 'डेटाबेस से स्टडी मटेरियल लोड करने की अनुमति नहीं है। कृपया अपने फायरबेस सुरक्षा नियमों की जांच करें।',
                duration: 7000,
            });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    return (
        <div className="flex flex-col gap-8 p-4">
            <div>
                <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">स्टडी मटेरियल डाउनलोड करें</h1>
                <p className="text-muted-foreground">यहां से महत्वपूर्ण नोट्स, ई-बुक्स और अभ्यास पत्र डाउनलोड करें।</p>
            </div>

            {isLoading ? (
                 <div className="flex items-center justify-center py-8">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span>स्टडी मटेरियल लोड हो रहा है...</span>
                </div>
            ) : files.length > 0 ? (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {files.map(file => (
                         <Card key={file.id} className="flex flex-col hover:shadow-lg hover:border-primary/50 transition-all duration-200 bg-card">
                            <CardHeader className="flex-row items-start gap-4">
                               <div className="p-3 bg-primary/10 rounded-lg">
                                   <FileText className="w-8 h-8 text-primary"/>
                               </div>
                               <div className="flex-1">
                                    <CardTitle className="font-headline">{file.title}</CardTitle>
                                    <CardDescription>{file.description}</CardDescription>
                               </div>
                            </CardHeader>
                            <CardContent className="flex-grow"></CardContent>
                            <CardFooter>
                               <Button className="w-full" asChild disabled={!file.fileUrl || file.fileUrl === "#"}>
                                    <Link href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                                      <Download className="mr-2 h-4 w-4"/>  डाउनलोड करें
                                    </Link>
                               </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
             ) : (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        अभी कोई स्टडी मटेरियल उपलब्ध नहीं है।
                    </CardContent>
                </Card>
             )}
        </div>
    );
}
