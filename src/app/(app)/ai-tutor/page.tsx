'use client';

import { useActionState, useState } from 'react';
import { askAcademicQuestion, AskAcademicQuestionOutput } from '@/ai/flows/academic-question-tutor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const initialState: { output: AskAcademicQuestionOutput | null; error?: string } = {
  output: null,
};

export default function AiTutorPage() {
  const [state, formAction, isSubmitting] = useActionState(async (_prevState: any, formData: FormData) => {
    const question = formData.get('question') as string;
    if (!question) {
      return { output: null, error: 'Please enter a question.' };
    }
    try {
      const output = await askAcademicQuestion({ question });
      return { output };
    } catch (e: any) {
      return { output: null, error: e.message || 'An unexpected error occurred. Check your API Key.' };
    }
  }, initialState);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">AI ट्यूटर</h1>
        <p className="text-muted-foreground">
          कोई भी शैक्षणिक प्रश्न पूछें और तुरंत हिंदी में उत्तर पाएं।
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="h-full bg-card">
            <form action={formAction}>
              <CardHeader>
                <CardTitle className="font-headline">अपना शैक्षणिक सवाल पूछें</CardTitle>
                <CardDescription>विस्तृत उत्तर पाने के लिए अपना प्रश्न नीचे दर्ज करें।</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full gap-2">
                  <Label htmlFor="question-input" className="sr-only">प्रश्न</Label>
                  <Textarea
                    id="question-input"
                    name="question"
                    placeholder="अपना प्रश्न यहाँ लिखें, जैसे 'भारत का सबसे ऊँचा पुल कौन सा है?'"
                    rows={6}
                    required
                    className="text-base bg-secondary"
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
        </div>

        <div className="md:col-span-1">
          {state.output ? (
            <Card className="animate-in fade-in sticky top-20 bg-card">
              <CardHeader>
                <CardTitle className="font-headline">AI का जवाब</CardTitle>
                <div className="flex gap-2 pt-2 flex-wrap">
                  <Badge variant="secondary">विषय: {state.output.subject}</Badge>
                  <Badge variant="secondary">कठिनाई: {state.output.difficultyLevel}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">{state.output.answer}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-20 bg-secondary/30 border-dashed">
                <CardContent className="p-6 text-center">
                    <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-muted-foreground">आपका जवाब यहाँ दिखेगा</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        बाएं ओर अपना सवाल पूछें।
                    </p>
                </CardContent>
            </Card>
          )}
          {state.error && <p className="text-destructive mt-4">{state.error}</p>}
        </div>
      </div>
    </div>
  );
}
