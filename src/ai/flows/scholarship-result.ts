// 'use server';
/**
 * @fileOverview This file defines a Genkit flow for checking scholarship results based on roll number.
 *
 * - checkScholarshipResult - A function that takes a roll number as input and returns the scholarship result (pass/fail).
 * - CheckScholarshipResultInput - The input type for the checkScholarshipResult function.
 * - CheckScholarshipResultOutput - The return type for the checkScholarshipResult function.
 */

'use server';
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
    .describe('The scholarship result (e.g., \"Pass\", \"Fail\", or a detailed message).'),
});
export type CheckScholarshipResultOutput = z.infer<typeof CheckScholarshipResultOutputSchema>;

export async function checkScholarshipResult(input: CheckScholarshipResultInput): Promise<CheckScholarshipResultOutput> {
  return checkScholarshipResultFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkScholarshipResultPrompt',
  input: {schema: CheckScholarshipResultInputSchema},
  output: {schema: CheckScholarshipResultOutputSchema},
  prompt: `You are an AI assistant designed to provide scholarship results to students based on their roll number.

  Given the roll number: {{{rollNumber}}}, provide the scholarship result. The result should indicate whether the student passed or failed, and any other relevant information.
  Be encouraging and supportive in your response.
  If a student has passed, congratulate them and mention they have been selected for the scholarship. If they failed, encourage them to try again next year.
  Do not include any personally identifying information about any student. Only return whether they passed or failed.
  Example response if the student passed: \"Congratulations! Your result is pass. You have been selected for the scholarship.\"
  Example response if the student failed: \"We regret to inform you that your result is fail. Please try again next year.\"`,
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
