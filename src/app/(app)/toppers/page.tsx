'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Topper {
  name: string;
  score: number;
  subject: string;
  date: string;
  photo: string;
  hint: string;
}

export default function ToppersPage() {
  const [toppers, setToppers] = useState<Topper[]>([]);

  useEffect(() => {
    const storedToppers = localStorage.getItem('ai-test-toppers');
    if (storedToppers) {
      setToppers(JSON.parse(storedToppers));
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">हॉल ऑफ फेम / टॉपर्स</h1>
        <p className="text-muted-foreground">AI टेस्ट और परीक्षाओं से हमारे शीर्ष उपलब्धि हासिल करने वालों का जश्न।</p>
      </div>

       <Alert>
        <Crown className="h-4 w-4" />
        <AlertTitle>AI टेस्ट टॉपर्स!</AlertTitle>
        <AlertDescription>
          यह सूची हमारे AI-संचालित अभ्यास परीक्षणों के शीर्ष 5 प्रदर्शन करने वालों को दिखाती है। लीडरबोर्ड पर आने के लिए एक परीक्षा दें!
        </AlertDescription>
      </Alert>

      {toppers.length === 0 ? (
         <Card>
            <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">AI टेस्ट के टॉपर्स अभी यहाँ नहीं हैं। पहले टॉपर बनें!</p>
            </CardContent>
         </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {toppers.map((topper, index) => (
            <Card key={`${topper.name}-${index}`} className="relative overflow-hidden">
                {index < 3 && (
                    <Crown className={`absolute -top-4 -right-4 w-16 h-16 opacity-10 ${
                        index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-400' : 'text-amber-600'
                    }`} />
                )}
                <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                    <AvatarImage src={topper.photo} alt={topper.name} data-ai-hint={topper.hint} />
                    <AvatarFallback>{topper.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-headline">{topper.name}</h3>
                <p className="text-muted-foreground">{topper.subject}</p>
                <p className="text-2xl font-bold text-primary mt-2">स्कोर: {topper.score}/25</p>
                <p className="text-xs text-muted-foreground mt-1">
                    {new Date(topper.date).toLocaleDateString()}
                </p>
                </CardContent>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}
