'use server';
/**
 * @fileOverview This file defines a Genkit flow for checking scholarship results based on roll number.
 *
 * - checkScholarshipResult - A function that takes a roll number as input and returns the scholarship result (pass/fail).
 * - CheckScholarshipResultInput - The input type for the checkScholarshipResult function.
 * - CheckScholarshipResultOutput - The return type for the checkScholarshipResult function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckScholarshipResultInputSchema = z.object({
  rollNumber: z
    .string()
    .describe('The roll number of the student.'),
});
export type CheckScholarshipResultInput = z.infer<typeof CheckScholarshipResultInputSchema>;

const CheckScholarshipResultOutputSchema = z.object({
  result: z
    .string()
    .describe('The scholarship result in Hindi (e.g., "Pass", "Fail", or a detailed message).'),
});
export type CheckScholarshipResultOutput = z.infer<typeof CheckScholarshipResultOutputSchema>;

export async function checkScholarshipResult(input: CheckScholarshipResultInput): Promise<CheckScholarshipResultOutput> {
  return checkScholarshipResultFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkScholarshipResultPrompt',
  input: {schema: CheckScholarshipResultInputSchema},
  output: {schema: CheckScholarshipResultOutputSchema},
  prompt: `आप एक AI सहायक हैं जिसे छात्रों को उनके रोल नंबर के आधार पर छात्रवृत्ति परिणाम प्रदान करने के लिए डिज़ाइन किया गया है।

  दिए गए रोल नंबर: {{{rollNumber}}} के लिए, छात्रवृत्ति परिणाम प्रदान करें। परिणाम हिंदी में होना चाहिए और यह बताना चाहिए कि छात्र पास हुआ या फेल, और कोई अन्य प्रासंगिक जानकारी।
  अपनी प्रतिक्रिया में उत्साहजनक और सहायक बनें।
  यदि कोई छात्र पास हो गया है, तो उन्हें बधाई दें और उल्लेख करें कि उन्हें छात्रवृत्ति के लिए चुना गया है। यदि वे असफल रहे, तो उन्हें अगले साल फिर से प्रयास करने के लिए प्रोत्साहित करें।
  किसी भी छात्र के बारे में कोई भी व्यक्तिगत पहचान योग्य जानकारी शामिल न करें। केवल यह बताएं कि वे पास हुए या फेल।
  उदाहरण प्रतिक्रिया यदि छात्र पास हो गया: "बधाई हो! आपका परिणाम पास है। आपको छात्रवृत्ति के लिए चुना गया है।"
  उदाहरण प्रतिक्रिया यदि छात्र असफल रहा: "हमें आपको यह बताते हुए खेद है कि आपका परिणाम फेल है। कृपया अगले साल फिर से प्रयास करें।"`,
});

const checkScholarshipResultFlow = ai.defineFlow(
  {
    name: 'checkScholarshipResultFlow',
    inputSchema: CheckScholarshipResultInputSchema,
    outputSchema: CheckScholarshipResultOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
