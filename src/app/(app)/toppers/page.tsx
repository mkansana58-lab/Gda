'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, User, BookCopy, Shield, Award } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MockTopper {
  name: string;
  class: '6' | '9';
  percentage: number;
  date: string;
  photo: string;
  hint: string;
  testMode: 'sainik' | 'rms';
}

interface SubjectTopper {
  name: string;
  class: string;
  exam: string;
  subject: string;
  score: number;
  totalMarks: number;
  date: string;
  photo: string;
  hint: string;
}

export default function ToppersPage() {
  const [sainikToppers, setSainikToppers] = useState<MockTopper[]>([]);
  const [rmsToppers, setRmsToppers] = useState<MockTopper[]>([]);
  const [subjectToppers, setSubjectToppers] = useState<SubjectTopper[]>([]);
  
  useEffect(() => {
    const storedSainik = localStorage.getItem('sainik-school-overall-toppers');
    if (storedSainik) setSainikToppers(JSON.parse(storedSainik));

    const storedRms = localStorage.getItem('rms-school-overall-toppers');
    if (storedRms) setRmsToppers(JSON.parse(storedRms));
    
    const storedSubject = localStorage.getItem('subject-wise-toppers');
    if (storedSubject) setSubjectToppers(JSON.parse(storedSubject));
  }, []);
  
  const topSainik6 = sainikToppers.filter(t => t.class === '6').slice(0, 5);
  const topSainik9 = sainikToppers.filter(t => t.class === '9').slice(0, 5);
  const topRms6 = rmsToppers.filter(t => t.class === '6').slice(0, 5);
  const topRms9 = rmsToppers.filter(t => t.class === '9').slice(0, 5);
  
  const renderMockTopperList = (toppers: MockTopper[]) => (
      <div className="space-y-4">
          {toppers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">इस श्रेणी में अभी तक कोई टॉपर नहीं है।</p>
          ) : (
              toppers.map((topper, index) => (
                  <Card key={index} className="flex items-center p-4 gap-4 hover:bg-muted/50 transition-colors">
                      <span className={`text-2xl font-bold w-8 text-center ${index < 3 ? 'text-primary' : 'text-muted-foreground'}`}>{index + 1}</span>
                      <Avatar className="w-12 h-12">
                          <AvatarImage src={topper.photo} alt={topper.name} data-ai-hint={topper.hint}/>
                          <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                          <p className="font-bold">{topper.name}</p>
                          <p className="text-sm text-muted-foreground">कक्षा {topper.class}</p>
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

  const renderSubjectToppers = (toppers: SubjectTopper[]) => (
     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {toppers.length === 0 ? (
                 <p className="text-muted-foreground text-center py-4 col-span-full">इस श्रेणी में अभी तक कोई टॉपर नहीं है।</p>
            ) : (
                toppers.map((topper, index) => (
                    <Card key={index} className="flex flex-col items-center text-center p-4 hover:shadow-lg hover:border-primary/50 transition-all">
                        <CardHeader className="p-2">
                             <CardTitle className="font-headline text-lg">{topper.subject}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 flex flex-col items-center">
                            <Avatar className="w-20 h-20 mb-3 border-2 border-primary/20">
                                <AvatarImage src={topper.photo} alt={topper.name} data-ai-hint={topper.hint}/>
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{topper.name}</p>
                            <p className="text-sm text-muted-foreground">{topper.class} | {topper.exam}</p>
                            <p className="text-primary font-bold text-xl mt-1">{topper.score}/{topper.totalMarks}</p>
                            <p className="text-xs text-muted-foreground">अंक</p>
                        </CardContent>
                    </Card>
                ))
            )}
     </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">हॉल ऑफ फेम / टॉपर्स</h1>
        <p className="text-muted-foreground">हमारे मॉक टेस्ट और प्रैक्टिस टेस्ट के शीर्ष प्रदर्शन करने वालों का जश्न।</p>
      </div>

       <Alert>
        <Crown className="h-4 w-4" />
        <AlertTitle>टेस्ट टॉपर्स!</AlertTitle>
        <AlertDescription>
          यह सूची हमारे मॉक टेस्ट और प्रैक्टिस टेस्ट में शीर्ष प्रदर्शन करने वालों को दिखाती है।
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="mock-test" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mock-test">मॉक टेस्ट टॉपर्स</TabsTrigger>
          <TabsTrigger value="subject">विषय-वार टॉपर्स</TabsTrigger>
        </TabsList>
        <TabsContent value="mock-test" className="mt-6">
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Shield /> सैनिक स्कूल टॉपर्स</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card><CardHeader><CardTitle>कक्षा 6 चैंपियंस</CardTitle></CardHeader><CardContent>{renderMockTopperList(topSainik6)}</CardContent></Card>
                        <Card><CardHeader><CardTitle>कक्षा 9 चैंपियंस</CardTitle></CardHeader><CardContent>{renderMockTopperList(topSainik9)}</CardContent></Card>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Award /> RMS टॉपर्स</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card><CardHeader><CardTitle>कक्षा 6 चैंपियंस</CardTitle></CardHeader><CardContent>{renderMockTopperList(topRms6)}</CardContent></Card>
                        <Card><CardHeader><CardTitle>कक्षा 9 चैंपियंस</CardTitle></CardHeader><CardContent>{renderMockTopperList(topRms9)}</CardContent></Card>
                    </div>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="subject" className="mt-6">
             {renderSubjectToppers(subjectToppers)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
