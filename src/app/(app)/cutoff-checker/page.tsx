'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';
import { checkSelectionChance } from '@/ai/flows/check-selection-chance';
import { useToast } from '@/hooks/use-toast';

const cutoffData: Record<string, Record<string, any>> = {
  'RMS': {
    '2023': {
      eligibility: "कक्षा 6 के लिए 10-12 वर्ष, कक्षा 9 के लिए 13-15 वर्ष।",
      merit: "लिखित परीक्षा, साक्षात्कार और मेडिकल फिटनेस पर आधारित।",
      cutoff: [
        { category: 'सामान्य', marks: '120/150' },
        { category: 'ओबीसी', marks: '115/150' },
        { category: 'एससी/एसटी', marks: '105/150' },
      ],
    },
    '2024': {
      eligibility: "कक्षा 6 के लिए 10-12 वर्ष, कक्षा 9 के लिए 13-15 वर्ष। (अनुमानित)",
      merit: "लिखित परीक्षा, साक्षात्कार और मेडिकल फिटनेस पर आधारित। (अनुमानित)",
      cutoff: [
        { category: 'सामान्य', marks: '125/150 (अनुमानित)' },
        { category: 'ओबीसी', marks: '118/150 (अनुमानित)' },
        { category: 'एससी/एसटी', marks: '110/150 (अनुमानित)' },
      ],
    },
  },
  'JNV': {
    '2023': {
      eligibility: "कक्षा 6 के लिए 9-13 वर्ष। छात्र को जिले का निवासी होना चाहिए।",
      merit: "JNVST परीक्षा में प्रदर्शन पर आधारित।",
      cutoff: [
        { category: 'शहरी सामान्य', marks: '75/100' },
        { category: 'ग्रामीण सामान्य', marks: '72/100' },
        { category: 'शहरी ओबीसी', marks: '70/100' },
        { category: 'ग्रामीण ओबीसी', marks: '68/100' },
      ],
    },
  },
  'RIMC': {
    '2023': {
      eligibility: "कक्षा 8 के लिए 11.5-13 वर्ष। छात्र को कक्षा 7 में अध्ययनरत होना चाहिए।",
      merit: "लिखित परीक्षा (गणित, अंग्रेजी, सामान्य ज्ञान), साक्षात्कार।",
      cutoff: [
        { category: 'प्रत्येक विषय में न्यूनतम', marks: '50%' },
        { category: 'कुल मिलाकर', marks: 'प्रदर्शन पर निर्भर' },
      ],
    },
  },
};

const chanceFormSchema = z.object({
  exam: z.string().min(1, { message: 'Please select an exam.' }),
  marksObtained: z.coerce.number().min(0, 'Marks cannot be negative.'),
  totalMarks: z.coerce.number().min(1, 'Total marks must be greater than 0.'),
}).refine(data => data.marksObtained <= data.totalMarks, {
    message: "Marks obtained cannot be greater than total marks.",
    path: ["marksObtained"],
});

type ChanceFormValues = z.infer<typeof chanceFormSchema>;

export default function CutoffCheckerPage() {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ analysis: string, suggestion: string, probability: number } | null>(null);
  const { toast } = useToast();

  const availableYears = selectedExam ? Object.keys(cutoffData[selectedExam] || {}) : [];
  const data = (selectedExam && selectedYear && cutoffData[selectedExam]?.[selectedYear]) || null;
  
  const form = useForm<ChanceFormValues>({
    resolver: zodResolver(chanceFormSchema),
    defaultValues: { exam: '', marksObtained: undefined, totalMarks: undefined },
  });

  async function onChanceCheckSubmit(values: ChanceFormValues) {
    setIsLoading(true);
    setAiResult(null);
    try {
      const result = await checkSelectionChance(values);
      setAiResult(result);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get analysis. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Cut-Off &amp; Selection Chance</h1>
        <p className="text-muted-foreground">
          चयन संभावना की जांच करें और पिछले वर्ष की कट-ऑफ देखें।
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary"/> AI Selection Chance Checker</CardTitle>
          <CardDescription>Enter your details to get an AI-powered analysis of your selection chances.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onChanceCheckSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="exam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an exam" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {Object.keys(cutoffData).map(exam => (
                          <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="marksObtained" render={({ field }) => (
                    <FormItem><FormLabel>Marks Obtained</FormLabel><FormControl><Input type="number" placeholder="e.g., 110" {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                />
                <FormField control={form.control} name="totalMarks" render={({ field }) => (
                    <FormItem><FormLabel>Total Marks</FormLabel><FormControl><Input type="number" placeholder="e.g., 150" {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check My Chances
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {aiResult && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="font-headline">AI Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold text-lg">Analysis</h3>
                <p className="text-muted-foreground">{aiResult.analysis}</p>
            </div>
             <div>
                <h3 className="font-semibold text-lg">Suggestion</h3>
                <p className="text-muted-foreground">{aiResult.suggestion}</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg">Selection Probability</h3>
                <p className="text-xl font-bold text-primary">{aiResult.probability}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Past Year Cut-Offs</CardTitle>
          <CardDescription>Choose an exam and year to see the historical cut-off data.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Select onValueChange={(value) => { setSelectedExam(value); setSelectedYear(''); }}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(cutoffData).map(exam => (
                <SelectItem key={exam} value={exam}>{exam}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedYear} value={selectedYear} disabled={!selectedExam}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {data && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="font-headline">{selectedExam} - {selectedYear} Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">पात्रता (Eligibility)</h3>
              <p className="text-muted-foreground">{data.eligibility}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">मेरिट (Merit)</h3>
              <p className="text-muted-foreground">{data.merit}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">कट-ऑफ अंक (Cut-Off Marks)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.cutoff.map((item: any) => (
                    <TableRow key={item.category}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right font-mono">{item.marks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
