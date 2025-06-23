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
  const [state, formAction, isSubmitting] = useActionState(async (_prevState: any, formData: FormData) => {
    const rollNumber = formData.get('rollNumber') as string;
    if (!rollNumber) {
      return { output: null, error: 'Please enter a roll number.' };
    }
    try {
      const output = await checkScholarshipResult({ rollNumber });
      return { output };
    } catch (e: any) {
      return { output: null, error: e.message || 'An unexpected error occurred. Check your API Key.' };
    }
  }, initialState);


  const isPass = state.output?.result.toLowerCase().includes('pass') || state.output?.result.toLowerCase().includes('बधाई');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">AI छात्रवृत्ति चैट</h1>
        <p className="text-muted-foreground">
          अपनी छात्रवृत्ति का परिणाम जांचने के लिए अपना रोल नंबर दर्ज करें।
        </p>
      </div>

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">अपना परिणाम जांचें</CardTitle>
            <CardDescription>
              मेरा रोल नंबर <code className="bg-muted px-1 rounded-sm">123456</code> है, कृपया बताएं कि मेरा स्कॉलरशिप रिज़ल्ट पास है या फेल
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="rollNumber">रोल नंबर</Label>
              <Input id="rollNumber" name="rollNumber" type="text" placeholder="जैसे, 123456" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              परिणाम प्राप्त करें
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
              छात्रवृत्ति परिणाम
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
