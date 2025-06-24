'use client';

import { Separator } from "@/components/ui/separator";
import { ShieldCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface CertificateProps {
  studentName: string;
  studentClass: string;
  subject: string;
  totalScore: number;
  totalPossibleMarks: number;
  percentage: number;
  performanceStatus: 'पास' | 'औसत' | 'फेल' | 'योग्य नहीं';
  subjectResults: {
    subject: string;
    score: number;
    totalMarks: number;
    isQualifying?: boolean;
    qualifyingStatus?: 'योग्य' | 'योग्य नहीं';
  }[];
}

export function TestResultCertificate({
  studentName,
  studentClass,
  subject,
  totalScore,
  totalPossibleMarks,
  percentage,
  performanceStatus,
  subjectResults,
}: CertificateProps) {
  const currentDate = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getStatusInfo = () => {
    switch (performanceStatus) {
      case 'पास':
        return { text: 'उत्तीर्ण (Pass)', color: 'text-green-600' };
      case 'औसत':
        return { text: 'औसत (Average)', color: 'text-yellow-600' };
      case 'फेल':
        return { text: 'अनुत्तीर्ण (Failed)', color: 'text-red-600' };
      case 'योग्य नहीं':
        return { text: 'योग्य नहीं (Not Qualified)', color: 'text-red-600' };
      default:
        return { text: '', color: '' };
    }
  };

  const statusInfo = getStatusInfo();
  
  return (
    <div className="w-full max-w-2xl bg-slate-50 shadow-2xl rounded-lg border-4 border-primary/20 p-2 font-body mx-auto">
      <div className="w-full h-full border-2 border-primary/50 p-4 sm:p-6 relative flex flex-col bg-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-10"></div>
        
        <div className="text-center z-10 relative mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">गो स्वामी डिफेंस एकेडमी</h1>
            <p className="font-semibold text-primary/90 mt-1 text-xs sm:text-sm">"राष्ट्र प्रथम, शिक्षा सर्वोपरि"</p>
        </div>

        <div className="text-center my-2 z-10 relative">
            <p className="text-lg sm:text-xl font-bold tracking-wider text-gray-800 uppercase">प्रदर्शन का प्रमाण पत्र</p>
            <p className="text-xs text-gray-500 uppercase">Certificate of Performance</p>
        </div>

        <div className="text-center my-4 z-10 relative">
            <p className="text-base text-gray-800">यह प्रमाणित किया जाता है कि</p>
            <p className="text-3xl sm:text-4xl font-bold font-headline text-primary my-2 break-words">{studentName}</p>
            <p className="text-base text-gray-800 leading-relaxed">
                ने <strong>{subject}</strong> में सफलतापूर्वक भाग लिया है।
            </p>
        </div>
        
        <div className="flex flex-col gap-4 my-4 z-10 relative">
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <h3 className="font-headline text-base sm:text-lg text-center mb-2 font-bold text-primary">कुल प्रदर्शन</h3>
                <div className="grid grid-cols-3 gap-1 text-center">
                    <div>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{totalScore}/{totalPossibleMarks}</p>
                        <p className="text-xs text-gray-600 font-semibold">कुल अंक (मेरिट)</p>
                    </div>
                    <div>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{percentage.toFixed(2)}%</p>
                        <p className="text-xs text-gray-600 font-semibold">प्रतिशत</p>
                    </div>
                    <div>
                        <p className={`text-lg sm:text-xl font-bold ${statusInfo.color}`}>{statusInfo.text}</p>
                        <p className="text-xs text-gray-600 font-semibold">परिणाम</p>
                    </div>
                </div>
            </div>
            {subjectResults.length > 1 && (
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <h3 className="font-headline text-base sm:text-lg text-center mb-2 font-bold text-primary">विषयवार स्कोर</h3>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead className="h-8 text-xs">विषय</TableHead>
                              <TableHead className="text-right h-8 text-xs">अंक / स्थिति</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjectResults.map(res => (
                            <TableRow key={res.subject}>
                                <TableCell className="font-medium py-1 text-xs sm:text-sm">{res.subject}</TableCell>
                                <TableCell className={`text-right font-mono py-1 text-xs sm:text-sm ${res.isQualifying ? (res.qualifyingStatus === 'योग्य' ? 'text-green-600' : 'text-red-600') : ''}`}>
                                    {res.isQualifying ? res.qualifyingStatus : `${res.score} / ${res.totalMarks}`}
                                </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                  </Table>
              </div>
            )}
        </div>

        <div className="mt-auto pt-4 flex justify-between items-end z-10 relative">
            <div className="text-center">
                <p className="font-semibold text-xs sm:text-sm">{currentDate}</p>
                <Separator className="my-1 bg-gray-400"/>
                <p className="text-xs text-muted-foreground">दिनांक</p>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                <div className="w-full h-full rounded-full bg-primary/10 border-4 border-double border-primary/70 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-primary opacity-80" />
                </div>
            </div>
            <div className="text-center">
                <p className="font-signature text-2xl sm:text-3xl text-slate-800 -mb-2">Lokesh Goswami</p>
                <Separator className="my-1 bg-gray-400"/>
                <p className="text-xs text-muted-foreground">निदेशक</p>
            </div>
        </div>
      </div>
    </div>
  );
}
