
'use client';

import { Separator } from './ui/separator';
import { Logo } from './logo';
import { Camera } from 'lucide-react';
import type { ScholarshipData } from '@/app/(app)/plan-form/page';
import Image from 'next/image';

interface AdmitCardProps {
  data: ScholarshipData;
  applicationNo: string;
}

export function AdmitCard({ data, applicationNo }: AdmitCardProps) {
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 10);
    const formattedExamDate = examDate.toLocaleDateString('hi-IN', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
    const examTime = "सुबह 10:00 बजे";
    const reportingTime = "सुबह 09:30 बजे";
    const examCenter = "गो स्वामी डिफेंस एकेडमी, खड़गपुर, धौलपुर (राज.)";

    const rollNoBase = parseInt(applicationNo, 10);
    const rollNo = (rollNoBase * 3 + 12345).toString().slice(0, 5);

  return (
    <div className="border-2 border-black p-4 font-sans space-y-3 bg-white text-black">
        <header className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
                <Logo className="h-16 w-16 bg-white border-primary text-primary" />
                <div>
                    <h1 className="text-xl font-extrabold text-black">गो स्वामी डिफेंस एकेडमी</h1>
                    <p className="text-xs font-semibold">"राष्ट्र प्रथम, शिक्षा सर्वोपरि"</p>
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-lg font-bold bg-black text-white px-2 py-1">ई-प्रवेश पत्र</h2>
                <p className="text-sm font-semibold">e-ADMIT CARD</p>
            </div>
        </header>

        <main className="grid grid-cols-12 gap-4">
            <div className="col-span-9 space-y-2">
                <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                    <p className="text-xs font-semibold">रोल नंबर:</p>
                    <p className="text-sm font-bold">{rollNo}</p>
                    
                    <p className="text-xs font-semibold">आवेदन क्रमांक:</p>
                    <p className="text-sm font-bold break-words">{applicationNo}</p>

                    <p className="text-xs font-semibold">अभ्यर्थी का नाम:</p>
                    <p className="text-sm font-bold break-words">{data.name}</p>

                    <p className="text-xs font-semibold">पिता का नाम:</p>
                    <p className="text-sm font-bold break-words">{data.fatherName}</p>

                    <p className="text-xs font-semibold">कक्षा:</p>
                    <p className="text-sm font-bold break-words">{data.class}</p>
                </div>
                <Separator className="bg-black"/>
                <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                    <p className="text-xs font-semibold">परीक्षा की तिथि और दिन:</p>
                    <p className="text-sm font-bold">{formattedExamDate}</p>

                     <p className="text-xs font-semibold">रिपोर्टिंग समय:</p>
                    <p className="text-sm font-bold">{reportingTime}</p>

                    <p className="text-xs font-semibold">परीक्षा का समय:</p>
                    <p className="text-sm font-bold">{examTime}</p>
                </div>
            </div>
            <div className="col-span-3 flex flex-col items-center">
                 <div className="w-full h-auto aspect-[3/4] border-2 border-black flex items-center justify-center bg-gray-100 relative overflow-hidden">
                    {data.photoDataUrl ? (
                        <Image src={data.photoDataUrl} alt={data.name} fill className="object-cover" />
                    ) : (
                        <div className="text-center text-gray-500 p-1">
                            <Camera className="mx-auto h-6 w-6"/>
                            <p className="text-[10px] mt-1 leading-tight">फोटो उपलब्ध नहीं</p>
                        </div>
                    )}
                </div>
                <div className="w-full mt-2 h-10 border-2 border-black relative overflow-hidden bg-white flex items-center justify-center">
                   {data.signatureDataUrl ? <Image src={data.signatureDataUrl} alt="Signature" fill className="object-contain" /> : <p className='text-gray-400 text-xs'>No Signature</p>}
                </div>
                <p className="text-[8px] text-center mt-1">अभ्यर्थी के हस्ताक्षर</p>
            </div>
        </main>
        
        <Separator className="bg-black my-2" />

        <div className="space-y-3">
             <div>
                <p className="text-sm font-bold underline">परीक्षा केंद्र का विवरण:</p>
                <p className="font-bold text-base pl-4">{examCenter}</p>
            </div>
            <div>
                <p className="text-sm font-bold underline">अभ्यर्थियों के लिए महत्वपूर्ण निर्देश:</p>
                <ul className="list-decimal list-inside text-xs space-y-1 pl-4">
                    <li>प्रवेश पत्र को परीक्षा केंद्र पर लाना अनिवार्य है।</li>
                    <li>कृपया रिपोर्टिंग समय पर परीक्षा केंद्र पर पहुंचें।</li>
                    <li>अपने साथ एक वैध फोटो पहचान पत्र (जैसे आधार कार्ड) अवश्य लाएं।</li>
                    <li>परीक्षा हॉल में किसी भी प्रकार के इलेक्ट्रॉनिक उपकरण लाना प्रतिबंधित है।</li>
                    <li>यह प्रवेश पत्र केवल छात्रवृत्ति परीक्षा के लिए मान्य है।</li>
                </ul>
            </div>
        </div>

        <footer className="text-center pt-2">
            <p className="text-xs font-semibold">यह एक कंप्यूटर जनित प्रवेश पत्र है।</p>
        </footer>
    </div>
  );
}
