'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { askAcademicQuestion, AskAcademicQuestionOutput } from '@/ai/flows/academic-question-tutor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const initialState: { output: AskAcademicQuestionOutput | null; error?: string } = {
  output: null,
};

export default function AiTutorPage() {
  const [state, formAction] = useFormState(async (_prevState: any, formData: FormData) => {
    const question = formData.get('question') as string;
    if (!question) {
      return { output: null, error: 'Please enter a question.' };
    }
    try {
      const output = await askAcademicQuestion({ question });
      return { output };
    } catch (e: any) {
      return { output: null, error: e.message || 'An unexpected error occurred.' };
    }
  }, initialState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">AI Tutor</h1>
        <p className="text-muted-foreground">
          Ask any academic question and get an instant answer in Hindi.
        </p>
      </div>

      <Card>
        <form
          action={(formData) => {
            setIsSubmitting(true);
            formAction(formData);
          }}
          onSubmit={() => setIsSubmitting(true)}
          onChange={() => setIsSubmitting(false)}
        >
          <CardHeader>
            <CardTitle className="font-headline">अपना शैक्षणिक सवाल पूछें</CardTitle>
            <CardDescription>Enter your question below to get a detailed answer.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-2">
              <Label htmlFor="question-input" className="sr-only">Question</Label>
              <Textarea
                id="question-input"
                name="question"
                placeholder="Type your question here..."
                rows={4}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              उत्तर प्राप्त करें
            </Button>
          </CardFooter>
        </form>
      </Card>

      {state.output && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="font-headline">उत्तर</CardTitle>
            <div className="flex gap-2 pt-2">
              <Badge variant="secondary">विषय: {state.output.subject}</Badge>
              <Badge variant="secondary">कठिनाई: {state.output.difficultyLevel}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{state.output.answer}</p>
          </CardContent>
        </Card>
      )}

      {state.error && <p className="text-destructive">{state.error}</p>}
    </div>
  );
}
