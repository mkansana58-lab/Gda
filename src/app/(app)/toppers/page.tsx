
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, User, ArrowLeft, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collectionGroup, query, orderBy, limit, onSnapshot, collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch mock test toppers
    const mockToppersQuery = query(
      collection(db, 'toppers', 'mock-test', 'users'), 
      orderBy('percentage', 'desc'), 
      limit(20)
    );
    const mockUnsubscribe = onSnapshot(mockToppersQuery, (snapshot) => {
        const toppersData = snapshot.docs.map(doc => doc.data() as MockTopper);
        setMockToppers(toppersData);
        setIsLoading(false);
    });

    // Fetch practice test toppers
    const practiceToppersQuery = query(
      collection(db, 'toppers', 'practice-test', 'users'), 
      orderBy('percentage', 'desc'), 
      limit(20)
    );
    const practiceUnsubscribe = onSnapshot(practiceToppersQuery, (snapshot) => {
        const toppersData = snapshot.docs.map(doc => doc.data() as PracticeTopper);
        setPracticeToppers(toppersData);
        setIsLoading(false);
    });

    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);

    return () => {
        mockUnsubscribe();
        practiceUnsubscribe();
    }
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
    <div className="min-h-screen bg-background text-foreground">
        <header className="p-4 border-b border-border flex justify-between items-center">
            <h1 className="font-headline text-xl sm:text-2xl font-bold tracking-tight">हॉल ऑफ फेम / टॉपर्स</h1>
            <Button asChild variant="outline">
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                    {isLoggedIn ? <Home className="mr-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                    {isLoggedIn ? "डैशबोर्ड" : "लॉगिन पर वापस"}
                </Link>
            </Button>
        </header>
        <main className="p-4 sm:p-6">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                <p className="text-muted-foreground text-center">हमारे मॉक टेस्ट और प्रैक्टिस टेस्ट के शीर्ष प्रदर्शन करने वालों का जश्न।</p>
                <Alert className="bg-card">
                    <Crown className="h-4 w-4" />
                    <AlertTitle>टेस्ट टॉपर्स!</AlertTitle>
                    <AlertDescription>
                    यह सूची हमारे विभिन्न टेस्ट में शीर्ष प्रदर्शन करने वालों को दिखाती है।
                    </AlertDescription>
                </Alert>
                
                 {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
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
                )}
            </div>
        </main>
    </div>
  );
}
