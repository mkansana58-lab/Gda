'use server';

/**
 * @fileOverview A Genkit flow for generating AI-powered tests.
 *
 * - generateAiTest - A function that creates a test with multiple-choice questions.
 * - GenerateAiTestInput - The input type for the generateAiTest function.
 * - GenerateAiTestOutput - The return type for the generateAiTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiTestInputSchema = z.object({
  subject: z.string().describe('The subject for the test (e.g., "Math", "Science").'),
});
export type GenerateAiTestInput = z.infer<typeof GenerateAiTestInputSchema>;

const QuestionSchema = z.object({
    question: z.string().describe('The question text.'),
    options: z.array(z.string()).describe('An array of 4 possible answers.'),
    correctAnswer: z.string().describe('The correct answer from the options.'),
});

const GenerateAiTestOutputSchema = z.object({
    questions: z.array(QuestionSchema).describe('An array of 5 questions for the test.'),
});
export type GenerateAiTestOutput = z.infer<typeof GenerateAiTestOutputSchema>;
export type AiQuestion = z.infer<typeof QuestionSchema>;


export async function generateAiTest(input: GenerateAiTestInput): Promise<GenerateAiTestOutput> {
  return generateAiTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiTestPrompt',
  input: {schema: GenerateAiTestInputSchema},
  output: {schema: GenerateAiTestOutputSchema},
  prompt: `You are an expert test creator for students. Generate a 5-question multiple-choice test for the following subject: {{{subject}}}.
  Each question must have 4 options, and you must specify the correct answer.
  The questions should be suitable for students in grades 6-9.
  Ensure the response is a valid JSON object matching the output schema.
  `,
});

const generateAiTestFlow = ai.defineFlow(
  {
    name: 'generateAiTestFlow',
    inputSchema: GenerateAiTestInputSchema,
    outputSchema: GenerateAiTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
