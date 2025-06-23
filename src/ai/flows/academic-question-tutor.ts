'use server';

/**
 * @fileOverview An AI assistant that answers questions in Hindi,
 *  also providing the subject and difficulty level if the question is academic.
 *
 * - askAcademicQuestion - A function that handles the academic question answering process.
 * - AskAcademicQuestionInput - The input type for the askAcademicQuestion function.
 * - AskAcademicQuestionOutput - The return type for the askAcademicQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAcademicQuestionInputSchema = z.object({
  question: z.string().describe('The academic question to be answered in Hindi.'),
});
export type AskAcademicQuestionInput = z.infer<typeof AskAcademicQuestionInputSchema>;

const AskAcademicQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the academic question in Hindi.'),
  subject: z.string().describe('The subject of the question.'),
  difficultyLevel: z.string().describe('The difficulty level of the question (e.g., Easy, Medium, Hard).'),
});
export type AskAcademicQuestionOutput = z.infer<typeof AskAcademicQuestionOutputSchema>;

export async function askAcademicQuestion(input: AskAcademicQuestionInput): Promise<AskAcademicQuestionOutput> {
  return askAcademicQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAcademicQuestionPrompt',
  input: {schema: AskAcademicQuestionInputSchema},
  output: {schema: AskAcademicQuestionOutputSchema},
  prompt: `आप एक सहायक AI सहायक हैं जो हिंदी में सवालों के जवाब देते हैं। किसी भी प्रश्न के लिए, हिंदी में उत्तर प्रदान करें। यदि प्रश्न अकादमिक है, तो उसका विषय और कठिनाई स्तर (जैसे, आसान, मध्यम, कठिन) भी निर्धारित करें। यदि प्रश्न अकादमिक नहीं है, तो विषय को 'सामान्य' और कठिनाई स्तर को 'लागू नहीं' पर सेट करें।

प्रश्न: {{{question}}}

सुनिश्चित करें कि आपका जवाब "answer", "subject", और "difficultyLevel" कीज़ के साथ एक JSON ऑब्जेक्ट है।`,
});

const askAcademicQuestionFlow = ai.defineFlow(
  {
    name: 'askAcademicQuestionFlow',
    inputSchema: AskAcademicQuestionInputSchema,
    outputSchema: AskAcademicQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
