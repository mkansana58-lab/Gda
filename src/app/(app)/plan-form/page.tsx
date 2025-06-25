
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowLeft, ArrowRight, Download, CheckCircle, Upload, User, Signature } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import { Progress } from '@/components/ui/progress';
import { ScholarshipCertificate } from '@/components/scholarship-certificate';
import html2canvas from 'html2canvas';
import { addNotification } from '@/lib/notifications';
import Image from 'next/image';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, { message: 'नाम कम से कम 2 अक्षरों का होना चाहिए।' }),
  fatherName: z.string().min(2, { message: 'पिता का नाम कम से कम 2 अक्षरों का होना चाहिए।' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' }),
  email: z.string().email({ message: 'कृपया एक वैध ईमेल पता दर्ज करें।' }),
  age: z.coerce.number().min(5, { message: 'आयु कम से कम 5 वर्ष होनी चाहिए।' }).max(25, { message: 'आयु अधिकतम 25 वर्ष हो सकती है।' }),
  class: z.string().min(1, { message: 'कक्षा आवश्यक है।' }),
  school: z.string().min(3, { message: 'स्कूल का नाम आवश्यक है।' }),
  photo: z.any()
    .refine((files) => files?.length === 1, 'फोटो आवश्यक है।')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `अधिकतम फ़ाइल आकार 2MB है।`)
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), '.jpg, .png और .webp फ़ाइलें ही स्वीकार की जाती हैं।'),
  signature: z.any()
    .refine((files) => files?.length === 1, 'हस्ताक्षर आवश्यक है।')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `अधिकतम फ़ाइल आकार 2MB है।`)
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), '.jpg, .png और .webp फ़ाइलें ही स्वीकार की जाती हैं।'),
  village: z.string().min(3, { message: 'गाँव/शहर का नाम आवश्यक है।' }),
  district: z.string().min(3, { message: 'ज़िले का नाम आवश्यक है।' }),
  pincode: z.string().regex(/^\d{6}$/, { message: 'कृपया एक वैध 6-अंकीय पिनकोड दर्ज करें।' }),
  state: z.string().min(2, { message: 'राज्य का नाम आवश्यक है।' }),
});

type FormValues = z.infer<typeof formSchema>;
export type ScholarshipData = FormValues & { photoDataUrl: string; signatureDataUrl: string };

