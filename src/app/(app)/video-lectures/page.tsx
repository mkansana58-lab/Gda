
'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, Video } from "lucide-react";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoLecture {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
}

const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        let videoId = urlObj.searchParams.get('v');
        if (!videoId && urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (error) {
        return null;
    }
};

export default function VideoLecturesPage() {
    const [videos, setVideos] = useState<VideoLecture[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const videoData: VideoLecture[] = [];
            querySnapshot.forEach((doc) => {
                videoData.push({ id: doc.id, ...doc.data() } as VideoLecture);
            });
            setVideos(videoData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching videos: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="flex flex-col gap-8 p-4">
            <div>
                <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">वीडियो लेक्चर</h1>
                <p className="text-muted-foreground">विशेषज्ञों द्वारा रिकॉर्ड किए गए लेक्चर देखें।</p>
            </div>

            {isLoading ? (
                 <div className="flex items-center justify-center py-8">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span>वीडियो लोड हो रहे हैं...</span>
                </div>
            ) : videos.length > 0 ? (
                 <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {videos.map(video => {
                        const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
                        return (
                         <Card key={video.id} className="flex flex-col hover:shadow-lg hover:border-primary/50 transition-all duration-200 bg-card">
                            <CardHeader>
                               <CardTitle className="font-headline">{video.title}</CardTitle>
                               <CardDescription>{video.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                {embedUrl ? (
                                    <AspectRatio ratio={16 / 9}>
                                        <iframe
                                            src={embedUrl}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full rounded-md"
                                        ></iframe>
                                    </AspectRatio>
                                ) : (
                                    <div className="flex items-center justify-center bg-muted h-48 rounded-md">
                                        <p className="text-destructive">अमान्य YouTube URL</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )})}
                </div>
             ) : (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground flex flex-col items-center gap-4">
                        <Video className="w-12 h-12" />
                        अभी कोई वीडियो लेक्चर उपलब्ध नहीं है।
                    </CardContent>
                </Card>
             )}
        </div>
    );
}
