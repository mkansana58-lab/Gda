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
    question: z.string().describe('The question text in Hindi.'),
    options: z.array(z.string()).describe('An array of 4 possible answers in Hindi.'),
    correctAnswer: z.string().describe('The correct answer from the options in Hindi.'),
});

const GenerateAiTestOutputSchema = z.object({
    questions: z.array(QuestionSchema).describe('An array of 25 questions for the test in Hindi.'),
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
  prompt: `आप छात्रों के लिए एक विशेषज्ञ परीक्षा निर्माता हैं। निम्नलिखित विषय के लिए हिंदी में 25-प्रश्नों का बहुविकल्पीय परीक्षण उत्पन्न करें: {{{subject}}}।
  प्रत्येक प्रश्न के 4 विकल्प होने चाहिए, और आपको सही उत्तर निर्दिष्ट करना होगा।
  प्रश्न कक्षा 6-9 के छात्रों के लिए उपयुक्त होने चाहिए जो RMS, RIMC, और JNV जैसी प्रतियोगी परीक्षाओं की तैयारी कर रहे हैं। प्रश्न चुनौतीपूर्ण होने चाहिए और विषय के भीतर कई विषयों को कवर करना चाहिए।
  सुनिश्चित करें कि प्रतिक्रिया आउटपुट स्कीमा से मेल खाने वाला एक मान्य JSON ऑब्जेक्ट है। सभी प्रश्न और उत्तर हिंदी में होने चाहिए।
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
