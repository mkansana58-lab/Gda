
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Download, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { AdmitCard } from '@/components/admit-card';
import type { ScholarshipData } from '../plan-form/page';

const validUniqueIds: Record<string, string> = {
  '5': '0978',
  '6': '7059',
  '7': '123092',
  '8': '143789',
  '9': '0088',
};

export default function AdmitCardPage() {
  const [applicationNo, setApplicationNo] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admitCardData, setAdmitCardData] = useState<ScholarshipData | null>(null);
  
  const { toast } = useToast();
  const admitCardRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationNo || !uniqueId) {
      setError('कृपया आवेदन क्रमांक और यूनिक ID दोनों दर्ज करें।');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAdmitCardData(null);
    
    setTimeout(() => {
      try {
        const storedDataRaw = localStorage.getItem(`scholarship-application-${applicationNo}`);
        if (storedDataRaw) {
          const storedData: ScholarshipData = JSON.parse(storedDataRaw);
          const expectedUniqueId = validUniqueIds[storedData.class];

          if (expectedUniqueId && expectedUniqueId === uniqueId) {
            setAdmitCardData(storedData);
            toast({ title: 'एडमिट कार्ड मिल गया!', description: 'आपका एडमिट कार्ड नीचे प्रदर्शित है।' });
          } else {
             setError('यह यूनिक ID इस कक्षा के लिए अमान्य है।');
             toast({ variant: 'destructive', title: 'त्रुटि', description: 'अमान्य यूनिक ID।' });
          }
        } else {
          setError('यह आवेदन क्रमांक मौजूद नहीं है। कृपया दोबारा जांचें।');
          toast({ variant: 'destructive', title: 'त्रुटि', description: 'दिया गया आवेदन क्रमांक अमान्य है।' });
        }
      } catch (e) {
        setError('एडमिट कार्ड लोड करने में विफल।');
        toast({ variant: 'destructive', title: 'त्रुटि', description: 'एक अप्रत्याशित त्रुटि हुई।' });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleDownload = () => {
    if (admitCardRef.current) {
      toast({ title: 'एडमिट कार्ड डाउनलोड हो रहा है...', description: 'कृपया प्रतीक्षा करें।' });
      html2canvas(admitCardRef.current, { scale: 2.5, backgroundColor: '#ffffff' }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `admit-card-${applicationNo}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({ title: 'एडमिट कार्ड डाउनलोड किया गया', description: 'अपना डाउनलोड फ़ोल्डर देखें।' });
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="text-center">
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">एडमिट कार्ड डाउनलोड करें</h1>
        <p className="text-muted-foreground">छात्रवृत्ति परीक्षा के लिए अपना एडमिट कार्ड प्राप्त करें।</p>
      </div>

      {!admitCardData && (
        <Card className="w-full max-w-md bg-card">
          <form onSubmit={handleSearch}>
            <CardHeader>
              <CardTitle>अपना एडमिट कार्ड खोजें</CardTitle>
              <CardDescription>अपना आवेदन क्रमांक और भुगतान के बाद प्राप्त यूनिक ID दर्ज करें।</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Input
                type="text"
                placeholder="आवेदन क्रमांक दर्ज करें"
                value={applicationNo}
                onChange={(e) => setApplicationNo(e.target.value.replace(/\D/g, ''))}
                required
              />
              <Input
                type="text"
                placeholder="यूनिक ID दर्ज करें"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                required
              />
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                खोजें
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {admitCardData && (
        <div className="w-full max-w-4xl space-y-6 animate-in fade-in">
          <div ref={admitCardRef} className="bg-white text-black p-4">
            <AdmitCard data={admitCardData} applicationNo={applicationNo} />
          </div>
          <Card className="bg-card">
            <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownload} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                एडमिट कार्ड डाउनलोड करें
              </Button>
              <Button variant="outline" onClick={() => { setAdmitCardData(null); setApplicationNo(''); setUniqueId(''); }} className="w-full sm:w-auto">
                एक और खोजें
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
