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
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const smsFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
  question: z.string().min(5, "Question must be at least 5 characters"),
  address: z.string().min(5, "Address is required"),
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
        toast({ title: "Opening Email App", description: "Please complete sending the email in your email client." });
    }

    function onSmsSubmit(values: z.infer<typeof smsFormSchema>) {
        const body = encodeURIComponent(`Query from ${values.name} (${values.address}): ${values.question}`);
        window.location.href = `sms:9694251069?body=${body}`;
        toast({ title: "Opening SMS App", description: "Please complete sending the message in your SMS app." });
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground">
          Have a question? We'd love to hear from you. Reach out via email or SMS.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Mail/> Email Us</CardTitle>
                <CardDescription>Send us an email for detailed inquiries.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                        <FormField control={emailForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={emailForm.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="Your email" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={emailForm.control} name="message" render={({ field }) => (
                            <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Your message..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit">Send Email</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><MessageSquare/> Send an SMS</CardTitle>
                <CardDescription>Send a text for a quick response.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...smsForm}>
                    <form onSubmit={smsForm.handleSubmit(onSmsSubmit)} className="space-y-4">
                        <FormField control={smsForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={smsForm.control} name="mobile" render={({ field }) => (
                            <FormItem><FormLabel>Mobile</FormLabel><FormControl><Input type="tel" placeholder="Your 10-digit mobile number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={smsForm.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="Your address" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={smsForm.control} name="question" render={({ field }) => (
                            <FormItem><FormLabel>Question</FormLabel><FormControl><Textarea placeholder="Your question..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit">Send SMS</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
