
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/academic-question-tutor.ts';
import '@/ai/flows/general-chat.ts';
import '@/ai/flows/generate-ai-test.ts';
import '@/ai/flows/check-selection-chance.ts';
