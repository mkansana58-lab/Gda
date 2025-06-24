'use client';

import { Separator } from "@/components/ui/separator";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

interface CertificateProps {
  studentName: string;
  studentClass: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  performanceStatus: 'पास' | 'औसत' | 'फेल';
}

const directorPhoto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAH0AeoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1VZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA-allt';

export function TestResultCertificate({
  studentName,
  studentClass,
  subject,
  score,
  totalQuestions,
  percentage,
  performanceStatus,
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
    <div className="w-full max-w-3xl bg-slate-50 shadow-2xl rounded-lg border-4 border-blue-900 p-2 font-body mx-auto">
      <div className="w-full h-full border-2 border-blue-600 p-4 sm:p-6 relative flex flex-col bg-white">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ShieldCheck className="w-48 h-48 sm:w-64 sm:h-64 text-gray-100 opacity-60" />
        </div>

        {/* Header */}
        <div className="text-center z-10 relative">
            <h1 className="text-3xl sm:text-4xl font-bold font-headline text-blue-900">गो स्वामी डिफेंस एकेडमी</h1>
            <p className="font-semibold text-blue-800/90 mt-1">"राष्ट्र प्रथम, शिक्षा सर्वोपरि"</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">खड़गपुर, धौलपुर (राज.) - 328023</p>
        </div>

        {/* Title */}
        <div className="text-center my-4 sm:my-6 z-10 relative">
            <p className="text-xl sm:text-2xl font-bold tracking-widest text-gray-800">AI टेस्ट प्रदर्शन प्रमाण पत्र</p>
            <p className="text-sm sm:text-base text-gray-500 mt-1 uppercase">Certificate of Achievement</p>
        </div>

        {/* Main Content */}
        <div className="text-center my-4 flex-grow z-10 relative">
            <p className="text-base sm:text-lg text-gray-800">यह प्रमाणित किया जाता है कि</p>
            <p className="text-4xl sm:text-5xl font-bold font-headline text-blue-800 my-2 sm:my-3 break-words">{studentName}</p>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                कक्षा <strong className="font-semibold">{studentClass}</strong> ने <strong className="font-semibold">{subject}</strong> विषय के मॉक टेस्ट में सफलतापूर्वक भाग लिया।
            </p>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center my-4 sm:my-6 z-10 relative">
            <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{score}/{totalQuestions}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">अंक (Score)</p>
            </div>
            <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{percentage.toFixed(2)}%</p>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">प्रतिशत (Percentage)</p>
            </div>
            <div>
                <p className={`text-xl sm:text-2xl font-bold ${statusInfo.color}`}>{statusInfo.text}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">परिणाम (Result)</p>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 sm:pt-6 flex justify-between items-end z-10 relative">
            <div className="text-center">
                <p className="font-semibold text-sm sm:text-base">{currentDate}</p>
                <Separator className="my-1 bg-gray-400"/>
                <p className="text-xs sm:text-sm text-muted-foreground">दिनांक (Date)</p>
            </div>
            <div className="text-center">
                <p className="font-signature text-3xl sm:text-4xl text-slate-800 -mb-2">Lokesh Goswami</p>
                <Separator className="my-1 bg-gray-400"/>
                <p className="text-xs sm:text-sm text-muted-foreground">निदेशक (Director)</p>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
                <div className="w-full h-full rounded-full bg-blue-100 border-4 border-double border-blue-700 flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-blue-700 opacity-80" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
