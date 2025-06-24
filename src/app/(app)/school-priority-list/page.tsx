
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef } from 'react';
import { Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SchoolPriorityListDocument } from '@/components/school-priority-list-document';

const formSchema = z.object({
  applicationNo: z.string().regex(/^\d+$/, 'कृपया केवल अंक दर्ज करें।').min(1, 'आवेदन संख्या आवश्यक है।'),
  candidateName: z.string().min(2, 'नाम कम से कम 2 अक्षरों का होना चाहिए।'),
  fatherName: z.string().min(2, 'पिता का नाम कम से कम 2 अक्षरों का होना चाहिए।'),
  category: z.string().min(1, 'श्रेणी आवश्यक है।'),
  gender: z.enum(['Male', 'Female'], { required_error: 'लिंग चुनना आवश्यक है।' }),
  domicile: z.string().min(2, 'राज्य का नाम आवश्यक है।'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SchoolPriorityListPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const { toast } = useToast();
  const documentRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationNo: '',
      candidateName: '',
      fatherName: '',
      category: 'OBC-NCL (Central List)',
      gender: 'Male',
      domicile: 'RAJASTHAN',
    },
  });

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    setTimeout(() => {
      setSubmittedData(values);
      setIsLoading(false);
      toast({
        title: 'सूची तैयार है!',
        description: 'आपकी स्कूल प्राथमिकता सूची नीचे उत्पन्न हो गई है।',
      });
    }, 500);
  }

  const handleDownload = () => {
    if (documentRef.current) {
      toast({ title: 'दस्तावेज़ डाउनलोड हो रहा है...', description: 'कृपया प्रतीक्षा करें।' });
      html2canvas(documentRef.current, { scale: 2.5 }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `sainik-school-priority-list-${submittedData?.applicationNo}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({ title: 'दस्तावेज़ डाउनलोड किया गया', description: 'अपना डाउनलोड फ़ोल्डर देखें।' });
      });
    }
  };

  if (submittedData) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div ref={documentRef} className="p-4 bg-white w-full max-w-4xl">
           <SchoolPriorityListDocument data={submittedData} />
        </div>
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="font-headline text-center">अगले चरण</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-4">
                <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    सूची डाउनलोड करें
                </Button>
                <Button variant="outline" onClick={() => setSubmittedData(null)}>
                    एक और सूची बनाएं
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">स्कूल प्राथमिकता सूची</h1>
        <p className="text-muted-foreground">सैनिक स्कूल काउंसलिंग के लिए अपनी प्राथमिकता सूची बनाएं।</p>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">अपना विवरण भरें</CardTitle>
          <CardDescription>सूची बनाने के लिए नीचे दिए गए विवरण दर्ज करें।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="applicationNo" render={({ field }) => (
                      <FormItem><FormLabel>आवेदन संख्या</FormLabel><FormControl><Input placeholder="जैसे, 241810000001" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="candidateName" render={({ field }) => (
                      <FormItem><FormLabel>उम्मीदवार का नाम</FormLabel><FormControl><Input placeholder="जैसे, ARUN KUMAR" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="fatherName" render={({ field }) => (
                      <FormItem><FormLabel>पिता का नाम</FormLabel><FormControl><Input placeholder="जैसे, SURESH KUMAR" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem><FormLabel>श्रेणी</FormLabel><FormControl><Input placeholder="जैसे, OBC-NCL" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem><FormLabel>लिंग</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="एक लिंग चुनें" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                      <FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="domicile" render={({ field }) => (
                      <FormItem><FormLabel>अधिवास (राज्य)</FormLabel><FormControl><Input placeholder="जैसे, RAJASTHAN" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                सूची बनाएं
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
