'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateAiTest, AiQuestion } from '@/ai/flows/generate-ai-test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Timer, CheckCircle, XCircle, Download, FileText, ArrowLeft, Shield, BookCopy, ChevronRight, RefreshCw, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TestResultCertificate } from '@/components/test-result-certificate';
import html2canvas from 'html2canvas';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/context/user-context';

type PageState = 'class-selection' | 'test-dashboard' | 'test-in-progress' | 'certificate';
type TestId = 'maths' | 'intelligence' | 'language' | 'gk' | 'english' | 'science' | 'social';

type TestProgress = {
  completed: boolean;
  score: number;
  answers: string[];
  questions: AiQuestion[];
  timeTaken: number;
};

type ClassProgress = Record<TestId, TestProgress>;

const testConfigs = {
  '6': {
    passingScore: 250,
    failScore: 220,
    totalMarks: 300,
    language: 'Hindi',
    tests: [
      { id: 'maths' as TestId, subject: 'गणित (Maths)', questions: 50, marksPerQuestion: 3, time: 60 * 60 },
      { id: 'intelligence' as TestId, subject: 'बुद्धिमत्ता (Intelligence)', questions: 25, marksPerQuestion: 2, time: 30 * 60 },
      { id: 'language' as TestId, subject: 'भाषा (Language - Hindi)', questions: 25, marksPerQuestion: 2, time: 30 * 60 },
      { id: 'gk' as TestId, subject: 'सामान्य ज्ञान (General Knowledge)', questions: 25, marksPerQuestion: 2, time: 30 * 60 },
    ],
  },
  '9': {
    passingScore: 340,
    failScore: 320,
    totalMarks: 400,
    language: 'English',
    tests: [
      { id: 'maths' as TestId, subject: 'Maths', questions: 50, marksPerQuestion: 4, time: 60 * 60 },
      { id: 'intelligence' as TestId, subject: 'Intelligence', questions: 25, marksPerQuestion: 2, time: 30 * 60 },
      { id: 'english' as TestId, subject: 'English', questions: 25, marksPerQuestion: 2, time: 30 * 60 },
      { id: 'science' as TestId, subject: 'General Science', questions: 25, marksPerQuestion: 2, time: 30 * 60 },
      { id: 'social' as TestId, subject: 'Social Studies', questions: 25, marksPerQuestion: 2, time: 30 * 60 },
    ],
  },
};

const getInitialProgress = (classId: '6' | '9'): ClassProgress => {
    return testConfigs[classId].tests.reduce((acc, test) => {
        acc[test.id] = { completed: false, score: 0, answers: [], questions: [], timeTaken: 0 };
        return acc;
    }, {} as ClassProgress);
};

