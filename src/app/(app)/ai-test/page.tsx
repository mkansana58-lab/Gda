'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateAiTest, AiQuestion } from '@/ai/flows/generate-ai-test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Timer, CheckCircle, XCircle, Download, ArrowLeft, Shield, BookCopy, ChevronRight, RefreshCw, Trophy, BrainCircuit, Book, Award, Star, Sun } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TestResultCertificate } from '@/components/test-result-certificate';
import html2canvas from 'html2canvas';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/context/user-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addNotification } from '@/lib/notifications';

type PageState = 'mode-selection' | 'class-selection' | 'subject-test-setup' | 'test-dashboard' | 'test-in-progress' | 'certificate';
type TestMode = 'sainik' | 'rms' | 'jnv' | 'olympiad' | 'rtse' | 'devnarayan';
type TestId = string;

type TestConfig = {
    id: TestId;
    subject: string;
    questions: number;
    marksPerQuestion: number;
    time: number; // in seconds
    isQualifying?: boolean;
    qualifyingMarks?: number;
    examContext?: string;
};

type TestProgress = { completed: boolean; score: number; answers: string[]; questions: AiQuestion[]; timeTaken: number; };
type ClassProgress = Record<TestId, TestProgress>;
type CertificateData = { studentName: string; studentClass: string; testTitle: string; totalScore: number; totalPossibleMarks: number; percentage: number; performanceStatus: 'पास' | 'औसत' | 'फेल' | 'योग्य नहीं'; subjectResults: any[] };

const sainikTestConfigs = {
  '6': { passingScore: 250, failScore: 220, totalMarks: 300, language: 'Hindi', totalTimeMinutes: 150, tests: [ { id: 'sainik_maths_6', subject: 'गणित (Maths)', questions: 50, marksPerQuestion: 3, time: 3600 }, { id: 'sainik_intelligence_6', subject: 'बुद्धिमत्ता (Intelligence)', questions: 25, marksPerQuestion: 2, time: 1800 }, { id: 'sainik_language_6', subject: 'भाषा (Language - Hindi)', questions: 25, marksPerQuestion: 2, time: 1800 }, { id: 'sainik_gk_6', subject: 'सामान्य ज्ञान (General Knowledge)', questions: 25, marksPerQuestion: 2, time: 1800 }, ] },
  '9': { passingScore: 340, failScore: 320, totalMarks: 400, language: 'English', totalTimeMinutes: 180, tests: [ { id: 'sainik_maths_9', subject: 'Maths', questions: 50, marksPerQuestion: 4, time: 3600 }, { id: 'sainik_intelligence_9', subject: 'Intelligence', questions: 25, marksPerQuestion: 2, time: 1800 }, { id: 'sainik_english_9', subject: 'English', questions: 25, marksPerQuestion: 2, time: 1800 }, { id: 'sainik_science_9', subject: 'General Science', questions: 25, marksPerQuestion: 2, time: 1800 }, { id: 'sainik_social_9', subject: 'Social Studies', questions: 25, marksPerQuestion: 2, time: 1800 }, ] },
};
const rmsTestConfigs = {
  '6': { passingScore: 90, failScore: 60, totalMarks: 150, language: 'Hindi', totalTimeMinutes: 150, tests: [ { id: 'rms_maths_6', subject: 'गणित (Maths)', questions: 50, marksPerQuestion: 1, time: 3000 }, { id: 'rms_reasoning_6', subject: 'रीजनिंग (Reasoning)', questions: 50, marksPerQuestion: 1, time: 3000 }, { id: 'rms_gk_6', subject: 'सामान्य ज्ञान (GK)', questions: 50, marksPerQuestion: 1, time: 1500 }, { id: 'rms_english_6', subject: 'अंग्रेजी (English)', questions: 50, marksPerQuestion: 1, time: 1500, isQualifying: true, qualifyingMarks: 25 }, ] },
  '9': { passingScore: 120, failScore: 80, totalMarks: 200, language: 'English', totalTimeMinutes: 150, tests: [ { id: 'rms_hindi_9', subject: 'Hindi', questions: 20, marksPerQuestion: 1, time: 1200 }, { id: 'rms_social_9', subject: 'Social Studies', questions: 30, marksPerQuestion: 1, time: 1500 }, { id: 'rms_english_9', subject: 'English', questions: 50, marksPerQuestion: 1, time: 2100 }, { id: 'rms_maths_9', subject: 'Maths', questions: 50, marksPerQuestion: 1, time: 2100 }, { id: 'rms_science_9', subject: 'General Science', questions: 50, marksPerQuestion: 1, time: 2100 }, ] },
};
const jnvTestConfigs = {
  '6': { passingScore: 65, failScore: 50, totalMarks: 80, language: 'Hindi', totalTimeMinutes: 120, tests: [ { id: 'jnv_mental_6', subject: 'मानसिक योग्यता (Mental Ability)', questions: 40, marksPerQuestion: 1, time: 3600, examContext: 'JNV Class 6 Mental Ability' }, { id: 'jnv_maths_6', subject: 'अंकगणित (Arithmetic)', questions: 20, marksPerQuestion: 1, time: 1800 }, { id: 'jnv_hindi_6', subject: 'भाषा (Hindi)', questions: 20, marksPerQuestion: 1, time: 1800 }, ] },
  '9': { passingScore: 75, failScore: 60, totalMarks: 100, language: 'Hindi', totalTimeMinutes: 150, tests: [ { id: 'jnv_science_9', subject: 'विज्ञान (Science)', questions: 35, marksPerQuestion: 1, time: 2700 }, { id: 'jnv_maths_9', subject: 'गणित (Maths)', questions: 35, marksPerQuestion: 1, time: 2700 }, { id: 'jnv_english_9', subject: 'अंग्रेजी (English)', questions: 15, marksPerQuestion: 1, time: 1800 }, { id: 'jnv_hindi_9', subject: 'हिंदी (Hindi)', questions: 15, marksPerQuestion: 1, time: 1800 }, ] },
};
const getTestConfigs = (mode: TestMode) => ({ 'sainik': sainikTestConfigs, 'rms': rmsTestConfigs, 'jnv': jnvTestConfigs, 'olympiad': {}, 'rtse': {}, 'devnarayan': {} }[mode]);

