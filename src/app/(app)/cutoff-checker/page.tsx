'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
};

export default function CutoffCheckerPage() {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const availableYears = selectedExam ? Object.keys(cutoffData[selectedExam] || {}) : [];
  const data = (selectedExam && selectedYear && cutoffData[selectedExam]?.[selectedYear]) || null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Cut-Off Checker</h1>
        <p className="text-muted-foreground">
          अनुमानित व पिछले वर्ष की कट-ऑफ, पात्रता और मेरिट जानकारी हिंदी में प्राप्त करें।
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Select Exam and Year</CardTitle>
          <CardDescription>Choose an exam and year to see the details.</CardDescription>
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
