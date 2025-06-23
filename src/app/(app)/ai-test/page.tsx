'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateAiTest, AiQuestion } from '@/ai/flows/generate-ai-test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Timer, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type TestStatus = 'not-started' | 'in-progress' | 'finished';

const TEST_DURATION_SECONDS = 300; // 5 minutes

export default function AiTestPage() {
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<AiQuestion[]>([]);
  const [status, setStatus] = useState<TestStatus>('not-started');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const { toast } = useToast();

  const handleTestFinish = useCallback(() => {
    setStatus('finished');
    let finalScore = 0;
    questions.forEach((q, index) => {
      if (q.correctAnswer === userAnswers[index]) {
        finalScore++;
      }
    });
    setScore(finalScore);
  }, [questions, userAnswers]);


  useEffect(() => {
    if (status !== 'in-progress') return;

    if (timeLeft <= 0) {
      handleTestFinish();
      toast({
        title: "Time's up!",
        description: "The test has ended.",
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeLeft, handleTestFinish, toast]);

  const startTest = async () => {
    if (!subject) {
        toast({ variant: 'destructive', title: 'Please select a subject.'});
        return;
    }
    setIsLoading(true);
    try {
      const result = await generateAiTest({ subject });
      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        setStatus('in-progress');
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(result.questions.length).fill(''));
        setTimeLeft(TEST_DURATION_SECONDS);
        setScore(0);
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Failed to generate test.', description: 'Please try again later.'});
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
    setSubject('');
    setQuestions([]);
    setIsLoading(false);
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating your test, please wait...</p>
      </div>
    );
  }

  if (status === 'finished') {
    return (
        <Card className="w-full max-w-2xl mx-auto animate-in fade-in">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Test Results</CardTitle>
                <CardDescription>You scored {score} out of {questions.length} in {subject}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {questions.map((q, index) => (
                    <div key={index} className={`p-3 rounded-md ${userAnswers[index] === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        <p className="font-semibold">{index + 1}. {q.question}</p>
                        <p className="text-sm text-muted-foreground">Your answer: {userAnswers[index] || 'Not answered'}</p>
                        <p className="text-sm font-bold text-primary">Correct answer: {q.correctAnswer}</p>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button onClick={resetTest}>Take Another Test</Button>
            </CardFooter>
        </Card>
    )
  }

  if (status === 'in-progress') {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">{subject} Test</CardTitle>
                    <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-2 text-lg">
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
                            className="justify-start h-auto py-3"
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={goToNextQuestion} disabled={!userAnswers[currentQuestionIndex]}>
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">AI Test Center</h1>
        <p className="text-muted-foreground">
          Select a subject and start a timed test generated by AI.
        </p>
      </div>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Start a New Test</CardTitle>
          <CardDescription>Choose a subject to begin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSubject} value={subject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Maths">Maths</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Geography">Geography</SelectItem>
              <SelectItem value="General Knowledge">General Knowledge</SelectItem>
            </SelectContent>
          </Select>
          <Alert>
            <Timer className="h-4 w-4" />
            <AlertTitle>Timed Test</AlertTitle>
            <AlertDescription>
              You will have 5 minutes to complete 5 questions.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={startTest} className="w-full" disabled={!subject || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
