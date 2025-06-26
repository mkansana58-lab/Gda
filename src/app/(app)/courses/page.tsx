
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BookMarked, ArrowRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface Course {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
}

export default function CoursesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(coursesData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching courses:", error);
        toast({
            variant: 'destructive',
            title: 'कोर्स लोड करने में त्रुटि',
            description: 'डेटाबेस से कोर्स लोड करने की अनुमति नहीं है। कृपया अपने फायरबेस सुरक्षा नियमों की जांच करें।',
            duration: 7000,
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="text-center">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">हमारे कोर्स</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          सैनिक स्कूल, मिलिट्री स्कूल, NDA, और अन्य रक्षा परीक्षाओं के लिए विशेष रूप से डिज़ाइन किए गए हमारे पाठ्यक्रमों का अन्वेषण करें।
        </p>
      </div>
      
      {isLoading ? (
         <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">कोर्स लोड हो रहे हैं...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in">
            {courses.map((course) => (
                <Card key={course.id} className="flex flex-col bg-card overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all">
                    {course.imageUrl && (
                        <div className="relative w-full h-48">
                            <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="font-headline">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription>{course.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                        {course.link ? (
                            <Button asChild className="w-full">
                                <Link href={course.link} target="_blank" rel="noopener noreferrer">
                                    और जानें <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                             <Button className="w-full" disabled>
                                जल्द आ रहा है
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : (
          <Card className="bg-card col-span-full">
              <CardContent className="p-6 text-center flex flex-col items-center gap-4">
                  <BookMarked className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">अभी कोई कोर्स उपलब्ध नहीं है। जल्द ही नए कोर्स जोड़े जाएंगे!</p>
              </CardContent>
          </Card>
      )}
    </div>
  );
}
