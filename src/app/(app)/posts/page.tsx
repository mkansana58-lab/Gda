
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Newspaper } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: Timestamp;
}

export default function PostsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setPosts(postsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching posts:", error);
        toast({
            variant: 'destructive',
            title: 'पोस्ट लोड करने में त्रुटि',
            description: 'डेटाबेस से पोस्ट लोड करने की अनुमति नहीं है। कृपया अपने फायरबेस सुरक्षा नियमों की जांच करें।',
            duration: 7000,
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="text-center">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">डेली पोस्ट्स और अपडेट्स</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          अकादमी से नवीनतम समाचार, अपडेट और महत्वपूर्ण जानकारी प्राप्त करें।
        </p>
      </div>
      
      {isLoading ? (
         <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">पोस्ट्स लोड हो रहे हैं...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6 max-w-2xl mx-auto w-full animate-in fade-in">
            {posts.map((post) => (
                <Card key={post.id} className="flex flex-col bg-card overflow-hidden hover:shadow-lg transition-all">
                    {post.imageUrl && (
                        <div className="relative w-full h-64 bg-secondary/20">
                            <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="font-headline">{post.title}</CardTitle>
                        {post.createdAt && (
                            <CardDescription>
                                {post.createdAt.toDate().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
          <Card className="bg-card col-span-full max-w-2xl mx-auto w-full">
              <CardContent className="p-6 text-center flex flex-col items-center gap-4">
                  <Newspaper className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">अभी कोई पोस्ट उपलब्ध नहीं है। जल्द ही नई जानकारी जोड़ी जाएगी!</p>
              </CardContent>
          </Card>
      )}
    </div>
  );
}
