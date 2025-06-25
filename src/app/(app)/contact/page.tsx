
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'नाम आवश्यक है।' }),
  email: z.string().email({ message: 'कृपया एक वैध ईमेल पता दर्ज करें।' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' }),
  message: z.string().min(10, { message: 'संदेश कम से कम 10 अक्षरों का होना चाहिए।' }),
});

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', mobile: '', message: '' },
  });

  const handleEmailSubmit = (values: z.infer<typeof contactFormSchema>) => {
    const subject = `Inquiry from ${values.name}`;
    const body = `
      Name: ${values.name}
      Email: ${values.email}
      Mobile: ${values.mobile}

      Message:
      ${values.message}
    `.trim().replace(/^\s+/gm, '');

    const mailtoLink = `mailto:mohitkansana82@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    toast({ title: "ईमेल ऐप खोला जा रहा है...", description: "अपना संदेश भेजने के लिए 'Send' पर क्लिक करें।" });
  };
  
  const handleSmsSubmit = (values: z.infer<typeof contactFormSchema>) => {
    const body = `
      Inquiry from ${values.name}
      Mobile: ${values.mobile}
      Message: ${values.message}
    `.trim().replace(/^\s+/gm, '');
    
    const smsLink = `sms:9694251069?body=${encodeURIComponent(body)}`;
    window.location.href = smsLink;
    toast({ title: "SMS ऐप खोला जा रहा है...", description: "अपना संदेश भेजने के लिए 'Send' पर क्लिक करें।" });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">हमसे संपर्क करें</h1>
        <p className="text-muted-foreground">
          कोई सवाल है? नीचे दिए गए फॉर्म का उपयोग करें।
        </p>
      </div>

      <Card className="bg-card w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="font-headline">हमें एक संदेश भेजें</CardTitle>
          <CardDescription>हम जल्द से जल्द आपसे संपर्क करेंगे।</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form className="space-y-4">
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>नाम</FormLabel><FormControl><Input placeholder="आपका नाम" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="mobile" render={({ field }) => (
                  <FormItem><FormLabel>मोबाइल नंबर</FormLabel><FormControl><Input type="tel" placeholder="आपका मोबाइल नंबर" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
               <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>ईमेल</FormLabel><FormControl><Input type="email" placeholder="आपका ईमेल पता" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
               <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem><FormLabel>संदेश</FormLabel><FormControl><Textarea placeholder="आप क्या पूछना चाहते हैं?" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
               <Button type="button" onClick={form.handleSubmit(handleEmailSubmit)} className="w-full sm:w-auto">
                <Mail className="mr-2 h-4 w-4"/> ईमेल भेजें
               </Button>
               <Button type="button" onClick={form.handleSubmit(handleSmsSubmit)} className="w-full sm:w-auto">
                <MessageSquare className="mr-2 h-4 w-4"/> SMS भेजें
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
