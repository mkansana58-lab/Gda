'use server';

/**
 * @fileOverview A Genkit flow for generating a Sainik School practice test.
 *
 * - generateSainikSchoolTest - A function that creates a test based on the Sainik School pattern.
 * - GenerateSainikSchoolTestInput - The input type for the function.
 * - GenerateSainikSchoolTestOutput - The return type for the function (reuses from generate-ai-test).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateAiTestOutput, GenerateAiTestOutputSchema } from './generate-ai-test';

// No specific input needed for this test generation besides triggering it.
const GenerateSainikSchoolTestInputSchema = z.object({});
export type GenerateSainikSchoolTestInput = z.infer<typeof GenerateSainikSchoolTestInputSchema>;
export type GenerateSainikSchoolTestOutput = GenerateAiTestOutput;

export async function generateSainikSchoolTest(input: GenerateSainikSchoolTestInput): Promise<GenerateSainikSchoolTestOutput> {
  return generateSainikSchoolTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSainikSchoolTestPrompt',
  input: {schema: GenerateSainikSchoolTestInputSchema},
  output: {schema: GenerateAiTestOutputSchema},
  prompt: `आप एक विशेषज्ञ परीक्षा निर्माता हैं जो सैनिक स्कूल प्रवेश परीक्षा (AISSEE) के लिए छात्रों को तैयार करते हैं।
  
  कक्षा 9 के पैटर्न पर आधारित हिंदी में 50-प्रश्नों का एक बहुविकल्पीय अभ्यास परीक्षण उत्पन्न करें। प्रश्नों का वितरण इस प्रकार होना चाहिए:
  - गणित: 20 प्रश्न
  - बुद्धिमत्ता (Intelligence): 10 प्रश्न
  - अंग्रेजी: 10 प्रश्न
  - सामान्य विज्ञान: 5 प्रश्न
  - सामाजिक विज्ञान: 5 प्रश्न

  प्रत्येक प्रश्न के 4 विकल्प होने चाहिए, और आपको सही उत्तर निर्दिष्ट करना होगा।
  प्रश्न चुनौतीपूर्ण और सैनिक स्कूल प्रवेश परीक्षा के स्तर के होने चाहिए।
  
  सुनिश्चित करें कि प्रतिक्रिया आउटपुट स्कीमा से मेल खाने वाला एक मान्य JSON ऑब्जेक्ट है। सभी प्रश्न और उत्तर हिंदी में होने चाहिए।
  `,
});

const generateSainikSchoolTestFlow = ai.defineFlow(
  {
    name: 'generateSainikSchoolTestFlow',
    inputSchema: GenerateSainikSchoolTestInputSchema,
    outputSchema: GenerateSainikSchoolTestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