export default function SainikSchoolTestPage() {
    const [pageState, setPageState] = useState<PageState>('class-selection');
    const [selectedClass, setSelectedClass] = useState<'6' | '9' | null>(null);
    const [progress, setProgress] = useState<ClassProgress | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTest, setCurrentTest] = useState<{ id: TestId; subject: string; questions: AiQuestion[], language: string, classLevel: string, time: number } | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ title: string, description: string, onConfirm: () => void } | null>(null);
    const [solutionSheet, setSolutionSheet] = useState<{ open: boolean, testId: TestId | null }>({ open: false, testId: null });
    const { user } = useUser();
    
    const { toast } = useToast();
    const certificateRef = useRef<HTMLDivElement>(null);

    // Load progress from localStorage
    useEffect(() => {
        if (selectedClass) {
            const savedProgressRaw = localStorage.getItem(`sainik-school-progress-${selectedClass}-${user?.email}`);
            if (savedProgressRaw) {
                setProgress(JSON.parse(savedProgressRaw));
            } else {
                setProgress(getInitialProgress(selectedClass));
            }
        }
    }, [selectedClass, user?.email]);

    // Save progress to localStorage
    useEffect(() => {
        if (progress && selectedClass && user?.email) {
            localStorage.setItem(`sainik-school-progress-${selectedClass}-${user.email}`, JSON.stringify(progress));
        }
    }, [progress, selectedClass, user?.email]);

    const handleSelectClass = (classId: '6' | '9') => {
        setSelectedClass(classId);
        setPageState('test-dashboard');
    };

    const handleStartTest = async (testId: TestId) => {
        if (!selectedClass) return;
        const config = testConfigs[selectedClass];
        const testConfig = config.tests.find(t => t.id === testId);
        if (!testConfig) return;

        setIsLoading(true);
        try {
            const result = await generateAiTest({
                subject: testConfig.subject,
                questionCount: testConfig.questions,
                classLevel: selectedClass,
                language: config.language,
            });

            if (result.questions && result.questions.length > 0) {
                setCurrentTest({
                    id: testId,
                    subject: testConfig.subject,
                    questions: result.questions,
                    language: config.language,
                    classLevel: selectedClass,
                    time: testConfig.time,
                });
                setTimeLeft(testConfig.time);
                setCurrentQuestionIndex(0);
                setUserAnswers(new Array(result.questions.length).fill(''));
                setPageState('test-in-progress');
            } else {
                toast({ variant: 'destructive', title: 'परीक्षा उत्पन्न करने में विफल।', description: 'AI कोई प्रश्न वापस करने में विफल रहा। कृपया पुनः प्रयास करें।' });
            }
        } catch (e) {
            toast({ variant: 'destructive', title: 'एक त्रुटि हुई।', description: 'परीक्षा उत्पन्न करने में विफल। कृपया अपनी API कुंजी जांचें और पुनः प्रयास करें।' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFinishTest = useCallback(() => {
        if (!currentTest || !progress || !selectedClass || !user) return;

        const config = testConfigs[selectedClass!];
        const testConfig = config.tests.find(t => t.id === currentTest.id);
        if (!testConfig) return;

        let finalScore = 0;
        currentTest.questions.forEach((q, index) => {
            if (q.correctAnswer === userAnswers[index]) {
                finalScore++;
            }
        });
        
        const timeTaken = currentTest.time - timeLeft;

        const marksPerQuestion = testConfig.marksPerQuestion;
        const totalMarks = currentTest.questions.length * marksPerQuestion;
        
        // Save subject topper
        const newSubjectTopper = {
            name: user.name,
            class: selectedClass,
            subject: currentTest.subject,
            score: finalScore * marksPerQuestion,
            totalMarks: totalMarks,
            date: new Date().toISOString(),
            photo: user.profilePhotoUrl || 'https://placehold.co/100x100.png',
            hint: 'student portrait'
        };

        const subjectToppersRaw = localStorage.getItem('sainik-school-subject-toppers');
        const subjectToppers = subjectToppersRaw ? JSON.parse(subjectToppersRaw) : [];
        const otherToppers = subjectToppers.filter((t: any) => !(t.name === user.name && t.class === selectedClass && t.subject === currentTest.subject));
        const updatedToppers = [...otherToppers, newSubjectTopper];
        updatedToppers.sort((a: any, b: any) => (b.score / b.totalMarks) - (a.score / a.totalMarks));
        localStorage.setItem('sainik-school-subject-toppers', JSON.stringify(updatedToppers));


        setProgress(prev => ({
            ...prev!,
            [currentTest.id]: {
                completed: true,
                score: finalScore,
                answers: userAnswers,
                questions: currentTest.questions,
                timeTaken: timeTaken,
            }
        }));

        setPageState('test-dashboard');
        setCurrentTest(null);
        toast({ title: 'टेस्ट पूरा हुआ!', description: `${currentTest.subject} का आपका परिणाम सेव कर लिया गया है।` });
    }, [currentTest, userAnswers, progress, timeLeft, selectedClass, user, toast]);

    useEffect(() => {
        if (pageState !== 'test-in-progress') return;

        if (timeLeft <= 0) {
            handleFinishTest();
            toast({
                title: "समय समाप्त!",
                description: "आपका टेस्ट स्वचालित रूप से सबमिट कर दिया गया है।",
            });
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [pageState, timeLeft, handleFinishTest, toast]);


    const handleAnswer = (option: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = option;
        setUserAnswers(newAnswers);
    };

    const handleResetProgress = () => {
        setConfirmAction({
            title: 'क्या आप निश्चित हैं?',
            description: `यह कक्षा ${selectedClass} के लिए आपकी सभी परीक्षा प्रगति को रीसेट कर देगा। यह क्रिया पूर्ववत नहीं की जा सकती।`,
            onConfirm: () => {
                if(selectedClass){
                    localStorage.removeItem(`sainik-school-progress-${selectedClass}-${user?.email}`);
                    setProgress(getInitialProgress(selectedClass));
                    toast({ title: 'प्रगति रीसेट', description: `कक्षा ${selectedClass} के लिए आपकी प्रगति रीसेट कर दी गई है।` });
                }
            }
        });
        setIsConfirming(true);
    };

    const handleDownloadCertificate = () => {
        if (certificateRef.current) {
            toast({ title: 'प्रमाणपत्र तैयार हो रहा है...', description: 'कृपया प्रतीक्षा करें।' });
            html2canvas(certificateRef.current, { backgroundColor: null, scale: 2.5 }).then((canvas) => {
                const link = document.createElement('a');
                link.download = `sainik-school-mock-test-certificate.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                toast({ title: 'प्रमाणपत्र डाउनलोड किया गया', description: 'अपना डाउनलोड फ़ोल्डर देखें।' });
            });
        }
    };
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const renderClassSelection = () => (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">सैनिक स्कूल मॉक टेस्ट</h1>
                <p className="text-muted-foreground">अपनी तैयारी का आकलन करने के लिए एक कक्षा चुनें।</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                <Card className="hover:border-primary hover:shadow-lg transition-all cursor-pointer" onClick={() => handleSelectClass('6')}>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <BookCopy className="w-12 h-12 text-primary"/>
                            <h2 className="text-2xl font-headline font-bold">कक्षा 6</h2>
                            <p className="text-muted-foreground min-h-[4rem]">कक्षा 6 के लिए AISSEE पैटर्न पर आधारित मॉक टेस्ट का प्रयास करें। (भाषा: हिंदी)</p>
                            <Button className="w-full">कक्षा 6 चुनें</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:border-primary hover:shadow-lg transition-all cursor-pointer" onClick={() => handleSelectClass('9')}>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <Shield className="w-12 h-12 text-primary"/>
                            <h2 className="text-2xl font-headline font-bold">कक्षा 9</h2>
                            <p className="text-muted-foreground min-h-[4rem]">कक्षा 9 के लिए AISSEE पैटर्न पर आधारित मॉक टेस्ट का प्रयास करें। (भाषा: अंग्रेजी)</p>
                            <Button className="w-full">कक्षा 9 चुनें</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
    
    const renderTestDashboard = () => {
        if (!selectedClass || !progress) return null;
        const config = testConfigs[selectedClass];
        const completedCount = config.tests.filter(t => progress[t.id]?.completed).length;
        const allTestsCompleted = completedCount === config.tests.length;
        const totalMinutes = config.tests.reduce((sum, test) => sum + (test.time / 60), 0);

        return (
            <div className="flex flex-col gap-6">
                <div className="relative">
                    <Button variant="ghost" size="icon" className="absolute -left-4 sm:-left-12 -top-2" onClick={() => setPageState('class-selection')}>
                        <ArrowLeft className="w-5 h-5"/>
                    </Button>
                    <div className="text-center sm:text-left">
                        <h1 className="font-headline text-3xl font-bold tracking-tight">मॉक टेस्ट डैशबोर्ड - कक्षा {selectedClass}</h1>
                        <p className="text-muted-foreground">अपनी प्रगति को ट्रैक करें और टेस्ट शुरू करें। कुल समय: {totalMinutes} मिनट।</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>आपकी प्रगति</CardTitle>
                        <CardDescription>{completedCount} / {config.tests.length} टेस्ट पूरे हुए।</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(completedCount / config.tests.length) * 100} />
                    </CardContent>
                </Card>
                
                <div className="grid gap-4 md:grid-cols-2">
                    {config.tests.map(test => {
                        const testProgress = progress[test.id];
                        return (
                            <Card key={test.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{test.subject}</CardTitle>
                                    <CardDescription>{test.questions} प्रश्न, {test.questions * test.marksPerQuestion} अंक</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    {testProgress?.completed ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-5 h-5"/>
                                            <p className="font-semibold">पूरा हुआ! स्कोर: {testProgress.score * test.marksPerQuestion} / {test.questions * test.marksPerQuestion}</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <p>अभी तक शुरू नहीं किया गया।</p>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" disabled={!testProgress?.completed} onClick={() => setSolutionSheet({open: true, testId: test.id})}>हल देखें</Button>
                                    <Button onClick={() => handleStartTest(test.id)}>{testProgress?.completed ? 'पुनः प्रयास करें' : 'टेस्ट शुरू करें'}</Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                <Card className="bg-primary/5">
                    <CardHeader>
                         <CardTitle className="font-headline flex items-center gap-2"><Trophy/> अंतिम चरण</CardTitle>
                         <CardDescription>सभी टेस्ट पूरे करने के बाद, आप अपना अंतिम प्रदर्शन प्रमाणपत्र उत्पन्न कर सकते हैं।</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => setPageState('certificate')} disabled={!allTestsCompleted} className="flex-1">
                            प्रमाणपत्र उत्पन्न करें
                            {!allTestsCompleted && <span className="ml-2 text-xs">({completedCount}/{config.tests.length} पूर्ण)</span>}
                        </Button>
                        <Button variant="destructive" onClick={handleResetProgress} className="flex-1">
                            <RefreshCw className="mr-2 h-4 w-4"/>
                            प्रगति रीसेट करें
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderTestInProgress = () => {
        if (!currentTest) return null;
        const currentQ = currentTest.questions[currentQuestionIndex];
        return (
            <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">{currentTest.subject}</CardTitle>
                            <CardDescription>प्रश्न {currentQuestionIndex + 1} / {currentTest.questions.length}</CardDescription>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-2 text-lg py-2 px-4">
                            <Timer className="w-5 h-5"/>
                            {formatTime(timeLeft)}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <Progress value={((currentQuestionIndex + 1) / currentTest.questions.length) * 100} className="mb-6"/>
                        <p className="text-xl font-semibold mb-4">{currentQ.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQ.options.map(option => (
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
                    <CardFooter className="justify-end">
                        <Button onClick={() => {
                            if (currentQuestionIndex < currentTest.questions.length - 1) {
                                setCurrentQuestionIndex(prev => prev + 1);
                            } else {
                                handleFinishTest();
                            }
                        }} disabled={!userAnswers[currentQuestionIndex]}>
                            {currentQuestionIndex < currentTest.questions.length - 1 ? 'अगला प्रश्न' : 'टेस्ट खत्म करें'}
                            <ChevronRight className="w-4 h-4 ml-2"/>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    };

    const CertificateRenderer = () => {
        if (!selectedClass || !progress || !user) return null;

        const config = testConfigs[selectedClass];
        const subjectResults = config.tests.map(test => {
            const testProgress = progress[test.id];
            return {
                subject: test.subject,
                score: testProgress.completed ? testProgress.score * test.marksPerQuestion : 0,
                totalMarks: test.questions * test.marksPerQuestion,
            };
        });
        
        const totalScoreObtained = subjectResults.reduce((sum, res) => sum + res.score, 0);
        const percentage = (totalScoreObtained / config.totalMarks) * 100;
        
        let performanceStatus: 'पास' | 'औसत' | 'फेल';
        if (totalScoreObtained >= config.passingScore) {
            performanceStatus = 'पास';
        } else if (totalScoreObtained < config.failScore) {
            performanceStatus = 'फेल';
        } else {
            performanceStatus = 'औसत';
        }

        const handleSaveOverallTopper = useCallback(() => {
            if (!user || !selectedClass) return;

            const newOverallTopper = {
                name: user.name,
                class: selectedClass,
                percentage: percentage,
                date: new Date().toISOString(),
                photo: user.profilePhotoUrl || 'https://placehold.co/100x100.png',
                hint: 'student portrait'
            };

            const overallToppersRaw = localStorage.getItem('sainik-school-overall-toppers');
            const overallToppers = overallToppersRaw ? JSON.parse(overallToppersRaw) : [];
            const otherToppers = overallToppers.filter((t: any) => !(t.name === user.name && t.class === selectedClass));
            const updatedToppers = [...otherToppers, newOverallTopper];
            updatedToppers.sort((a: any, b: any) => b.percentage - a.percentage);
            localStorage.setItem('sainik-school-overall-toppers', JSON.stringify(updatedToppers.slice(0, 10)));
        }, [user, selectedClass, percentage]);

        useEffect(() => {
            handleSaveOverallTopper();
        }, [handleSaveOverallTopper]);

        return (
            <div className="flex flex-col items-center gap-6">
                <div ref={certificateRef} className="p-4 bg-background w-full max-w-4xl">
                    <TestResultCertificate
                        studentName={user?.name || 'Student'}
                        studentClass={`कक्षा ${selectedClass}`}
                        subject={`सैनिक स्कूल मॉक टेस्ट - कक्षा ${selectedClass}`}
                        totalScore={totalScoreObtained}
                        totalPossibleMarks={config.totalMarks}
                        percentage={percentage}
                        performanceStatus={performanceStatus}
                        subjectResults={subjectResults}
                    />
                </div>
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-center">अगले चरण</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap justify-center gap-4">
                        <Button onClick={handleDownloadCertificate}>
                            <Download className="mr-2 h-4 w-4" />
                            सर्टिफिकेट डाउनलोड करें
                        </Button>
                        <Button variant="outline" onClick={() => setPageState('test-dashboard')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            डैशबोर्ड पर वापस जाएं
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const renderSolutionSheet = () => {
        if (!solutionSheet.testId || !progress || !selectedClass) return null;
        const testProgress = progress[solutionSheet.testId];
        if (!testProgress || !testProgress.completed) return null;

        return (
            <Sheet open={solutionSheet.open} onOpenChange={(isOpen) => setSolutionSheet({open: isOpen, testId: isOpen ? solutionSheet.testId : null})}>
                <SheetContent className="w-full max-w-2xl sm:max-w-2xl">
                    <SheetHeader>
                        <SheetTitle>परीक्षा का हल: {testConfigs[selectedClass].tests.find(t=>t.id === solutionSheet.testId)?.subject}</SheetTitle>
                        <SheetDescription>
                            आपके द्वारा दिए गए उत्तरों और सही उत्तरों की समीक्षा करें।
                        </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-4">
                        <div className="space-y-4">
                             {testProgress.questions.map((q, index) => (
                                <div key={index} className={`p-3 rounded-md flex items-start gap-3 ${testProgress.answers[index] === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    {testProgress.answers[index] === q.correctAnswer ? <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0"/> : <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0"/>}
                                    <div>
                                        <p className="font-semibold">{index + 1}. {q.question}</p>
                                        <p className="text-sm text-muted-foreground">आपका उत्तर: <span className="font-medium">{testProgress.answers[index] || 'उत्तर नहीं दिया'}</span></p>
                                        <p className="text-sm font-bold text-primary">सही उत्तर: <span className="font-medium">{q.correctAnswer}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-full">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground">आपकी परीक्षा तैयार हो रही है, कृपया प्रतीक्षा करें...</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-4">
            {pageState === 'class-selection' && renderClassSelection()}
            {pageState === 'test-dashboard' && renderTestDashboard()}
            {pageState === 'test-in-progress' && renderTestInProgress()}
            {pageState === 'certificate' && <CertificateRenderer />}
            {renderSolutionSheet()}

            <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
                        <AlertDialogDescription>{confirmAction?.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmAction(null)}>रद्द करें</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            confirmAction?.onConfirm();
                            setIsConfirming(false);
                            setConfirmAction(null);
                        }}>पुष्टि करें</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
