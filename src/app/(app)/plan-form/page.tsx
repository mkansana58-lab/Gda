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
import { Loader2, Mail, Download } from 'lucide-react';
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

export default function PlanFormPage() {
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
        title: 'Application Submitted!',
        description: 'Your certificate has been generated below.',
      });
    }, 1000);
  }

  const handleDownload = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current, { backgroundColor: null }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'certificate.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const emailBody = submittedData ? encodeURIComponent(
    `New Plan Application:\n\nExam: ${submittedData.exam}\nName: ${submittedData.name}\nAge: ${submittedData.age}\nClass: ${submittedData.class}\nSchool: ${submittedData.school}\nMobile: ${submittedData.mobile}\nEmail: ${submittedData.email}\nAddress: ${submittedData.address}`
  ) : '';

  if (submittedData) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div ref={certificateRef}>
          <Certificate data={submittedData} />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Certificate
          </Button>
          <Button asChild variant="outline">
            <a href={`mailto:mohitKansana82@gemali.com?subject=New Plan Application&body=${emailBody}`}>
              <Mail className="mr-2 h-4 w-4" />
              Email to Academy
            </a>
          </Button>
        </div>
         <Button variant="link" onClick={() => setSubmittedData(null)}>Submit Another Application</Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Plan Application Form</CardTitle>
        <CardDescription>Fill out the form to apply for an exam plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="exam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Selection</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exam" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Military School">Military School</SelectItem>
                      <SelectItem value="RMS">RMS</SelectItem>
                      <SelectItem value="RIMC">RIMC</SelectItem>
                      <SelectItem value="JNV">JNV</SelectItem>
                      <SelectItem value="RTSE">RTSE</SelectItem>
                      <SelectItem value="Olympiad">Olympiad</SelectItem>
                      <SelectItem value="Scholarship">Scholarship</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl><Input type="number" placeholder="Your age" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="class" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl><Input placeholder="e.g., 10th" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="school" render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl><Input placeholder="Your school name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="mobile" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="Your mobile number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="Your email address" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl><Input placeholder="Your full address" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
