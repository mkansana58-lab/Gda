'use server';

/**
 * @fileOverview An AI tutor that answers academic questions in Hindi,
 *  also providing the subject and difficulty level of the question.
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
  prompt: `You are an AI tutor specializing in answering academic questions in Hindi.

  Answer the following question in Hindi, and also provide the subject and difficulty level of the question.

  Question: {{{question}}}

  Format your response as a JSON object with the following keys:
  - answer: The answer to the question in Hindi.
  - subject: The subject of the question.
  - difficultyLevel: The difficulty level of the question (e.g., Easy, Medium, Hard).`,
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
