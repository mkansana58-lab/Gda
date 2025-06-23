'use client';

import { useState, useActionState } from 'react';
import { checkScholarshipResult, CheckScholarshipResultOutput } from '@/ai/flows/scholarship-result';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, UserCheck, UserX } from 'lucide-react';
import { Label } from '@/components/ui/label';

const initialState: { output: CheckScholarshipResultOutput | null; error?: string } = {
  output: null,
};

export default function AiChatPage() {
  const [state, formAction] = useActionState(async (_prevState: any, formData: FormData) => {
    const rollNumber = formData.get('rollNumber') as string;
    if (!rollNumber) {
      return { output: null, error: 'Please enter a roll number.' };
    }
    try {
      const output = await checkScholarshipResult({ rollNumber });
      return { output };
    } catch (e: any) {
      return { output: null, error: e.message || 'An unexpected error occurred.' };
    }
  }, initialState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPass = state.output?.result.toLowerCase().includes('pass');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">AI Scholarship Chat</h1>
        <p className="text-muted-foreground">
          Enter your roll number to check your scholarship result.
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
            <CardTitle className="font-headline">Check Your Result</CardTitle>
            <CardDescription>
              मेरा रोल नंबर <code className="bg-muted px-1 rounded-sm">123456</code> है, कृपया बताएं कि मेरा स्कॉलरशिप रिज़ल्ट पास है या फेल
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input id="rollNumber" name="rollNumber" type="text" placeholder="e.g., 123456" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Result
            </Button>
          </CardFooter>
        </form>
      </Card>

      {state.output && (
        <Card className={`animate-in fade-in ${isPass ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              {isPass ? 
                <UserCheck className="w-8 h-8 text-green-500" /> : 
                <UserX className="w-8 h-8 text-red-500" />
              }
              Scholarship Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{state.output.result}</p>
          </CardContent>
        </Card>
      )}

      {state.error && <p className="text-destructive">{state.error}</p>}
    </div>
  );
}
