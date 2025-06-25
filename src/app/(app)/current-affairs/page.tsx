'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentAffairs, GetCurrentAffairsOutput } from '@/ai/flows/get-current-affairs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Newspaper, BookText, Calendar, CalendarDays } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Period = 'today' | 'week' | 'month';

type CachedData = {
  data: GetCurrentAffairsOutput;
  timestamp: number;
};

const CACHE_DURATIONS: Record<Period, number> = {
  today: 1 * 60 * 60 * 1000, // 1 hour
  week: 6 * 60 * 60 * 1000, // 6 hours
  month: 12 * 60 * 60 * 1000, // 12 hours
};

export default function CurrentAffairsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<GetCurrentAffairsOutput | null>(null);
  const [activeTab, setActiveTab] = useState<Period>('today');
  const { toast } = useToast();

  const handleFetchAffairs = useCallback(async (period: Period) => {
    setIsLoading(true);
    setResult(null);

    const cacheKey = `current-affairs-${period}`;
    
    try {
      // Check for cached data
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached: CachedData = JSON.parse(cachedRaw);
        if (Date.now() - cached.timestamp < CACHE_DURATIONS[period]) {
          setResult(cached.data);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to read from cache", e);
      localStorage.removeItem(cacheKey); // Clear corrupted cache
    }

    try {
      const response = await getCurrentAffairs({ period });
      setResult(response);
      const cacheData: CachedData = { data: response, timestamp: Date.now() };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'त्रुटि',
        description: 'करेंट अफेयर्स लोड करने में विफल। सर्वर व्यस्त हो सकता है, कृपया पुनः प्रयास करें।',
      });
      // Try to serve stale data if available
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
          try {
              const cached: CachedData = JSON.parse(cachedRaw);
              setResult(cached.data);
              toast({
                  variant: 'default',
                  title: 'ऑफलाइन डेटा दिखाया जा रहा है',
                  description: 'यह जानकारी पुरानी हो सकती है। हम नवीनतम डेटा लाने में असमर्थ थे।',
              });
          } catch (err) {
              console.error("Failed to parse stale cache", err);
          }
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    handleFetchAffairs(activeTab);
  }, [activeTab, handleFetchAffairs]);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">AI करेंट अफेयर्स</h1>
        <p className="text-muted-foreground">
          नवीनतम राष्ट्रीय और अंतर्राष्ट्रीय घटनाओं से अपडेट रहें।
        </p>
      </div>
      
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>अवधि चुनें</CardTitle>
          <CardDescription>आप किस अवधि के लिए करेंट अफेयर्स देखना चाहते हैं?</CardDescription>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="today" onValueChange={(value) => setActiveTab(value as Period)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">
                    <Calendar className="mr-2 h-4 w-4" /> आज
                </TabsTrigger>
                <TabsTrigger value="week">
                    <CalendarDays className="mr-2 h-4 w-4" /> साप्ताहिक
                </TabsTrigger>
                <TabsTrigger value="month">
                    <BookText className="mr-2 h-4 w-4" /> मासिक
                </TabsTrigger>
              </TabsList>
            </Tabs>
        </CardContent>
      </Card>
      
      {isLoading && (
         <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">AI आपके लिए नवीनतम करेंट अफेयर्स ला रहा है...</p>
        </div>
      )}

      {result && !isLoading &&(
        <div className="animate-in fade-in space-y-4">
            {result.affairs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {result.affairs.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="bg-card border-b-0 rounded-lg mb-2 overflow-hidden">
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
            ) : (
                <Card className="bg-card">
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">इस अवधि के लिए कोई करेंट अफेयर्स नहीं मिला।</p>
                    </CardContent>
                </Card>
            )}
        </div>
      )}
    </div>
  );
}
