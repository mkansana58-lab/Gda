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
  performanceStatus: 'पास' | 'औसत' | 'फेल';
  subjectResults: {
    subject: string;
    score: number;
    totalMarks: number;
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
        return { text: 'औसत (Average)', color: 'text-amber-600' };
      case 'फेल':
        return { text: 'अनुत्तीर्ण (Failed)', color: 'text-red-600' };
      default:
        return { text: '', color: '' };
    }
  };

  const statusInfo = getStatusInfo();
  
  return (
    <div className="w-full max-w-4xl bg-slate-50 shadow-2xl rounded-lg border-4 border-blue-900 p-2 font-body mx-auto">
      <div className="w-full h-full border-2 border-blue-600 p-6 relative flex flex-col bg-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-10"></div>
        
        <div className="text-center z-10 relative mb-4">
            <h1 className="text-4xl font-bold font-headline text-blue-900">गो स्वामी डिफेंस एकेडमी</h1>
            <p className="font-semibold text-blue-800/90 mt-1">"राष्ट्र प्रथम, शिक्षा सर्वोपरि"</p>
            <p className="text-sm text-gray-600 mt-1">खड़गपुर, धौलपुर (राज.) - 328023</p>
        </div>

        <div className="text-center my-4 z-10 relative">
            <p className="text-2xl font-bold tracking-widest text-gray-800 uppercase">प्रदर्शन का प्रमाण पत्र</p>
            <p className="text-base text-gray-500 mt-1 uppercase">Certificate of Performance</p>
        </div>

        <div className="text-center my-4 z-10 relative">
            <p className="text-lg text-gray-800">यह प्रमाणित किया जाता है कि</p>
            <p className="text-5xl font-bold font-headline text-blue-800 my-3 break-words">{studentName}</p>
            <p className="text-lg text-gray-800 leading-relaxed">
                ने <strong>{subject}</strong> में सफलतापूर्वक भाग लिया है।
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 z-10 relative">
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-headline text-xl text-center mb-2 font-bold text-blue-900">कुल प्रदर्शन</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-3xl font-bold text-blue-900">{totalScore}/{totalPossibleMarks}</p>
                        <p className="text-xs text-gray-600 font-semibold mt-1">कुल अंक (Total Score)</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-blue-900">{percentage.toFixed(2)}%</p>
                        <p className="text-xs text-gray-600 font-semibold mt-1">प्रतिशत (Percentage)</p>
                    </div>
                    <div>
                        <p className={`text-2xl font-bold ${statusInfo.color}`}>{statusInfo.text}</p>
                        <p className="text-xs text-gray-600 font-semibold mt-1">परिणाम (Result)</p>
                    </div>
                </div>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200">
                 <h3 className="font-headline text-xl text-center mb-2 font-bold text-blue-900">विषयवार स्कोर</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>विषय</TableHead>
                            <TableHead className="text-right">अंक</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {subjectResults.map(res => (
                           <TableRow key={res.subject}>
                               <TableCell className="font-medium">{res.subject}</TableCell>
                               <TableCell className="text-right font-mono">{res.score} / {res.totalMarks}</TableCell>
                           </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </div>
        </div>

        <div className="mt-auto pt-6 flex justify-between items-end z-10 relative">
            <div className="text-center">
                <p className="font-semibold text-base">{currentDate}</p>
                <Separator className="my-1 bg-gray-400"/>
                <p className="text-sm text-muted-foreground">दिनांक (Date)</p>
            </div>
            <div className="w-24 h-24 relative">
                <div className="w-full h-full rounded-full bg-blue-100 border-4 border-double border-blue-700 flex items-center justify-center">
                    <ShieldCheck className="w-12 h-12 text-blue-700 opacity-80" />
                </div>
            </div>
            <div className="text-center">
                <p className="font-signature text-4xl text-slate-800 -mb-2">Lokesh Goswami</p>
                <Separator className="my-1 bg-gray-400"/>
                <p className="text-sm text-muted-foreground">निदेशक (Director)</p>
            </div>
        </div>
      </div>
    </div>
  );
}
