'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { Loader2, Download, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { Certificate } from '@/components/certificate';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import html2canvas from 'html2canvas';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  name: z.string().min(2, { message: 'नाम कम से कम 2 अक्षरों का होना चाहिए।' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' }),
  email: z.string().email({ message: 'कृपया एक वैध ईमेल पता दर्ज करें।' }),
  age: z.coerce.number().min(5, { message: 'आयु कम से कम 5 वर्ष होनी चाहिए।' }).max(25, { message: 'आयु अधिकतम 25 वर्ष हो सकती है।' }),
  class: z.string().min(1, { message: 'कक्षा आवश्यक है।' }),
  school: z.string().min(3, { message: 'स्कूल का नाम आवश्यक है।' }),
  village: z.string().min(3, { message: 'गाँव/शहर का नाम आवश्यक है।' }),
  district: z.string().min(3, { message: 'ज़िले का नाम आवश्यक है।' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'कृपया एक वैध 6-अंकीय पिनकोड दर्ज करें।' }),
  state: z.string().min(2, { message: 'राज्य का नाम आवश्यक है।' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ScholarshipFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { user } = useUser();
  const certificateRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      age: undefined,
      class: '',
      school: '',
      village: '',
      district: '',
      pincode: '',
      state: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        age: undefined,
        class: user.class,
        school: '',
        village: user.village,
        district: user.district,
        pincode: user.pincode,
        state: user.state,
      });
    }
  }, [user, form]);


  const handleNext = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ['name', 'mobile', 'email'];
    else if (step === 2) fieldsToValidate = ['age', 'class', 'school'];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    setTimeout(() => {
      setSubmittedData(values);
      setIsLoading(false);
      toast({
        title: 'आवेदन जमा हो गया!',
        description: 'आपका प्रमाणपत्र नीचे उत्पन्न हो गया है। इसे डाउनलोड करें और हमें ईमेल करें।',
      });
    }, 1000);
  }

  const handleDownload = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current, { backgroundColor: null, scale: 2 }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'scholarship-certificate.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast({ title: 'प्रमाणपत्र डाउनलोड किया गया' });
      });
    }
  };

  const emailBody = submittedData ? encodeURIComponent(
    `नया छात्रवृत्ति आवेदन:\n\nनाम: ${submittedData.name}\nमोबाइल: ${submittedData.mobile}\nईमेल: ${submittedData.email}\nआयु: ${submittedData.age}\nकक्षा: ${submittedData.class}\nस्कूल: ${submittedData.school}\nपता: ${submittedData.village}, ${submittedData.district}, ${submittedData.state} - ${submittedData.pincode}\n\n---\nप्रमाणपत्र संलग्न है।`
  ) : '';

  if (submittedData) {
    return (
      <div className="flex flex-col items-center gap-6 p-4 pb-24">
        <div ref={certificateRef} className="p-4 bg-card">
          <Certificate data={submittedData} />
        </div>
        <Card className="w-full max-w-2xl bg-card">
            <CardHeader>
                <CardTitle className="font-headline">अगले चरण</CardTitle>
                <CardDescription>
                  कृपया अपना प्रमाणपत्र डाउनलोड करें, फिर अपना ईमेल ऐप खोलने के लिए 'ईमेल द्वारा सबमिट करें' पर क्लिक करें। <strong className="text-destructive">आपको डाउनलोड की गई फ़ाइल को मैन्युअल रूप से संलग्न करना होगा।</strong>
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="flex flex-wrap justify-center gap-4">
                    <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        प्रमाणपत्र डाउनलोड करें
                    </Button>
                    <Button asChild>
                        <a href={`mailto:mohitkansana82@gmail.com?subject=New Scholarship Application for ${submittedData.name}&body=${emailBody}`}>
                        <Send className="mr-2 h-4 w-4" />
                        ईमेल द्वारा सबमिट करें
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
        <Button variant="link" onClick={() => { setSubmittedData(null); setStep(1); }}>एक और आवेदन जमा करें</Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
        <Card className="w-full max-w-2xl mx-auto bg-card">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">छात्रवृत्ति आवेदन पत्र</CardTitle>
            <CardDescription>
            आवेदन शुल्क ₹50 है। टेस्ट में अच्छे अंक लाने पर आपको एक माह की ट्यूशन फीस फ्री रहेगी।
            </CardDescription>
            <div className="pt-2">
                <Progress value={(step / 3) * 100} className="w-full" />
                <p className="text-xs text-muted-foreground text-center mt-1">चरण {step} / 3</p>
            </div>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in">
                        <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>पूरा नाम</FormLabel><FormControl><Input placeholder="आपका पूरा नाम" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem><FormLabel>मोबाइल नंबर</FormLabel><FormControl><Input type="tel" placeholder="आपका मोबाइल नंबर" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>ईमेल पता</FormLabel><FormControl><Input type="email" placeholder="आपका ईमेल पता" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="age" render={({ field }) => (
                            <FormItem><FormLabel>आयु</FormLabel><FormControl><Input type="number" placeholder="आपकी आयु" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="class" render={({ field }) => (
                            <FormItem><FormLabel>कक्षा</FormLabel><FormControl><Input placeholder="जैसे, 10वीं" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="school" render={({ field }) => (
                            <FormItem><FormLabel>स्कूल का नाम</FormLabel><FormControl><Input placeholder="आपके स्कूल का नाम" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in">
                        <FormField control={form.control} name="village" render={({ field }) => (
                            <FormItem><FormLabel>गाँव / कस्बा</FormLabel><FormControl><Input placeholder="आपके गाँव/कस्बे का नाम" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="district" render={({ field }) => (
                                <FormItem><FormLabel>ज़िला</FormLabel><FormControl><Input placeholder="आपके ज़िले का नाम" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="pincode" render={({ field }) => (
                                <FormItem><FormLabel>पिनकोड</FormLabel><FormControl><Input type="tel" placeholder="आपका पिनकोड" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem><FormLabel>राज्य</FormLabel><FormControl><Input placeholder="आपके राज्य का नाम" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                )}
                <CardFooter className="justify-between px-0">
                    <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>
                        <ArrowLeft className="mr-2 h-4 w-4"/> वापस
                    </Button>

                    {step < 3 ? (
                        <Button type="button" onClick={handleNext}>
                        आगे <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        प्रमाणपत्र बनाएं
                        </Button>
                    )}
                </CardFooter>
            </form>
            </Form>
        </CardContent>
        </Card>
    </div>
  );
}
