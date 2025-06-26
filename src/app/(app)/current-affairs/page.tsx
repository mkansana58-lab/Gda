
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Newspaper } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AffairItem {
    id: string;
    title: string;
    description: string;
    category: string;
}

export default function CurrentAffairsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [affairs, setAffairs] = useState<AffairItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "currentAffairs"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const affairData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AffairItem));
        setAffairs(affairData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching current affairs:", error);
        toast({ variant: 'destructive', title: 'त्रुटि', description: 'करेंट अफेयर्स लोड करने में विफल।' });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">करेंट अफेयर्स</h1>
        <p className="text-muted-foreground">
          नवीनतम राष्ट्रीय और अंतर्राष्ट्रीय घटनाओं से अपडेट रहें।
        </p>
      </div>
      
      {isLoading ? (
         <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">नवीनतम करेंट अफेयर्स लोड हो रहे हैं...</p>
        </div>
      ) : affairs.length > 0 ? (
        <div className="animate-in fade-in space-y-4">
            <Accordion type="single" collapsible className="w-full">
                {affairs.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={item.id} className="bg-card border-b-0 rounded-lg mb-2 overflow-hidden">
                        <AccordionTrigger className="p-4 hover:no-underline">
                            <div className="flex items-center gap-4 text-left">
                                 <Newspaper className="h-5 w-5 text-primary flex-shrink-0"/>
                                 <span className="font-semibold">{item.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      ) : (
          <Card className="bg-card">
              <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">अभी कोई करेंट अफेयर्स उपलब्ध नहीं हैं।</p>
              </CardContent>
          </Card>
      )}
    </div>
  );
}
