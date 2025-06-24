'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateAiTest, AiQuestion } from '@/ai/flows/generate-ai-test';
import { generateSainikSchoolTest } from '@/ai/flows/generate-sainik-school-test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Timer, CheckCircle, XCircle, Download, FileText, BookCheck, Shield, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TestResultCertificate } from '@/components/test-result-certificate';
import html2canvas from 'html2canvas';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

type TestStatus = 'not-started' | 'in-progress' | 'finished';
type TestMode = 'selection' | 'subject-wise' | 'sainik-school';

interface Topper {
  name: string;
  score: number;
  subject: string;
  date: string;
  photo: string;
  hint: string;
}

const testSetupSchema = z.object({
    name: z.string().min(2, "नाम आवश्यक है"),
    mobile: z.string().regex(/^\d{10}$/, "कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।"),
    class: z.string().min(1, "कक्षा आवश्यक है।"),
    subject: z.string().optional(),
});
type TestSetupFormValues = z.infer<typeof testSetupSchema>;

type TestResult = {
    score: number;
    percentage: number;
    status: 'पास' | 'औसत' | 'फेल';
    studentName: string;
    studentClass: string;
};


export default function AiTestPage() {
  const [questions, setQuestions] = useState<AiQuestion[]>([]);
  const [status, setStatus] = useState<TestStatus>('not-started');
  const [testMode, setTestMode] = useState<TestMode>('selection');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();
  const { user } = useUser();
  const [testSubject, setTestSubject] = useState('');
  const [isConfirmingSubmit, setIsConfirmingSubmit] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const form = useForm<TestSetupFormValues>({
      resolver: zodResolver(testSetupSchema),
      defaultValues: {
          name: user?.name || '',
          mobile: user?.mobile || '',
          class: '',
          subject: '',
      },
  });

  useEffect(() => {
      if (user) {
          form.reset({
              name: user.name,
              mobile: user.mobile,
              class: '',
              subject: '',
          });
      }
  }, [user, form]);


  const handleTestFinish = useCallback(() => {
    let finalScore = 0;
    questions.forEach((q, index) => {
      if (q.correctAnswer === userAnswers[index]) {
        finalScore++;
      }
    });
    
    const percentage = (finalScore / questions.length) * 100;
    let performanceStatus: 'पास' | 'औसत' | 'फेल';

    if (percentage >= 80) {
        performanceStatus = 'पास';
    } else if (percentage >= 50) {
        performanceStatus = 'फेल';
    } else {
        performanceStatus = 'औसत';
    }

    setTestResult({
        score: finalScore,
        percentage,
        status: performanceStatus,
        studentName: form.getValues('name'),
        studentClass: form.getValues('class'),
    });

    setStatus('finished');

    if (user) {
        const newTopper: Topper = {
            name: form.getValues('name'),
            score: finalScore,
            subject: testSubject,
            date: new Date().toISOString(),
            photo: user.profilePhotoUrl || 'https://placehold.co/100x100.png',
            hint: 'student portrait'
        };

        const storedToppers = localStorage.getItem('ai-test-toppers');
        const toppers: Topper[] = storedToppers ? JSON.parse(storedToppers) : [];
        
        toppers.push(newTopper);
        toppers.sort((a, b) => b.score - a.score);
        const top5 = toppers.slice(0, 5);

        localStorage.setItem('ai-test-toppers', JSON.stringify(top5));
    }

  }, [questions, userAnswers, user, testSubject, form]);


  useEffect(() => {
    if (status !== 'in-progress') return;

    if (timeLeft <= 0) {
      handleTestFinish();
      toast({
        title: "समय समाप्त!",
        description: "परीक्षा समाप्त हो गई है। अपने परिणाम नीचे देखें।",
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeLeft, handleTestFinish, toast]);


  const startTest = async (values: TestSetupFormValues) => {
    setIsLoading(true);
    try {
        let result;
        if (testMode === 'subject-wise') {
            if (!values.subject) {
                toast({ variant: 'destructive', title: 'त्रुटि', description: 'कृपया एक विषय चुनें।'});
                setIsLoading(false);
                return;
            }
            setTestSubject(values.subject);
            setTimeLeft(1800); // 30 minutes
            result = await generateAiTest({ subject: values.subject });
        } else { // sainik-school
            setTestSubject('सैनिक स्कूल मॉक टेस्ट');
            setTimeLeft(3600); // 60 minutes
            result = await generateSainikSchoolTest({});
        }

        if (result.questions && result.questions.length > 0) {
            setQuestions(result.questions);
            setStatus('in-progress');
            setCurrentQuestionIndex(0);
            setUserAnswers(new Array(result.questions.length).fill(''));
            setTestResult(null);
        } else {
            toast({ variant: 'destructive', title: 'परीक्षा उत्पन्न करने में विफल।', description: 'कोई प्रश्न वापस नहीं किया गया। कृपया पुनः प्रयास करें।'});
        }
    } catch (e) {
      toast({ variant: 'destructive', title: 'परीक्षा उत्पन्न करने में विफल।', description: 'एक त्रुटि हुई। कृपया अपनी API कुंजी जांचें और पुनः प्रयास करें।'});
    } finally {
      setIsLoading(false);
    }
  };


  const handleAnswer = (option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleTestFinish();
    }
  };

  const resetTest = () => {
    setStatus('not-started');
    setTestMode('selection');
    setTestSubject('');
    setQuestions([]);
    setIsLoading(false);
    form.reset({
        name: user?.name || '',
        mobile: user?.mobile || '',
        class: '',
        subject: '',
    });
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleEarlySubmit = () => {
    setIsConfirmingSubmit(true);
  }

  const handleDownload = () => {
    if (certificateRef.current) {
        toast({ title: 'प्रमाणपत्र तैयार हो रहा है...', description: 'कृपया प्रतीक्षा करें।' });
        html2canvas(certificateRef.current, { backgroundColor: null, scale: 2.5 }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `test-result-certificate-${form.getValues('name')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({ title: 'प्रमाणपत्र डाउनलोड किया गया', description: 'अपना डाउनलोड फ़ोल्डर देखें।' });
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">आपकी परीक्षा तैयार हो रही है, कृपया प्रतीक्षा करें...</p>
      </div>
    );
  }

  if (status === 'finished' && testResult) {
    return (
        <div className="flex flex-col items-center gap-6">
            <div ref={certificateRef} className="p-4 bg-background w-full max-w-3xl">
                <TestResultCertificate 
                    studentName={testResult.studentName}
                    studentClass={testResult.studentClass}
                    subject={testSubject}
                    score={testResult.score}
                    totalQuestions={questions.length}
                    percentage={testResult.percentage}
                    performanceStatus={testResult.status}
                />
            </div>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-center">अगले चरण</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-center gap-4">
                    <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        सर्टिफिकेट डाउनलोड करें
                    </Button>
                    <Button variant="outline" onClick={() => setShowSolution(true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        हल देखें
                    </Button>
                </CardContent>
            </Card>

            <Button variant="link" onClick={resetTest}>दूसरा टेस्ट दें</Button>

            <Sheet open={showSolution} onOpenChange={setShowSolution}>
                <SheetContent className="w-full max-w-2xl sm:max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>परीक्षा का हल: {testSubject}</SheetTitle>
                        <SheetDescription>
                            आपके द्वारा दिए गए उत्तरों और सही उत्तरों की समीक्षा करें।
                        </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-4">
                        <div className="space-y-4">
                             {questions.map((q, index) => (
                                <div key={index} className={`p-3 rounded-md flex items-start gap-3 ${userAnswers[index] === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    {userAnswers[index] === q.correctAnswer ? <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0"/> : <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0"/>}
                                    <div>
                                        <p className="font-semibold">{index + 1}. {q.question}</p>
                                        <p className="text-sm text-muted-foreground">आपका उत्तर: <span className="font-medium">{userAnswers[index] || 'उत्तर नहीं दिया'}</span></p>
                                        <p className="text-sm font-bold text-primary">सही उत्तर: <span className="font-medium">{q.correctAnswer}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
  }

  if (status === 'in-progress') {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in">
        <AlertDialog open={isConfirmingSubmit} onOpenChange={setIsConfirmingSubmit}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>क्या आप निश्चित हैं?</AlertDialogTitle>
                    <AlertDialogDescription>
                        आप टेस्ट जल्दी सबमिट करने वाले हैं। क्या आप वाकई आगे बढ़ना चाहते हैं?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>रद्द करें</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { setIsConfirmingSubmit(false); handleTestFinish(); }}>सबमिट करें</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">{testSubject} परीक्षा</CardTitle>
                    <CardDescription>प्रश्न {currentQuestionIndex + 1} / {questions.length}</CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-2 text-lg py-2 px-4">
                    <Timer className="w-5 h-5"/>
                    {formatTime(timeLeft)}
                </Badge>
            </CardHeader>
            <CardContent>
                <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-6"/>
                <p className="text-xl font-semibold mb-4">{currentQuestion.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map(option => (
                        <Button
                            key={option}
                            variant={userAnswers[currentQuestionIndex] === option ? 'default' : 'outline'}
                            onClick={() => handleAnswer(option)}
                            className="justify-start h-auto py-3 text-left"
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                 <Button onClick={handleEarlySubmit} variant="destructive">जल्दी सबमिट करें</Button>
                <Button onClick={goToNextQuestion} disabled={!userAnswers[currentQuestionIndex]}>
                    {currentQuestionIndex < questions.length - 1 ? 'अगला प्रश्न' : 'टेस्ट खत्म करें'}
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  if (testMode === 'selection') {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">AI टेस्ट सेंटर</h1>
                <p className="text-muted-foreground">
                अपनी तैयारी का आकलन करने के लिए एक टेस्ट प्रकार चुनें।
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                <Card className="hover:border-primary hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <BookCheck className="w-12 h-12 text-primary"/>
                            <h2 className="text-2xl font-headline font-bold">विषय वार टेस्ट</h2>
                            <p className="text-muted-foreground min-h-[4rem]">गणित, विज्ञान, इतिहास आदि जैसे विशिष्ट विषयों में अपनी विशेषज्ञता का परीक्षण करें।</p>
                            <Button onClick={() => setTestMode('subject-wise')} className="w-full">टेस्ट चुनें</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:border-primary hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Shield className="w-12 h-12 text-primary"/>
                            <h2 className="text-2xl font-headline font-bold">सैनिक स्कूल मॉक टेस्ट</h2>
                            <p className="text-muted-foreground min-h-[4rem]">कक्षा 9 के लिए AISSEE पैटर्न पर आधारित एक पूर्ण मॉक टेस्ट का प्रयास करें।</p>
                            <Button onClick={() => setTestMode('sainik-school')} className="w-full">टेस्ट चुनें</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="relative max-w-md mx-auto w-full">
        <Button variant="ghost" size="icon" className="absolute -left-4 sm:-left-12 top-0" onClick={() => setTestMode('selection')}>
          <ArrowLeft className="w-5 h-5"/>
        </Button>
        <div className="text-center sm:text-left">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
            {testMode === 'subject-wise' ? 'विषय वार टेस्ट' : 'सैनिक स्कूल मॉक टेस्ट'}
            </h1>
            <p className="text-muted-foreground">
            शुरू करने के लिए अपना विवरण भरें।
            </p>
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">नया टेस्ट शुरू करें</CardTitle>
          <CardDescription>शुरू करने के लिए अपना विवरण भरें।</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(startTest)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>नाम</FormLabel><FormControl><Input placeholder="आपका नाम" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem><FormLabel>मोबाइल</FormLabel><FormControl><Input type="tel" placeholder="आपका मोबाइल नंबर" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="class" render={({ field }) => (
                        <FormItem><FormLabel>कक्षा</FormLabel><FormControl><Input placeholder="जैसे, 9वीं" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    {testMode === 'subject-wise' && (
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>विषय</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="एक विषय चुनें" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Maths">गणित</SelectItem>
                                        <SelectItem value="Science">विज्ञान</SelectItem>
                                        <SelectItem value="History">इतिहास</SelectItem>
                                        <SelectItem value="Geography">भूगोल</SelectItem>
                                        <SelectItem value="General Knowledge">सामान्य ज्ञान</SelectItem>
                                        <SelectItem value="English">अंग्रेजी</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                    )}

                    <Alert>
                        <Timer className="h-4 w-4" />
                        <AlertTitle>समयबद्ध परीक्षा</AlertTitle>
                        <AlertDescription>
                        आपको {testMode === 'subject-wise' ? '25 प्रश्नों को पूरा करने के लिए 30' : '50 प्रश्नों को पूरा करने के लिए 60'} मिनट का समय मिलेगा।
                        </AlertDescription>
                    </Alert>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        टेस्ट शुरू करें
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
