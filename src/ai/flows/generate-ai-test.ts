
'use server';

/**
 * @fileOverview A Genkit flow for generating AI-powered tests dynamically.
 *
 * - generateAiTest - A function that creates a test with multiple-choice questions based on dynamic inputs.
 * - GenerateAiTestInput - The input type for the generateAiTest function.
 * - GenerateAiTestOutput - The return type for the generateAiTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiTestInputSchema = z.object({
  subject: z.string().describe('The subject for the test (e.g., "Maths", "Reasoning", "General Science").'),
  questionCount: z.number().describe('The number of questions to generate.'),
  classLevel: z.string().describe('The class level for the test (e.g., "6" or "9").'),
  language: z.string().describe('The language for the questions and answers (e.g., "Hindi" or "English").'),
  examContext: z.string().optional().describe('Optional context about the specific exam (e.g., "JNV Class 6", "RTSE").'),
});
export type GenerateAiTestInput = z.infer<typeof GenerateAiTestInputSchema>;

const QuestionSchema = z.object({
    question: z.string().describe('The question text in the specified language.'),
    options: z.array(z.string()).describe('An array of 4 possible answers in the specified language.'),
    correctAnswer: z.string().describe('The correct answer from the options in the specified language.'),
});

const GenerateAiTestOutputSchema = z.object({
    questions: z.array(QuestionSchema).describe('An array of questions for the test.'),
});
export type GenerateAiTestOutput = z.infer<typeof GenerateAiTestOutputSchema>;
export type AiQuestion = z.infer<typeof QuestionSchema>;


export async function generateAiTest(input: GenerateAiTestInput): Promise<GenerateAiTestOutput> {
  return generateAiTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDynamicAiTestPrompt',
  input: {schema: GenerateAiTestInputSchema},
  output: {schema: GenerateAiTestOutputSchema},
  prompt: `You are an expert test creator for students preparing for Indian competitive exams.
Generate a multiple-choice test with exactly {{{questionCount}}} questions in the {{{language}}} language.

The test details are as follows:
- Subject: {{{subject}}}
- Class Level: {{{classLevel}}}
{{#if examContext}}- Exam Context: {{{examContext}}}{{/if}}

The questions must be challenging and aligned with high standards, designed to rigorously test the student's preparation.
For Class 6, ensure the questions require critical thinking and problem-solving skills, not just simple recall. For Class 9 and 10, the complexity should increase accordingly.

If the subject is 'मानसिक योग्यता (Mental Ability)' for JNV Class 6, include questions from topics like odd one out, figure matching, pattern completion, figure series completion, analogy, geometrical figure completion (triangle, square, circle), mirror imaging, punched hold pattern, space visualisation, and embedded figure.

Each question must have 4 options, and you must specify the correct answer.
Ensure the response is a valid JSON object matching the output schema. All text must be in {{{language}}}.
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
