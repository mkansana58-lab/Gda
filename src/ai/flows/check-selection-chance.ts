'use server';

/**
 * @fileOverview An AI agent that analyzes a student's chances of selection based on their exam score.
 *
 * - checkSelectionChance - A function that handles the analysis.
 * - CheckSelectionChanceInput - The input type for the checkSelectionChance function.
 * - CheckSelectionChanceOutput - The return type for the checkSelectionChance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckSelectionChanceInputSchema = z.object({
  exam: z.string().describe('The name of the exam (e.g., RMS, JNV, RIMC).'),
  marksObtained: z.number().describe('The marks obtained by the student.'),
  totalMarks: z.number().describe('The total marks for the exam.'),
});
export type CheckSelectionChanceInput = z.infer<typeof CheckSelectionChanceInputSchema>;

const CheckSelectionChanceOutputSchema = z.object({
  analysis: z.string().describe("A detailed analysis of the student's performance and chances."),
  suggestion: z.string().describe("A helpful suggestion for the student based on their result."),
  probability: z.number().describe("A percentage chance of selection (0-100)."),
});
export type CheckSelectionChanceOutput = z.infer<typeof CheckSelectionChanceOutputSchema>;

export async function checkSelectionChance(input: CheckSelectionChanceInput): Promise<CheckSelectionChanceOutput> {
  return checkSelectionChanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkSelectionChancePrompt',
  input: {schema: CheckSelectionChanceInputSchema},
  output: {schema: CheckSelectionChanceOutputSchema},
  prompt: `You are an expert career counselor for a defense academy. Your task is to analyze a student's exam score and predict their chances of selection. Be realistic but encouraging.

  Student's performance:
  - Exam: {{{exam}}}
  - Marks Obtained: {{{marksObtained}}}
  - Total Marks: {{{totalMarks}}}

  Here is some context on past cut-offs. Use this as a reference for your analysis.
  - RMS (Rashtriya Military Schools): General cutoff is around 80% (120/150). Highly competitive.
  - JNV (Jawahar Navodaya Vidyalaya): General cutoff is around 75% for urban and 72% for rural. Focuses on rural students.
  - RIMC (Rashtriya Indian Military College): Requires 50% in each subject. Very high competition, qualitative selection is important.

  Based on the student's score and the exam's difficulty, provide the following:
  1.  **analysis**: A brief, realistic analysis of their performance. Mention if they are well above, near, or below the typical cut-off.
  2.  **suggestion**: An encouraging suggestion. If they did well, suggest next steps. If they are below the mark, suggest areas for improvement or other options.
  3.  **probability**: An estimated percentage (0-100) of their selection chance. Calculate this based on their score relative to the typical cut-offs. For example, if the cutoff is 80% and they scored 85%, their chance is high (e.g., 90%). If they scored 78%, their chance is moderate (e.g., 60%). If they scored 60%, their chance is low (e.g., 20%).

  Provide the response in a valid JSON format.`,
});

const checkSelectionChanceFlow = ai.defineFlow(
  {
    name: 'checkSelectionChanceFlow',
    inputSchema: CheckSelectionChanceInputSchema,
    outputSchema: CheckSelectionChanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
