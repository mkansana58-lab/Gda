'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';

const emailFormSchema = z.object({
  name: z.string().min(2, "नाम आवश्यक है"),
  email: z.string().email("अमान्य ईमेल पता"),
  message: z.string().min(10, "संदेश कम से कम 10 अक्षरों का होना चाहिए"),
});

const smsFormSchema = z.object({
  name: z.string().min(2, "नाम आवश्यक है"),
  mobile: z.string().regex(/^\d{10}$/, "कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।"),
  question: z.string().min(5, "प्रश्न कम से कम 5 अक्षरों का होना चाहिए"),
  address: z.string().min(5, "पता आवश्यक है"),
});

export default function ContactPage() {
    const { user } = useUser();
    const { toast } = useToast();

    const emailForm = useForm<z.infer<typeof emailFormSchema>>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: { name: user?.name || '', email: user?.email || '', message: '' },
    });

    const smsForm = useForm<z.infer<typeof smsFormSchema>>({
        resolver: zodResolver(smsFormSchema),
        defaultValues: { name: user?.name || '', mobile: user?.mobile || '', question: '', address: user?.address || '' },
    });

    function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
        const subject = encodeURIComponent(`Contact Form Inquiry from ${values.name}`);
        const body = encodeURIComponent(values.message);
        window.location.href = `mailto:mohitkansana82@gmail.com?subject=${subject}&body=${body}`;
        toast({ title: "ईमेल ऐप खोल रहा है", description: "कृपया अपने ईमेल क्लाइंट में ईमेल भेजना पूरा करें।" });
    }

    function onSmsSubmit(values: z.infer<typeof smsFormSchema>) {
        const body = encodeURIComponent(`Query from ${values.name} (${values.address}): ${values.question}`);
        window.location.href = `sms:9694251069?body=${body}`;
        toast({ title: "एसएमएस ऐप खोल रहा है", description: "कृपया अपने एसएमएस ऐप में संदेश भेजना पूरा करें।" });
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">हमसे संपर्क करें</h1>
        <p className="text-muted-foreground">
          कोई सवाल है? हमें आपसे सुनना अच्छा लगेगा। ईमेल या एसएमएस के माध्यम से संपर्क करें।
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Mail/> हमें ईमेल करें</CardTitle>
                <CardDescription>विस्तृत पूछताछ के लिए हमें एक ईमेल भेजें।</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                        <FormField control={emailForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>नाम</FormLabel><FormControl><Input placeholder="आपका नाम" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={emailForm.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>ईमेल</FormLabel><FormControl><Input type="email" placeholder="आपका ईमेल" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={emailForm.control} name="message" render={({ field }) => (
                            <FormItem><FormLabel>संदेश</FormLabel><FormControl><Textarea placeholder="आपका संदेश..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit">ईमेल भेजें</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><MessageSquare/> एक एसएमएस भेजें</CardTitle>
                <CardDescription>त्वरित प्रतिक्रिया के लिए एक टेक्स्ट भेजें।</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...smsForm}>
                    <form onSubmit={smsForm.handleSubmit(onSmsSubmit)} className="space-y-4">
                        <FormField control={smsForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>नाम</FormLabel><FormControl><Input placeholder="आपका नाम" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={smsForm.control} name="mobile" render={({ field }) => (
                            <FormItem><FormLabel>मोबाइल</FormLabel><FormControl><Input type="tel" placeholder="आपका 10 अंकों का मोबाइल नंबर" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={smsForm.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>पता</FormLabel><FormControl><Input placeholder="आपका पता" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={smsForm.control} name="question" render={({ field }) => (
                            <FormItem><FormLabel>प्रश्न</FormLabel><FormControl><Textarea placeholder="आपका प्रश्न..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit">एसएमएस भेजें</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
