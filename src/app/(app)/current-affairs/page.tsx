'use client';

import { useState, useEffect } from 'react';
import { getCurrentAffairs, GetCurrentAffairsOutput } from '@/ai/flows/get-current-affairs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Newspaper, BookText, Calendar, CalendarDays } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Period = 'today' | 'week' | 'month';

export default function CurrentAffairsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<GetCurrentAffairsOutput | null>(null);
  const [activeTab, setActiveTab] = useState<Period>('today');
  const { toast } = useToast();

  const handleFetchAffairs = async (period: Period) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getCurrentAffairs({ period });
      setResult(response);
    } catch (e: any) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'त्रुटि',
        description: e.message || 'करेंट अफेयर्स लोड करने में विफल। कृपया पुनः प्रयास करें।',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchAffairs(activeTab);
  }, [activeTab]);

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
