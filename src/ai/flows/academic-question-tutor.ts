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
  question: z.string().describe('The academic question to be answered.'),
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
  prompt: `You are a helpful AI assistant that answers questions in Hindi. For any given question, provide an answer in Hindi. If the question is academic, also determine its subject and difficulty level (e.g., Easy, Medium, Hard). If the question is not academic, set the subject to 'General' and the difficulty level to 'N/A'.

Question: {{{question}}}

Ensure your response is a JSON object with "answer", "subject", and "difficultyLevel" keys.`,
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