const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function ScholarshipFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submittedData, setSubmittedData] = useState<ScholarshipData | null>(null);
  const [applicationNo, setApplicationNo] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] =useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useUser();
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', fatherName: '', mobile: '', email: '', age: undefined, class: '', school: '', village: '', district: '', pincode: '', state: '' },
  });
  
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name, mobile: user.mobile, email: user.email, class: user.class,
        village: user.village, district: user.district, pincode: user.pincode, state: user.state,
        fatherName: '', age: undefined, school: '',
      });
    }
  }, [user, form]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ['name', 'fatherName', 'mobile', 'email'];
    else if (step === 2) fieldsToValidate = ['age', 'class', 'school'];
    else if (step === 3) fieldsToValidate = ['photo', 'signature'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(prev => prev + 1);
  };
  
  const handleBack = () => setStep(prev => prev - 1);

  const handleDownloadCertificate = () => {
    if (certificateRef.current) {
        toast({ title: 'प्रमाणपत्र डाउनलोड हो रहा है...', description: 'कृपया प्रतीक्षा करें।' });
        html2canvas(certificateRef.current, { scale: 2.5, backgroundColor: '#ffffff' }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `scholarship-certificate-${applicationNo}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({ title: 'प्रमाणपत्र डाउनलोड किया गया', description: 'अपना डाउनलोड फ़ोल्डर देखें।' });
        });
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const photoDataUrl = await readFileAsDataURL(values.photo[0]);
      const signatureDataUrl = await readFileAsDataURL(values.signature[0]);
      const appNo = Math.floor(10000 + Math.random() * 90000).toString();
      
      const finalData: ScholarshipData = { ...values, photoDataUrl, signatureDataUrl };

      localStorage.setItem(`scholarship-application-${appNo}`, JSON.stringify(finalData));

      addNotification(user?.email, {
        id: `app-${appNo}`,
        icon: 'FilePen',
        title: 'आवेदन सफलतापूर्वक जमा हुआ!',
        description: `आपका आवेदन क्रमांक ${appNo} है। इसे भविष्य के लिए सहेजें।`,
      });

      setApplicationNo(appNo);
      setSubmittedData(finalData);

      toast({ title: "आवेदन सफलतापूर्वक जमा हुआ!", description: "आपका आवेदन क्रमांक जेनरेट हो गया है।" });

    } catch (error) {
      toast({ variant: 'destructive', title: "एक त्रुटि हुई", description: "फ़ाइल अपलोड करने में विफल। कृपया पुनः प्रयास करें।" });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (submittedData) {
    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <div className="text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500"/>
                <h1 className="font-headline text-3xl font-bold mt-4">आवेदन सफलतापूर्वक जमा हुआ!</h1>
                <p className="text-muted-foreground">आपका आवेदन क्रमांक है:</p>
                <p className="text-2xl font-bold font-mono tracking-widest bg-secondary text-secondary-foreground rounded-md px-4 py-2 my-2 inline-block">{applicationNo}</p>
                <p className="max-w-md mx-auto text-muted-foreground">कृपया इस नंबर को भविष्य के संदर्भ के लिए सहेज लें। आप नीचे दिए गए बटन से अपने आवेदन का प्रमाण पत्र डाउनलोड कर सकते हैं।</p>
            </div>
            <div ref={certificateRef} className="p-4 bg-white text-black w-full max-w-4xl">
              <ScholarshipCertificate data={submittedData} applicationNo={applicationNo} />
            </div>
             <Card className="w-full max-w-2xl bg-card">
                <CardContent className="pt-6 flex flex-wrap justify-center gap-4">
                    <Button onClick={handleDownloadCertificate}><Download className="mr-2 h-4 w-4" />प्रमाण पत्र डाउनलोड करें</Button>
                    <Button variant="outline" onClick={() => { setSubmittedData(null); setStep(1); form.reset(); }}><ArrowLeft className="mr-2 h-4 w-4" />नया फॉर्म भरें</Button>
                </CardContent>
            </Card>
        </div>
    )
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
                <Progress value={(step / 4) * 100} className="w-full" />
                <p className="text-xs text-muted-foreground text-center mt-1">चरण {step} / 4</p>
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
                        <FormField
                          control={form.control}
                          name="photo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>पासपोर्ट आकार का फोटो</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/png, image/jpeg, image/webp"
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  onChange={(e) => {
                                    field.onChange(e.target.files);
                                    setPhotoPreview(
                                      e.target.files?.[0]
                                        ? URL.createObjectURL(e.target.files[0])
                                        : null
                                    );
                                  }}
                                />
                              </FormControl>
                              {photoPreview && (
                                <Image
                                  src={photoPreview}
                                  alt="Photo Preview"
                                  width={100}
                                  height={125}
                                  className="mt-2 rounded-md border p-1 aspect-[4/5] object-cover"
                                />
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="signature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>हस्ताक्षर</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/png, image/jpeg, image/webp"
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  onChange={(e) => {
                                    field.onChange(e.target.files);
                                    setSignaturePreview(
                                      e.target.files?.[0]
                                        ? URL.createObjectURL(e.target.files[0])
                                        : null
                                    );
                                  }}
                                />
                              </FormControl>
                              {signaturePreview && (
                                <Image
                                  src={signaturePreview}
                                  alt="Signature Preview"
                                  width={200}
                                  height={80}
                                  className="mt-2 rounded-md border p-1 bg-white"
                                />
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                   </div>
                )}
                {step === 4 && (
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

                    {step < 4 ? (
                        <Button type="button" onClick={handleNext}>
                          आगे <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    ) : (
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          आवेदन जमा करें
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
