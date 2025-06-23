'use client';

import { Separator } from "@/components/ui/separator";
import { Award, User } from "lucide-react";

interface CertificateProps {
  studentName: string;
  studentClass: string;
  subject: string;
  score: number;
  totalQuestions: number;
  performanceStatus: 'पास' | 'औसत' | 'फेल';
}

export function TestResultCertificate({
  studentName,
  studentClass,
  subject,
  score,
  totalQuestions,
  performanceStatus,
}: CertificateProps) {
  const currentDate = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const getStatusInfo = () => {
    switch (performanceStatus) {
      case 'पास':
        return {
          text: 'Pass (उत्तीर्ण)',
          color: 'text-green-600',
          suggestion: 'बहुत बढ़िया! अपनी तैयारी जारी रखें और सफलता प्राप्त करें।',
        };
      case 'औसत':
        return {
          text: 'Average (औसत)',
          color: 'text-yellow-600',
          suggestion: 'अच्छा प्रयास! थोड़ी और मेहनत से आप और बेहतर कर सकते हैं।',
        };
      case 'फेल':
        return {
          text: 'Failed (अनुत्तीर्ण)',
          color: 'text-red-600',
          suggestion: 'कोई बात नहीं! और अधिक मेहनत करें और फिर से प्रयास करें।',
        };
      default:
        return { text: '', color: '', suggestion: '' };
    }
  };

  const statusInfo = getStatusInfo();
  
  return (
    <div className="w-full max-w-3xl bg-slate-50 shadow-2xl rounded-lg overflow-hidden flex font-body">
      <div className="w-20 bg-blue-800"></div>
      <div className="flex-1 p-6 relative flex flex-col">
        {/* Seal */}
        <div className="absolute top-8 right-8 w-28 h-28 border-2 border-dashed border-blue-700 rounded-full flex items-center justify-center opacity-60">
            <div className="text-center text-blue-800 font-bold text-xs">
                <p>गो स्वामी</p>
                <p>डिफेंस</p>
                <p>अकादमी</p>
            </div>
        </div>
        
        {/* Header */}
        <div className="flex items-center gap-4 text-blue-900 mb-6">
            <User className="h-12 w-12"/>
            <div>
                <h1 className="text-3xl font-bold font-headline">गो स्वामी डिफेंस अकादमी</h1>
                <p className="text-sm font-semibold">खड़गपुर, धौलपुर (राज.) - 328023</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="text-center my-4 flex-grow">
            <p className="text-lg">प्रमाणित किया जाता है कि</p>
            <p className="text-5xl font-bold font-headline text-blue-800 my-3">{studentName}</p>
            <p className="text-lg">
                ने <strong>{subject} मॉक टेस्ट</strong> (कक्षा {studentClass}) में
            </p>
            <p className="text-lg">
                <strong>{totalQuestions}</strong> में से <strong>{score}</strong> अंक प्राप्त कर पूर्ण किया है।
            </p>
            <p className={`text-2xl font-bold mt-4 ${statusInfo.color}`}>{statusInfo.text}</p>
            <p className="text-sm text-muted-foreground mt-1">{statusInfo.suggestion}</p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 flex justify-between items-end text-sm">
            <div>
                <p className="font-semibold">{currentDate}</p>
                <Separator className="my-1 bg-gray-400"/>
                <p className="text-muted-foreground">जारी करने की तिथि</p>
            </div>
            <div>
                 <p className="font-signature text-4xl text-slate-800 -mb-2">Lokesh Goswami</p>
                <Separator className="my-1 bg-gray-400"/>
                <p className="text-center text-muted-foreground">हस्ताक्षर (निदेशक)</p>
            </div>
        </div>
      </div>
    </div>
  );
}
