'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Award } from "lucide-react";

interface CertificateProps {
  studentName: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  performanceStatus: 'पास' | 'औसत' | 'फेल';
}

export function TestResultCertificate({
  studentName,
  subject,
  score,
  totalQuestions,
  percentage,
  performanceStatus,
}: CertificateProps) {
  const currentDate = new Date().toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStatusColor = () => {
      switch (performanceStatus) {
          case 'पास': return 'text-green-600';
          case 'औसत': return 'text-yellow-600';
          case 'फेल': return 'text-red-600';
          default: return 'text-foreground';
      }
  }

  return (
    <Card className="w-full max-w-2xl border-2 border-blue-500/50 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/50">
        <CardContent className="p-8 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-5"></div>
            
            <div className="flex justify-between items-start mb-4">
                 <div className="text-left">
                    <p className="font-semibold text-sm">रजि. संख्या: {`GSDA-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-sm">दिनांक: {currentDate}</p>
                </div>
            </div>


            <div className="text-center mb-6">
                <div className="inline-block p-4 bg-blue-600 rounded-full mb-2 shadow-inner">
                    <ShieldCheck className="h-16 w-16 text-white" />
                </div>
                <h1 className="font-headline text-4xl font-bold text-blue-800 dark:text-blue-300">गो स्वामी डिफेंस एकेडमी</h1>
                <p className="text-muted-foreground font-semibold">"राष्ट्र प्रथम, शिक्षा सर्वोपरि"</p>
                <p className="text-xs text-muted-foreground mt-1">खड़गपुर, धौलपुर (राज.) - 328023</p>
            </div>
            
            <div className="text-center my-6">
                <h2 className="text-2xl font-headline font-semibold tracking-wider uppercase">AI टेस्ट प्रदर्शन प्रमाण पत्र</h2>
                <p className="mt-2 text-muted-foreground">यह प्रमाणित किया जाता है कि</p>
                <p className="text-4xl font-headline font-bold text-blue-700 dark:text-blue-400 my-4">{studentName}</p>
                <p className="text-center text-lg text-foreground/80 leading-relaxed">
                    ने <strong>{subject}</strong> विषय के AI अभ्यास परीक्षण में उत्कृष्ट प्रदर्शन किया है।
                </p>
            </div>
            
            <Separator className="my-6 bg-blue-200 dark:bg-blue-800" />

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-3xl font-bold">{score}/{totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">अंक</p>
                </div>
                <div>
                    <p className="text-3xl font-bold">{percentage.toFixed(2)}%</p>
                    <p className="text-sm text-muted-foreground">प्रतिशत</p>
                </div>
                <div>
                    <p className={`text-3xl font-bold ${getStatusColor()}`}>{performanceStatus}</p>
                    <p className="text-sm text-muted-foreground">परिणाम</p>
                </div>
            </div>

            <div className="mt-10 flex justify-between items-end">
                <div className="text-center">
                    <Award className="h-12 w-12 text-yellow-500 mx-auto" />
                </div>
                <div className="text-center">
                    <p className="font-signature font-bold text-3xl text-gray-800 dark:text-gray-300">Lokesh Goswami</p>
                    <Separator className="my-1 bg-foreground/50"/>
                    <p className="text-sm text-muted-foreground">निदेशक</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