const getInitialProgress = (mode: TestMode, classId: string): ClassProgress => {
  const configs = getTestConfigs(mode) as any;
  if (!configs[classId]) return {};
  return configs[classId].tests.reduce((acc: any, test: any) => {
    acc[test.id] = { completed: false, score: 0, answers: [], questions: [], timeTaken: 0 };
    return acc;
  }, {} as ClassProgress);
};

export default function AiTestPage() {
    const [pageState, setPageState] = useState<PageState>('mode-selection');
    const [testMode, setTestMode] = useState<TestMode | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [progress, setProgress] = useState<ClassProgress | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTest, setCurrentTest] = useState<{ id: TestId; subject: string; questions: AiQuestion[], language: string, classLevel: string, time: number, examContext?: string } | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ title: string, description: string, onConfirm: () => void } | null>(null);
    const [solutionSheet, setSolutionSheet] = useState<{ open: boolean, testId: TestId | null }>({ open: false, testId: null });
    const { user } = useUser();
    const { toast } = useToast();
    const certificateRef = useRef<HTMLDivElement>(null);
    const [certificateData, setCertificateData] = useState<CertificateData | null>(null);

    // Subject-wise test state
    const [subjectTest, setSubjectTest] = useState<{ subject: string; questions: AiQuestion[]; config: any } | null>(null);
    const [subjectTestAnswers, setSubjectTestAnswers] = useState<string[]>([]);
    const [subjectTestConfig, setSubjectTestConfig] = useState<any>(null);

    useEffect(() => {
        if (testMode && selectedClass && user?.email) {
            const savedProgressRaw = localStorage.getItem(`${testMode}-progress-${selectedClass}-${user.email}`);
            if (savedProgressRaw) {
                try {
                    setProgress(JSON.parse(savedProgressRaw));
                } catch (e) {
                    console.error("Failed to parse progress from localStorage", e);
                    setProgress(getInitialProgress(testMode, selectedClass));
                }
            } else {
                setProgress(getInitialProgress(testMode, selectedClass));
            }
        }
    }, [testMode, selectedClass, user?.email]);

    useEffect(() => {
        if (progress && testMode && selectedClass && user?.email) {
            localStorage.setItem(`${testMode}-progress-${selectedClass}-${user.email}`, JSON.stringify(progress));
        }
    }, [progress, testMode, selectedClass, user?.email]);

    const handleSelectMode = (mode: TestMode) => {
        setTestMode(mode);
        if (['sainik', 'rms', 'jnv'].includes(mode)) {
          setPageState('class-selection');
        } else {
          setPageState('subject-test-setup');
        }
    };

    const handleSelectClass = (classId: string) => {
        setSelectedClass(classId);
        setPageState('test-dashboard');
    };
    
    const handleStartMockTest = async (testId: TestId) => {
        if (!selectedClass || !testMode) return;
        const config = (getTestConfigs(testMode) as any)[selectedClass];
        const testConfig = config.tests.find((t: any) => t.id === testId);
        if (!testConfig) return;

        setIsLoading(true);
        try {
            const result = await generateAiTest({ subject: testConfig.subject, questionCount: testConfig.questions, classLevel: selectedClass, language: config.language, examContext: testConfig.examContext });
            if (result.questions && result.questions.length > 0) {
                setCurrentTest({ id: testId, subject: testConfig.subject, questions: result.questions, language: config.language, classLevel: selectedClass, time: testConfig.time, examContext: testConfig.examContext });
                setTimeLeft(testConfig.time);
                setCurrentQuestionIndex(0);
                setUserAnswers(new Array(result.questions.length).fill(''));
                setPageState('test-in-progress');
            } else {
                toast({ variant: 'destructive', title: 'परीक्षा उत्पन्न करने में विफल।', description: 'AI कोई प्रश्न वापस करने में विफल रहा। कृपया पुनः प्रयास करें।' });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'एक त्रुटि हुई।', description: e.message || 'परीक्षा उत्पन्न करने में विफल। कृपया पुनः प्रयास करें।' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFinishMockTest = useCallback(() => {
        if (!currentTest || !selectedClass || !user || !testMode) return;
        
        const testConfig = ((getTestConfigs(testMode) as any)[selectedClass]?.tests || []).find((t: any) => t.id === currentTest.id);
        const marksPerQuestion = testConfig?.marksPerQuestion || 1;
        let correctAnswers = 0;
        currentTest.questions.forEach((q, index) => { if (q.correctAnswer === userAnswers[index]) { correctAnswers++; } });
        const timeTaken = currentTest.time - timeLeft;
        const score = correctAnswers * marksPerQuestion;
        
        addNotification(user.email, {
            id: `test-${currentTest.id}-${Date.now()}`,
            icon: 'CheckCircle',
            title: 'टेस्ट पूरा हुआ!',
            description: `आपने ${currentTest.subject} में ${testConfig.questions * marksPerQuestion} में से ${score} अंक प्राप्त किए।`,
            read: false,
            timestamp: new Date().toISOString(),
        });

        setProgress(prev => {
            if (!prev) return getInitialProgress(testMode, selectedClass);
            const newProgress = { ...prev, [currentTest.id]: { completed: true, score: correctAnswers, answers: userAnswers, questions: currentTest.questions, timeTaken: timeTaken } };
            
            const config = (getTestConfigs(testMode) as any)[selectedClass];
            const allTestsCompleted = config.tests.every((t: any) => newProgress[t.id]?.completed);

            if (allTestsCompleted) {
                const totalScoreObtained = config.tests.reduce((sum: number, test: any) => {
                    if (test.isQualifying) return sum;
                    const testProgress = newProgress[test.id];
                    return sum + (testProgress.score * test.marksPerQuestion);
                }, 0);
                const percentage = (totalScoreObtained / config.totalMarks) * 100;
                
                const newOverallTopper = { 
                    name: user.name, 
                    class: selectedClass, 
                    percentage: percentage, 
                    date: new Date().toISOString(), 
                    photo: user.profilePhotoUrl || '', 
                    hint: 'student portrait', 
                    testMode: testMode 
                };
                
                const storageKey = `mock-test-toppers`;
                const overallToppersRaw = localStorage.getItem(storageKey);
                const overallToppers = overallToppersRaw ? JSON.parse(overallToppersRaw) : [];
                const otherToppers = overallToppers.filter((t: any) => !(t.name === user.name && t.class === selectedClass && t.testMode === testMode));
                const updatedToppers = [...otherToppers, newOverallTopper];
                updatedToppers.sort((a: any, b: any) => b.percentage - a.percentage);
                localStorage.setItem(storageKey, JSON.stringify(updatedToppers.slice(0, 20)));
            }
            return newProgress;
        });
        setPageState('test-dashboard');
        setCurrentTest(null);
        toast({ title: 'टेस्ट पूरा हुआ!', description: `${currentTest.subject} का आपका परिणाम सेव कर लिया गया है।` });
    }, [currentTest, userAnswers, timeLeft, selectedClass, user, toast, testMode]);
    
    const handleFinishSubjectTest = useCallback(() => {
        if (!subjectTest || !user || !testMode) return;
        let score = 0;
        subjectTest.questions.forEach((q, i) => { if (q.correctAnswer === subjectTestAnswers[i]) score++; });
        
        const percentage = (score / subjectTest.questions.length) * 100;
        let performanceStatus: 'पास' | 'औसत' | 'फेल';
        if (percentage >= 65) { performanceStatus = 'पास'; }
        else { performanceStatus = 'फेल'; }
        
        addNotification(user.email, {
            id: `test-${testMode}-${subjectTest.subject}-${Date.now()}`,
            icon: 'CheckCircle',
            title: 'प्रैक्टिस टेस्ट पूरा हुआ!',
            description: `आपने ${testMode.toUpperCase()} - ${subjectTest.subject} में ${subjectTest.questions.length} में से ${score} अंक प्राप्त किए।`,
            read: false,
            timestamp: new Date().toISOString(),
        });

        const certData = {
          studentName: user.name,
          studentClass: subjectTest.config.classLevel,
          testTitle: `${testMode.toUpperCase()} - ${subjectTest.subject}`,
          totalScore: score,
          totalPossibleMarks: subjectTest.questions.length,
          percentage: percentage,
          performanceStatus: performanceStatus,
          subjectResults: [{
              subject: subjectTest.subject,
              score: score,
              totalMarks: subjectTest.questions.length
          }]
        };
        setCertificateData(certData);

        const topper = {
            name: user.name, class: subjectTest.config.classLevel, percentage: percentage,
            date: new Date().toISOString(), photo: user.profilePhotoUrl || '', hint: 'student portrait',
            testMode: testMode, subject: subjectTest.subject,
        };
        const storageKey = `practice-test-toppers`;
        const toppersRaw = localStorage.getItem(storageKey);
        const toppers = toppersRaw ? JSON.parse(toppersRaw) : [];
        const otherToppers = toppers.filter((t: any) => !(t.name === user.name && t.testMode === testMode && t.subject === topper.subject && t.class === topper.class));
        const updatedToppers = [...otherToppers, topper];
        updatedToppers.sort((a: any, b: any) => b.percentage - a.percentage);
        localStorage.setItem(storageKey, JSON.stringify(updatedToppers.slice(0, 20)));

        setPageState('certificate');
        setSubjectTest(null);
    }, [subjectTest, subjectTestAnswers, user, testMode]);


    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (pageState === 'test-in-progress' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (pageState === 'test-in-progress' && timeLeft <= 0) {
            if(currentTest) handleFinishMockTest();
            else if(subjectTest) handleFinishSubjectTest();
            toast({ title: "समय समाप्त!", description: "आपका टेस्ट स्वचालित रूप से सबमिट कर दिया गया है।" });
        }
        return () => clearInterval(timer);
    }, [pageState, timeLeft, handleFinishMockTest, handleFinishSubjectTest, toast, currentTest, subjectTest]);

    const handleAnswer = (option: string) => {
        const answers = pageState === 'test-in-progress' && currentTest ? userAnswers : subjectTestAnswers;
        const setAnswers = pageState === 'test-in-progress' && currentTest ? setUserAnswers : setSubjectTestAnswers;
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = option;
        setAnswers(newAnswers);
    };

    const handleResetProgress = () => {
        setConfirmAction({
            title: 'क्या आप निश्चित हैं?', description: `यह कक्षा ${selectedClass} के लिए आपकी सभी ${testMode} परीक्षा प्रगति को रीसेट कर देगा। यह क्रिया पूर्ववत नहीं की जा सकती।`,
            onConfirm: () => {
                if(selectedClass && user?.email && testMode){
                    localStorage.removeItem(`${testMode}-progress-${selectedClass}-${user.email}`);
                    setProgress(getInitialProgress(testMode, selectedClass));
                    toast({ title: 'प्रगति रीसेट', description: ` आपकी प्रगति रीसेट कर दी गई है।` });
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
                link.download = `mock-test-certificate.png`;
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

    const handleStartSubjectTest = async (values: { subject: string, classLevel: string }) => {
        if (!user || !testMode) return;
        const testConfigMap: any = {
            olympiad: { subjects: ["Maths", "Science", "English", "General Knowledge"], questions: 25, time: 1800 },
            rtse: { subjects: ["GK", "English", "Math", "Science", "Hindi"], questions: 20, time: 5400 },
            devnarayan: { subjects: ["GK", "Hindi", "Math", "English", "पर्यावरण अध्ययन"], questions: 20, time: 7200 },
        };
        const currentConfig = testConfigMap[testMode];
        if(!currentConfig) return;

        let questionsToGenerate: { subject: string, count: number }[] = [];
        let totalTime = 0;
        let testTitle = '';

        if(testMode === 'olympiad') {
            questionsToGenerate.push({ subject: values.subject, count: currentConfig.questions });
            totalTime = currentConfig.time;
            testTitle = values.subject;
        } else {
            questionsToGenerate = currentConfig.subjects.map((s: string) => ({ subject: s, count: currentConfig.questions }));
            totalTime = currentConfig.time;
            testTitle = testMode.toUpperCase();
        }
        
        setIsLoading(true);
        try {
            const allQuestions: AiQuestion[] = [];
            for (const q of questionsToGenerate) {
                const result = await generateAiTest({ subject: q.subject, questionCount: q.count, classLevel: values.classLevel, language: 'Hindi', examContext: `${testMode} class ${values.classLevel}` });
                if (result.questions && result.questions.length > 0) {
                    allQuestions.push(...result.questions);
                } else {
                     throw new Error(`विषय ${q.subject} के लिए प्रश्न उत्पन्न करने में विफल।`);
                }
            }

            if(allQuestions.length > 0){
                setSubjectTest({ subject: testTitle, questions: allQuestions, config: { ...values, time: totalTime } });
                setSubjectTestAnswers(new Array(allQuestions.length).fill(''));
                setCurrentQuestionIndex(0);
                setTimeLeft(totalTime);
                setPageState('test-in-progress');
            } else {
                 toast({ variant: 'destructive', title: 'Failed to generate test.', description: 'The AI failed to return any questions. Please try again.' });
            }

        } catch (e: any) {
            toast({ variant: 'destructive', title: 'एक त्रुटि हुई।', description: e.message || 'परीक्षा उत्पन्न करने में विफल। कृपया पुनः प्रयास करें।' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const prepareCertificate = () => {
        if (!selectedClass || !progress || !user || !testMode) return;
        const config = (getTestConfigs(testMode) as any)[selectedClass];
        const subjectResults = config.tests.map((test: any) => {
            const testProgress = progress[test.id];
            const score = testProgress.completed ? testProgress.score * test.marksPerQuestion : 0;
            const isQualified = test.isQualifying && testProgress.completed ? (testProgress.score * test.marksPerQuestion) >= test.qualifyingMarks! : undefined;
            return { subject: test.subject, score: score, totalMarks: test.questions * test.marksPerQuestion, isQualifying: !!test.isQualifying, qualifyingStatus: isQualified === undefined ? undefined : (isQualified ? 'योग्य' : 'योग्य नहीं') };
        });
        const totalScoreObtained = subjectResults.reduce((sum: number, res: any) => res.isQualifying ? sum : sum + res.score, 0);
        const totalPossibleScore = subjectResults.reduce((sum: number, res: any) => res.isQualifying ? sum : sum + res.totalMarks, 0);
        const percentage = (totalScoreObtained / totalPossibleScore) * 100;
        const allQualifyingPassed = subjectResults.filter((r: any) => r.isQualifying).every((r: any) => r.qualifyingStatus === 'योग्य');
        let performanceStatus: 'पास' | 'औसत' | 'फेल' | 'योग्य नहीं';
        if (!allQualifyingPassed) {
            performanceStatus = 'योग्य नहीं';
        } else if (totalScoreObtained >= config.passingScore) {
            performanceStatus = 'पास';
        } else if (totalScoreObtained < config.failScore) {
            performanceStatus = 'फेल';
        } else {
            performanceStatus = 'औसत';
        }
        setCertificateData({
            studentName: user.name, studentClass: `कक्षा ${selectedClass}`, testTitle: `${testMode.toUpperCase()} मॉक टेस्ट - कक्षा ${selectedClass}`,
            totalScore: totalScoreObtained, totalPossibleMarks: config.totalMarks, percentage, performanceStatus, subjectResults,
        });
        setPageState('certificate');
    };

    const renderModeSelection = () => (
        <div className="flex flex-col gap-6 p-4">
            <div>
                <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">AI टेस्ट सेंटर</h1>
                <p className="text-muted-foreground">अपनी तैयारी का आकलन करने के लिए एक मोड चुनें।</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {[
                    { mode: 'sainik', title: 'सैनिक स्कूल मॉक टेस्ट', icon: Shield, desc: 'AISSEE के आधिकारिक पैटर्न के आधार पर पूर्ण मॉक टेस्ट का प्रयास करें।' },
                    { mode: 'rms', title: 'RMS मॉक टेस्ट', icon: Award, desc: 'राष्ट्रीय मिलिट्री स्कूल के पैटर्न पर आधारित मॉक टेस्ट का प्रयास करें।' },
                    { mode: 'jnv', title: 'JNV मॉक टेस्ट', icon: BookCopy, desc: 'जवाहर नवोदय विद्यालय के पैटर्न पर आधारित मॉक टेस्ट का प्रयास करें।' },
                    { mode: 'rtse', title: 'RTSE प्रैक्टिस टेस्ट', icon: Book, desc: 'RTSE परीक्षा के लिए अपनी विशेषज्ञता का परीक्षण करें।' },
                    { mode: 'olympiad', title: 'Olympiad प्रैक्टिस टेस्ट', icon: Star, desc: 'Olympiad के लिए विषय-वार अभ्यास करें।' },
                    { mode: 'devnarayan', title: 'Devnarayan Gurukul टेस्ट', icon: Sun, desc: 'Devnarayan Gurukul योजना के लिए अभ्यास करें।' },
                ].map(({ mode, title, icon: Icon, desc }) => (
                    <Card key={mode} className="hover:border-primary hover:shadow-lg transition-all cursor-pointer bg-card" onClick={() => handleSelectMode(mode as TestMode)}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <Icon className="w-8 h-8 text-primary"/>
                                <div>
                                    <h2 className="text-lg font-headline font-bold">{title}</h2>
                                    <p className="text-muted-foreground text-sm">{desc}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderClassSelection = () => (
        <div className="flex flex-col gap-8 p-4">
            <div className="relative">
                <Button variant="ghost" size="icon" className="absolute -left-4 sm:-left-12 -top-2" onClick={() => setPageState('mode-selection')}><ArrowLeft className="w-5 h-5"/></Button>
                <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">{testMode?.toUpperCase()} मॉक टेस्ट</h1>
                <p className="text-muted-foreground text-center sm:text-left">अपनी तैयारी का आकलन करने के लिए एक कक्षा चुनें।</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
              {Object.keys((getTestConfigs(testMode!) as any)).map(classId => (
                  <Card key={classId} className="hover:border-primary hover:shadow-lg transition-all cursor-pointer bg-card" onClick={() => handleSelectClass(classId)}>
                      <CardContent className="pt-6"><div className="flex flex-col items-center text-center gap-4"><BookCopy className="w-12 h-12 text-primary"/><h2 className="text-2xl font-headline font-bold">कक्षा {classId}</h2><Button className="w-full mt-2">कक्षा {classId} चुनें</Button></div></CardContent>
                  </Card>
              ))}
            </div>
        </div>
    );
    
    const renderTestDashboard = () => {
        if (!selectedClass || !progress || !testMode) return null;
        const config = (getTestConfigs(testMode) as any)[selectedClass];
        if(!config) return <p>No config for this class.</p>
        const completedCount = config.tests.filter((t: any) => progress[t.id]?.completed).length;
        const allTestsCompleted = completedCount === config.tests.length;
        return (
            <div className="flex flex-col gap-6 p-4">
                <div className="relative">
                    <Button variant="ghost" size="icon" className="absolute -left-4 sm:-left-12 -top-2" onClick={() => setPageState('class-selection')}><ArrowLeft className="w-5 h-5"/></Button>
                    <div className="text-center sm:text-left"><h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">मॉक टेस्ट डैशबोर्ड - {testMode.toUpperCase()} कक्षा {selectedClass}</h1><p className="text-muted-foreground">अपनी प्रगति को ट्रैक करें और टेस्ट शुरू करें। कुल समय: {config.totalTimeMinutes} मिनट।</p></div>
                </div>
                <Card className="bg-card"><CardHeader><CardTitle>आपकी प्रगति</CardTitle><CardDescription>{completedCount} / {config.tests.length} टेस्ट पूरे हुए।</CardDescription></CardHeader><CardContent><Progress value={(completedCount / config.tests.length) * 100} /></CardContent></Card>
                <div className="grid gap-4 md:grid-cols-2">
                    {config.tests.map((test: any) => {
                        const testProgress = progress[test.id];
                        return (
                            <Card key={test.id} className="flex flex-col bg-card">
                                <CardHeader><CardTitle>{test.subject}</CardTitle><CardDescription>{test.questions} प्रश्न, {test.isQualifying ? 'क्वालीफाइंग' : `${test.questions * test.marksPerQuestion} अंक`}</CardDescription></CardHeader>
                                <CardContent className="flex-grow">
                                    {testProgress?.completed ? (
                                        <div className="flex items-center gap-2 text-green-500">
                                            <CheckCircle className="w-5 h-5"/>
                                            <div>
                                                <p className="font-semibold">पूरा हुआ! स्कोर: {testProgress.score * test.marksPerQuestion} / {test.questions * test.marksPerQuestion}</p>
                                                {test.isQualifying && <p className={`text-sm font-bold ${testProgress.score * test.marksPerQuestion >= test.qualifyingMarks! ? 'text-green-500' : 'text-red-500'}`}>{testProgress.score * test.marksPerQuestion >= test.qualifyingMarks! ? 'योग्य' : 'योग्य नहीं'}</p>}
                                            </div>
                                        </div>
                                    ) : ( <div className="flex items-center gap-2 text-muted-foreground"><p>अभी तक शुरू नहीं किया गया।</p></div> )}
                                </CardContent>
                                <CardFooter className="flex justify-between"><Button variant="outline" disabled={!testProgress?.completed} onClick={() => setSolutionSheet({open: true, testId: test.id})}>हल देखें</Button><Button onClick={() => handleStartMockTest(test.id)}>{testProgress?.completed ? 'पुनः प्रयास करें' : 'टेस्ट शुरू करें'}</Button></CardFooter>
                            </Card>
                        );
                    })}
                </div>
                <Card className="bg-primary/10"><CardHeader><CardTitle className="font-headline flex items-center gap-2"><Trophy/> अंतिम चरण</CardTitle><CardDescription>सभी टेस्ट पूरे करने के बाद, आप अपना अंतिम प्रदर्शन प्रमाणपत्र उत्पन्न कर सकते हैं।</CardDescription></CardHeader><CardContent className="flex flex-col sm:flex-row gap-4"><Button onClick={prepareCertificate} disabled={!allTestsCompleted} className="flex-1">प्रमाणपत्र उत्पन्न करें{!allTestsCompleted && <span className="ml-2 text-xs">({completedCount}/{config.tests.length} पूर्ण)</span>}</Button><Button variant="destructive" onClick={handleResetProgress} className="flex-1"><RefreshCw className="mr-2 h-4 w-4"/>प्रगति रीसेट करें</Button></CardContent></Card>
            </div>
        );
    };

    const renderTestInProgress = () => {
        const currentQData = currentTest || subjectTest;
        if (!currentQData) return null;
        
        const currentQ = currentQData.questions[currentQuestionIndex];
        const answers = subjectTest ? subjectTestAnswers : userAnswers;
        const finishHandler = subjectTest ? handleFinishSubjectTest : handleFinishMockTest;

        const nextHandler = () => {
            if (currentQuestionIndex < currentQData.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                finishHandler();
            }
        };

        return (
            <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in p-4">
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div><CardTitle className="font-headline">{currentQData.subject}</CardTitle><CardDescription>प्रश्न {currentQuestionIndex + 1} / {currentQData.questions.length}</CardDescription></div>
                        <Badge variant="outline" className="flex items-center gap-2 text-lg py-2 px-4"><Timer className="w-5 h-5"/>{formatTime(timeLeft)}</Badge>
                    </CardHeader>
                    <CardContent>
                        <Progress value={((currentQuestionIndex + 1) / currentQData.questions.length) * 100} className="mb-6"/>
                        <p className="text-xl font-semibold mb-4">{currentQ.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQ.options.map(option => <Button key={option} variant={answers[currentQuestionIndex] === option ? 'default' : 'outline'} onClick={() => handleAnswer(option)} className="justify-start h-auto py-3 text-left">{option}</Button>)}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                         <Button variant="destructive" onClick={() => { setConfirmAction({ title: 'क्या आप निश्चित हैं?', description: 'यह टेस्ट को समाप्त कर देगा और आपके परिणामों की गणना करेगा।', onConfirm: finishHandler }); setIsConfirming(true); }}>जल्दी सबमिट करें</Button>
                        <Button onClick={nextHandler} disabled={!answers[currentQuestionIndex]}>
                            {currentQuestionIndex < currentQData.questions.length - 1 ? 'अगला प्रश्न' : 'टेस्ट खत्म करें'} <ChevronRight className="w-4 h-4 ml-2"/>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    };

    const CertificateRenderer = () => {
        if (!certificateData) return null;
        return (
            <div className="flex flex-col items-center gap-6 p-4">
                <div ref={certificateRef} className="p-4 bg-background w-full max-w-4xl"><TestResultCertificate {...certificateData}/></div>
                <Card className="w-full max-w-2xl bg-card"><CardHeader><CardTitle className="font-headline text-center">अगले चरण</CardTitle></CardHeader><CardContent className="flex flex-wrap justify-center gap-4"><Button onClick={handleDownloadCertificate}><Download className="mr-2 h-4 w-4" />सर्टिफिकेट डाउनलोड करें</Button><Button variant="outline" onClick={() => { setPageState('mode-selection'); setCertificateData(null); }}><ArrowLeft className="mr-2 h-4 w-4" />डैशबोर्ड पर वापस जाएं</Button></CardContent></Card>
            </div>
        );
    }
    
    const renderSolutionSheet = () => {
        if (!solutionSheet.testId || !progress || !selectedClass || !testMode) return null;
        const testProgress = progress[solutionSheet.testId];
        if (!testProgress || !testProgress.completed) return null;
        const subjectName = (getTestConfigs(testMode) as any)[selectedClass].tests.find((t: any)=>t.id === solutionSheet.testId)?.subject;
        return (<Sheet open={solutionSheet.open} onOpenChange={(isOpen) => setSolutionSheet({open: isOpen, testId: isOpen ? solutionSheet.testId : null})}><SheetContent className="w-full max-w-2xl sm:max-w-2xl bg-card"><SheetHeader><SheetTitle>परीक्षा का हल: {subjectName}</SheetTitle><SheetDescription>आपके द्वारा दिए गए उत्तरों और सही उत्तरों की समीक्षा करें।</SheetDescription></SheetHeader><ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-4"><div className="space-y-4">{testProgress.questions.map((q, index) => (<div key={index} className={`p-3 rounded-md flex items-start gap-3 ${testProgress.answers[index] === q.correctAnswer ? 'bg-green-500/10' : 'bg-red-500/10'}`}>{testProgress.answers[index] === q.correctAnswer ? <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"/> : <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0"/>}<div><p className="font-semibold">{index + 1}. {q.question}</p><p className="text-sm text-muted-foreground">आपका उत्तर: <span className="font-medium">{testProgress.answers[index] || 'उत्तर नहीं दिया'}</span></p><p className="text-sm font-bold text-primary">सही उत्तर: <span className="font-medium">{q.correctAnswer}</span></p></div></div>))}</div></ScrollArea></SheetContent></Sheet>);
    }

    const renderSubjectTestSetup = () => {
        if(!testMode) return null;
        const testConfigMap: any = {
            olympiad: { title: "Olympiad प्रैक्टिस टेस्ट", subjects: ["Maths", "Science", "English", "General Knowledge"] },
            rtse: { title: "RTSE प्रैक्टिस टेस्ट", subjects: [] },
            devnarayan: { title: "Devnarayan Gurukul टेस्ट", subjects: [] },
        };
        const currentConfig = testConfigMap[testMode];
        return (
            <div className="flex flex-col gap-8 p-4">
                 <div className="relative">
                    <Button variant="ghost" size="icon" className="absolute -left-4 sm:-left-12 -top-2" onClick={() => setPageState('mode-selection')}><ArrowLeft className="w-5 h-5"/></Button>
                    <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">{currentConfig.title}</h1>
                    <p className="text-muted-foreground text-center sm:text-left">अपनी कक्षा चुनें और अभ्यास शुरू करें।</p>
                </div>
                 <Card className="w-full max-w-md mx-auto bg-card">
                    <CardHeader><CardTitle>टेस्ट सेटअप</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); const data = new FormData(e.currentTarget); const values = { subject: data.get('subject') as string, classLevel: data.get('classLevel') as string }; handleStartSubjectTest(values); }} className="space-y-4">
                            <Select name="classLevel" required>
                                <SelectTrigger><SelectValue placeholder="एक कक्षा चुनें" /></SelectTrigger>
                                <SelectContent>
                                    {['6', '7', '8', '9', '10'].map(c => <SelectItem key={c} value={c}>कक्षा {c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {currentConfig.subjects.length > 0 && (
                                <Select name="subject" required>
                                    <SelectTrigger><SelectValue placeholder="एक विषय चुनें" /></SelectTrigger>
                                    <SelectContent>
                                        {currentConfig.subjects.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                            <Button className="w-full" disabled={isLoading} type="submit">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                प्रैक्टिस शुरू करें
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (isLoading) return <div className="flex flex-col items-center justify-center gap-4 h-full"><Loader2 className="w-12 h-12 animate-spin text-primary" /><p className="text-muted-foreground">आपकी परीक्षा तैयार हो रही है, कृपया प्रतीक्षा करें...</p></div>;
    
    const renderPageContent = () => {
        switch (pageState) {
            case 'mode-selection': return renderModeSelection();
            case 'class-selection': return renderClassSelection();
            case 'test-dashboard': return renderTestDashboard();
            case 'test-in-progress': return renderTestInProgress();
            case 'certificate': return <CertificateRenderer />;
            case 'subject-test-setup': return renderSubjectTestSetup();
            default: return renderModeSelection();
        }
    }

    return (
        <div className="container mx-auto p-0 sm:p-4">
            {renderPageContent()}
            {renderSolutionSheet()}
            <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle><AlertDialogDescription>{confirmAction?.description}</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel onClick={() => setConfirmAction(null)}>रद्द करें</AlertDialogCancel><AlertDialogAction onClick={() => { confirmAction?.onConfirm(); setIsConfirming(false); setConfirmAction(null); }}>पुष्टि करें</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
