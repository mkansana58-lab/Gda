'use server';
/**
 * @fileOverview A general purpose AI chatbot for the academy.
 *
 * - generalChat - A function that handles the conversation.
 * - GeneralChatInput - The input type for the generalChat function.
 * - GeneralChatOutput - The return type for the generalChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const GeneralChatInputSchema = z.object({
  messages: z.array(MessageSchema).describe('The history of the conversation.'),
});
export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const GeneralChatOutputSchema = z.object({
  answer: z.string().describe("The AI's response."),
});
export type GeneralChatOutput = z.infer<typeof GeneralChatOutputSchema>;


export async function generalChat(input: GeneralChatInput): Promise<GeneralChatOutput> {
    return generalChatFlow(input);
}


const generalChatFlow = ai.defineFlow({
    name: 'generalChatFlow',
    inputSchema: GeneralChatInputSchema,
    outputSchema: GeneralChatOutputSchema,
}, async (input) => {
    const systemPrompt = `आप 'गो स्वामी डिफेंस एकेडमी' के लिए एक सहायक AI सहायक हैं। आपका लक्ष्य छात्रों को अकादमी, उसके पाठ्यक्रमों और इस ऐप का उपयोग करने के तरीके के बारे में उनके सवालों में मदद करना है। हमेशा मित्रवत और सहायक रहें। जब तक उपयोगकर्ता अंग्रेजी में बात न करे, तब तक हिंदी में जवाब दें।

अगर आपसे पूछा जाए कि सर्टिफ़िकेट कैसे डाउनलोड करें, तो समझाएं कि वे दो तरह के सर्टिफ़िकेट डाउनलोड कर सकते हैं:\n1.  **छात्रवृत्ति आवेदन सर्टिफ़िकेट:** यह 'छात्रवृत्ति फॉर्म' पेज से फ़ॉर्म जमा करने के बाद मिलता है।\n2.  **AI टेस्ट प्रदर्शन सर्टिफ़िकेट:** यह 'AI टेस्ट' पेज से टेस्ट पूरा करने के बाद मिलता है।

संक्षेप में और सीधे जवाब दें।`;
    
    const validMessages = input.messages.filter(m => m.content.trim() !== '');

    const llmResponse = await ai.generate({
        prompt: {
            system: systemPrompt,
            messages: validMessages.map((msg) => ({
                role: msg.role,
                content: [{ text: msg.content }],
            })),
        },
        config: {
            temperature: 0.5,
        },
    });

    return { answer: llmResponse.text };
});
