'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  name: z.string().min(2, { message: 'नाम कम से कम 2 अक्षरों का होना चाहिए।' }),
  fatherName: z.string().min(2, { message: 'पिता का नाम कम से कम 2 अक्षरों का होना चाहिए।' }),
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
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      fatherName: '',
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
        fatherName: '',
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
    if (step === 1) fieldsToValidate = ['name', 'fatherName', 'mobile', 'email'];
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

    const applicationNo = (Math.floor(Math.random() * 90000) + 10000).toString();

    const subject = `छात्रवृत्ति आवेदन: ${values.name} - #${applicationNo}`;
    const body = `
        नया छात्रवृत्ति आवेदन प्राप्त हुआ है।

        आवेदन संख्या: ${applicationNo}

        --- व्यक्तिगत विवरण ---
        नाम: ${values.name}
        पिता का नाम: ${values.fatherName}
        मोबाइल: ${values.mobile}
        ईमेल: ${values.email}

        --- शैक्षणिक विवरण ---
        आयु: ${values.age}
        कक्षा: ${values.class}
        स्कूल: ${values.school}

        --- पते का विवरण ---
        गाँव/शहर: ${values.village}
        ज़िला: ${values.district}
        पिनकोड: ${values.pincode}
        राज्य: ${values.state}
    `.trim().replace(/^\s+/gm, '');

    const mailtoLink = `mailto:mohitkansana82@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    toast({
        title: "ईमेल ऐप खोला जा रहा है...",
        description: "कृपया अपना आवेदन भेजने के लिए अपने ईमेल क्लाइंट में 'Send' पर क्लिक करें।",
    });

    setTimeout(() => {
        setIsLoading(false);
        form.reset();
        setStep(1);
    }, 1000);
  }


  return (
    <div className="flex flex-col items-center gap-8 p-4">
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
                        <FormField control={form.control} name="fatherName" render={({ field }) => (
                          <FormItem><FormLabel>पिता का नाम</FormLabel><FormControl><Input placeholder="आपके पिता का नाम" {...field} /></FormControl><FormMessage /></FormItem>
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
                        ईमेल द्वारा आवेदन जमा करें
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
