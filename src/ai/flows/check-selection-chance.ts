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
  analysis: z.string().describe("A detailed analysis of the student's performance and chances in Hindi."),
  suggestion: z.string().describe("A helpful suggestion for the student based on their result in Hindi."),
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
  prompt: `आप एक रक्षा अकादमी के विशेषज्ञ करियर काउंसलर हैं। आपका काम छात्र के परीक्षा स्कोर का विश्लेषण करना और उनके चयन की संभावनाओं का अनुमान लगाना है। यथार्थवादी लेकिन उत्साहजनक रहें।

  छात्र का प्रदर्शन:
  - परीक्षा: {{{exam}}}
  - प्राप्त अंक: {{{marksObtained}}}
  - कुल अंक: {{{totalMarks}}}

  यहाँ पिछले कट-ऑफ पर कुछ संदर्भ दिया गया है। अपने विश्लेषण के लिए इसे एक संदर्भ के रूप में उपयोग करें।
  - RMS (राष्ट्रीय मिलिट्री स्कूल): सामान्य कटऑफ लगभग 80% (120/150) है। अत्यधिक प्रतिस्पर्धी।
  - JNV (जवाहर नवोदय विद्यालय): सामान्य कटऑफ शहरी के लिए लगभग 75% और ग्रामीण के लिए 72% है। ग्रामीण छात्रों पर ध्यान केंद्रित करता है।
  - RIMC (राष्ट्रीय भारतीय सैन्य कॉलेज): प्रत्येक विषय में 50% की आवश्यकता है। बहुत उच्च प्रतिस्पर्धा, गुणात्मक चयन महत्वपूर्ण है।

  छात्र के स्कोर और परीक्षा की कठिनाई के आधार पर, निम्नलिखित प्रदान करें (सभी आउटपुट हिंदी में होने चाहिए):
  1.  **analysis**: उनके प्रदर्शन का एक संक्षिप्त, यथार्थवादी विश्लेषण। उल्लेख करें कि क्या वे सामान्य कट-ऑफ से बहुत ऊपर, निकट या नीचे हैं।
  2.  **suggestion**: एक उत्साहजनक सुझाव। यदि उन्होंने अच्छा किया है, तो अगले कदमों का सुझाव दें। यदि वे निशान से नीचे हैं, तो सुधार के क्षेत्रों या अन्य विकल्पों का सुझाव दें।
  3.  **probability**: उनके चयन की संभावना का एक अनुमानित प्रतिशत (0-100)। इसकी गणना उनके स्कोर के आधार पर सामान्य कट-ऑफ के सापेक्ष करें। उदाहरण के लिए, यदि कटऑफ 80% है और उन्होंने 85% स्कोर किया है, तो उनकी संभावना अधिक है (जैसे, 90%)। यदि उन्होंने 78% स्कोर किया है, तो उनकी संभावना मध्यम है (जैसे, 60%)। यदि उन्होंने 60% स्कोर किया है, तो उनकी संभावना कम है (जैसे, 20%)।

  एक मान्य JSON प्रारूप में प्रतिक्रिया प्रदान करें।`,
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
