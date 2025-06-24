'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useRef } from 'react';
import { Loader2, Mail, Download, Send } from 'lucide-react';
import { Certificate } from '@/components/certificate';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import html2canvas from 'html2canvas';

const formSchema = z.object({
  exam: z.string().min(1, { message: 'Please select an exam.' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(5, { message: 'Age must be at least 5.' }).max(25, { message: 'Age must be at most 25.' }),
  class: z.string().min(1, { message: 'Class is required.' }),
  school: z.string().min(3, { message: 'School name is required.' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ScholarshipFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const certificateRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      mobile: user?.mobile || '',
      email: user?.email || '',
      address: user?.address || '',
      exam: '',
      age: undefined,
      class: '',
      school: '',
    },
  });

  function onSubmit(values: FormValues) {
    setIsLoading(true);
    setTimeout(() => {
      setSubmittedData(values);
      setIsLoading(false);
      toast({
        title: 'आवेदन जमा हो गया!',
        description: 'आपका प्रमाणपत्र नीचे उत्पन्न हो गया है।',
      });
      
      // Add notification to localStorage
      const newNotification = {
        id: `scholarship-${Date.now()}`,
        icon: 'FilePen',
        title: 'छात्रवृत्ति आवेदन प्राप्त हुआ',
        description: `आपका ${values.exam} के लिए आवेदन सफलतापूर्वक जमा हो गया है।`,
        read: false,
        timestamp: new Date().toISOString(),
      };
      
      try {
        const storageKey = `user-notifications-${user?.email || 'guest'}`;
        const existingNotifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedNotifications = [newNotification, ...existingNotifications].slice(0, 20); // Keep last 20
        localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error("Could not save notification to localStorage", error);
      }
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
    `नया छात्रवृत्ति आवेदन:\n\nपरीक्षा: ${submittedData.exam}\nनाम: ${submittedData.name}\nआयु: ${submittedData.age}\nकक्षा: ${submittedData.class}\nस्कूल: ${submittedData.school}\nमोबाइल: ${submittedData.mobile}\nईमेल: ${submittedData.email}\nपता: ${submittedData.address}\n\n---\nकृपया प्रमाणपत्र संलग्न पाएं।`
  ) : '';

  if (submittedData) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div ref={certificateRef} className="p-4 bg-background">
          <Certificate data={submittedData} />
        </div>
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>अगले चरण</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                    कृपया अपना प्रमाणपत्र डाउनलोड करें, फिर अपना ईमेल ऐप खोलने के लिए 'सबमिट करें' पर क्लिक करें। आपको डाउनलोड की गई फ़ाइल को मैन्युअल रूप से संलग्न करना होगा।
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        प्रमाणपत्र डाउनलोड करें
                    </Button>
                    <Button asChild>
                        <a href={`mailto:mohitkansana82@gmail.com?subject=New Scholarship Application for ${submittedData.name}&body=${emailBody}`}>
                        <Send className="mr-2 h-4 w-4" />
                        सबमिट करें
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>

         <Button variant="link" onClick={() => setSubmittedData(null)}>एक और आवेदन जमा करें</Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">छात्रवृत्ति आवेदन पत्र</CardTitle>
        <CardDescription>छात्रवृत्ति योजना के लिए आवेदन करने के लिए फॉर्म भरें।</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="exam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>परीक्षा चुनें</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="एक परीक्षा चुनें" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sainik School">सैनिक स्कूल</SelectItem>
                      <SelectItem value="Military School">मिलिट्री स्कूल</SelectItem>
                      <SelectItem value="RMS">आरएमएस</SelectItem>
                      <SelectItem value="RIMC">आरआईएमसी</SelectItem>
                      <SelectItem value="JNV">जेएनवी</SelectItem>
                      <SelectItem value="RTSE">आरटीएसई</SelectItem>
                      <SelectItem value="Olympiad">ओलंपियाड</SelectItem>
                      <SelectItem value="Scholarship">छात्रवृत्ति</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>पूरा नाम</FormLabel>
                    <FormControl><Input placeholder="आपका पूरा नाम" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem>
                    <FormLabel>आयु</FormLabel>
                    <FormControl><Input type="number" placeholder="आपकी आयु" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="class" render={({ field }) => (
                  <FormItem>
                    <FormLabel>कक्षा</FormLabel>
                    <FormControl><Input placeholder="जैसे, 10वीं" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="school" render={({ field }) => (
                  <FormItem>
                    <FormLabel>स्कूल का नाम</FormLabel>
                    <FormControl><Input placeholder="आपके स्कूल का नाम" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="mobile" render={({ field }) => (
                  <FormItem>
                    <FormLabel>मोबाइल नंबर</FormLabel>
                    <FormControl><Input type="tel" placeholder="आपका मोबाइल नंबर" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>ईमेल पता</FormLabel>
                    <FormControl><Input type="email" placeholder="आपका ईमेल पता" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>पूरा पता</FormLabel>
                  <FormControl><Input placeholder="आपका पूरा पता" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              प्रमाणपत्र बनाएं
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
