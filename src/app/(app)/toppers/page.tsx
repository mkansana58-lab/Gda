'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MockTopper {
  name: string;
  class: string;
  percentage: number;
  date: string;
  photo: string;
  hint: string;
  testMode: 'sainik' | 'rms' | 'jnv';
}

interface PracticeTopper {
    name: string;
    class: string;
    percentage: number;
    date: string;
    photo: string;
    hint: string;
    testMode: 'olympiad' | 'rtse' | 'devnarayan';
    subject: string;
}

export default function ToppersPage() {
  const [mockToppers, setMockToppers] = useState<MockTopper[]>([]);
  const [practiceToppers, setPracticeToppers] = useState<PracticeTopper[]>([]);
  
  useEffect(() => {
    const storedMock = localStorage.getItem('mock-test-toppers');
    if (storedMock) setMockToppers(JSON.parse(storedMock));
    
    const storedPractice = localStorage.getItem('practice-test-toppers');
    if (storedPractice) setPracticeToppers(JSON.parse(storedPractice));
  }, []);
  
  const renderMockTopperList = (toppers: MockTopper[]) => (
      <div className="space-y-4">
          {toppers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">इस श्रेणी में अभी तक कोई टॉपर नहीं है।</p>
          ) : (
              toppers.map((topper, index) => (
                  <Card key={index} className="flex items-center p-3 gap-4 hover:bg-card/80 transition-colors bg-card">
                      <span className={`text-2xl font-bold w-8 text-center ${index < 3 ? 'text-primary' : 'text-muted-foreground'}`}>{index + 1}</span>
                      <Avatar className="w-12 h-12">
                          <AvatarImage src={topper.photo} alt={topper.name} data-ai-hint={topper.hint}/>
                          <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                          <p className="font-bold">{topper.name}</p>
                          <p className="text-sm text-muted-foreground">कक्षा {topper.class} ({topper.testMode.toUpperCase()})</p>
                      </div>
                      <div className="text-right">
                          <p className="text-lg font-bold text-primary">{topper.percentage.toFixed(2)}%</p>
                          <p className="text-xs text-muted-foreground">प्रतिशत</p>
                      </div>
                  </Card>
              ))
          )}
      </div>
  );

  const renderPracticeToppers = (toppers: PracticeTopper[]) => (
     <div className="grid gap-4 md:grid-cols-2">
            {toppers.length === 0 ? (
                 <p className="text-muted-foreground text-center py-4 col-span-full">इस श्रेणी में अभी तक कोई टॉपर नहीं है।</p>
            ) : (
                toppers.map((topper, index) => (
                    <Card key={index} className="flex flex-col items-center text-center p-4 hover:shadow-lg hover:border-primary/50 transition-all bg-card">
                        <CardHeader className="p-2">
                             <CardTitle className="font-headline text-lg">{topper.testMode.toUpperCase()} - {topper.subject}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 flex flex-col items-center">
                            <Avatar className="w-20 h-20 mb-3 border-2 border-primary/20">
                                <AvatarImage src={topper.photo} alt={topper.name} data-ai-hint={topper.hint}/>
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{topper.name}</p>
                            <p className="text-sm text-muted-foreground">कक्षा {topper.class}</p>
                            <p className="text-primary font-bold text-xl mt-1">{topper.percentage.toFixed(2)}%</p>
                            <p className="text-xs text-muted-foreground">अंक</p>
                        </CardContent>
                    </Card>
                ))
            )}
     </div>
  );

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">हॉल ऑफ फेम / टॉपर्स</h1>
        <p className="text-muted-foreground">हमारे मॉक टेस्ट और प्रैक्टिस टेस्ट के शीर्ष प्रदर्शन करने वालों का जश्न।</p>
      </div>

       <Alert className="bg-card">
        <Crown className="h-4 w-4" />
        <AlertTitle>टेस्ट टॉपर्स!</AlertTitle>
        <AlertDescription>
          यह सूची हमारे विभिन्न टेस्ट में शीर्ष प्रदर्शन करने वालों को दिखाती है।
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="mock-test" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card">
          <TabsTrigger value="mock-test">मॉक टेस्ट टॉपर्स</TabsTrigger>
          <TabsTrigger value="practice-test">प्रैक्टिस टेस्ट टॉपर्स</TabsTrigger>
        </TabsList>
        <TabsContent value="mock-test" className="mt-6">
             {renderMockTopperList(mockToppers)}
        </TabsContent>
        <TabsContent value="practice-test" className="mt-6">
             {renderPracticeToppers(practiceToppers)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
