
'use client';

import { Logo } from './logo';
import { Separator } from './ui/separator';
import type { ScholarshipData } from '@/app/(app)/plan-form/page';
import Image from 'next/image';

interface CertificateProps {
  data: ScholarshipData;
  applicationNo: string;
}

export function ScholarshipCertificate({ data, applicationNo }: CertificateProps) {
  const currentDate = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="border-2 border-black p-4 font-sans space-y-3 bg-white text-black">
        <header className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-3">
                <Logo className="h-16 w-16 bg-white border-primary text-primary" />
                <div>
                    <h1 className="text-xl font-extrabold text-black">गो स्वामी डिफेंस एकेडमी</h1>
                    <p className="text-xs font-semibold">"राष्ट्र प्रथम, शिक्षा सर्वोपरि"</p>
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-base font-bold bg-black text-white px-2 py-1">आवेदन का प्रमाण</h2>
                <p className="text-sm font-semibold">Application Confirmation</p>
            </div>
        </header>

        <main className="grid grid-cols-12 gap-4">
            <div className="col-span-8 space-y-2">
                <p className="text-center text-sm font-semibold">छात्रवृत्ति आवेदन सफलतापूर्वक जमा किया गया</p>
                <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm border p-2">
                    <p className="font-semibold">आवेदन क्रमांक:</p>
                    <p className="font-bold">{applicationNo}</p>

                    <p className="font-semibold">अभ्यर्थी का नाम:</p>
                    <p className="font-bold">{data.name}</p>

                    <p className="font-semibold">पिता का नाम:</p>
                    <p className="font-bold">{data.fatherName}</p>

                    <p className="font-semibold">कक्षा:</p>
                    <p className="font-bold">{data.class}</p>

                    <p className="font-semibold">स्कूल:</p>
                    <p className="font-bold">{data.school}</p>

                    <p className="font-semibold">आवेदन तिथि:</p>
                    <p className="font-bold">{currentDate}</p>
                </div>
            </div>
            <div className="col-span-4 flex flex-col items-center gap-2">
                <div className="w-full h-auto aspect-[3/4] border-2 border-black flex items-center justify-center bg-gray-100 relative overflow-hidden">
                    <Image src={data.photoDataUrl} alt={data.name} fill className="object-cover" />
                </div>
                <div className="w-full h-10 border-2 border-black relative overflow-hidden bg-white flex items-center justify-center">
                    <Image src={data.signatureDataUrl} alt="Signature" fill className="object-contain p-1" />
                </div>
            </div>
        </main>
        
        <Separator className="bg-black my-2" />

        <div className="space-y-3">
             <div>
                <p className="text-sm font-bold underline">आगे क्या करें:</p>
                <ul className="list-disc list-inside text-xs space-y-1 pl-4">
                    <li>अपना आवेदन क्रमांक <strong>({applicationNo})</strong> सुरक्षित रखें।</li>
                    <li>₹50 के आवेदन शुल्क का भुगतान करने के बाद आपको एक यूनिक ID प्रदान की जाएगी।</li>
                    <li>आपके एडमिट कार्ड परीक्षा से कुछ दिन पहले ऐप पर उपलब्ध होंगे।</li>
                    <li>आप 'एडमिट कार्ड' सेक्शन में जाकर अपना आवेदन क्रमांक और यूनिक ID डालकर एडमिट कार्ड डाउनलोड कर सकते हैं।</li>
                </ul>
            </div>
        </div>

        <footer className="text-center pt-2">
            <p className="text-xs font-semibold">यह एक कंप्यूटर जनित रसीद है।</p>
        </footer>
    </div>
  );
}
