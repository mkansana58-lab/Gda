'use server';

/**
 * @fileOverview An AI agent that provides current affairs for a specified period.
 *
 * - getCurrentAffairs - A function that fetches current affairs.
 * - GetCurrentAffairsInput - The input type for the getCurrentAffairs function.
 * - GetCurrentAffairsOutput - The return type for the getCurrentAffairs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCurrentAffairsInputSchema = z.object({
  period: z.enum(['today', 'week', 'month']).describe('The time period for the current affairs (today, week, or month).'),
});
export type GetCurrentAffairsInput = z.infer<typeof GetCurrentAffairsInputSchema>;

const AffairItemSchema = z.object({
    title: z.string().describe('The headline of the current affairs topic in Hindi.'),
    description: z.string().describe('A brief, easy-to-understand summary of the topic in Hindi (2-3 sentences).'),
    category: z.string().describe('The category of the news (e.g., राष्ट्रीय, अंतर्राष्ट्रीय, खेल, विज्ञान).'),
});

const GetCurrentAffairsOutputSchema = z.object({
    affairs: z.array(AffairItemSchema).describe('An array of current affairs items.'),
});
export type GetCurrentAffairsOutput = z.infer<typeof GetCurrentAffairsOutputSchema>;

export async function getCurrentAffairs(input: GetCurrentAffairsInput): Promise<GetCurrentAffairsOutput> {
  return getCurrentAffairsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCurrentAffairsPrompt',
  input: {schema: GetCurrentAffairsInputSchema},
  output: {schema: GetCurrentAffairsOutputSchema},
  prompt: `आप एक विशेषज्ञ हैं जो भारत में सैनिक स्कूल, RMS, और JNV जैसी प्रतियोगी परीक्षाओं की तैयारी कर रहे छात्रों के लिए करेंट अफेयर्स तैयार करते हैं।

कृपया **आज की तारीख के अनुसार** निम्नलिखित अवधि के लिए सबसे महत्वपूर्ण करेंट अफेयर्स की सूची हिंदी में प्रदान करें:
अवधि: {{period}}

सुनिश्चित करें कि घटनाएँ वास्तव में इसी अवधि की हैं, पुरानी नहीं। प्रत्येक विषय के लिए, एक शीर्षक, एक संक्षिप्त विवरण (2-3 वाक्यों में), और एक श्रेणी (जैसे, राष्ट्रीय, अंतर्राष्ट्रीय, खेल, विज्ञान, रक्षा) प्रदान करें। जानकारी सटीक, संक्षिप्त और छात्रों के लिए समझने में आसान होनी चाहिए। कम से कम 5 और अधिकतम 10 महत्वपूर्ण घटनाएँ प्रदान करें।

सुनिश्चित करें कि आपका जवाब "affairs" नामक की (key) के साथ एक JSON ऑब्जेक्ट है, जिसमें प्रत्येक आइटम में "title", "description", और "category" हो।`,
});

const getCurrentAffairsFlow = ai.defineFlow(
  {
    name: 'getCurrentAffairsFlow',
    inputSchema: GetCurrentAffairsInputSchema,
    outputSchema: GetCurrentAffairsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
