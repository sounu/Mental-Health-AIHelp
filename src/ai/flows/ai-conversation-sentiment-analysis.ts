'use server';
/**
 * @fileOverview An AI agent that engages in conversation, analyzes sentiment, and adapts its responses accordingly.
 *
 * - aiConversationAndSentimentAnalysis - A function that handles the conversation and sentiment analysis process.
 * - AIConversationAndSentimentAnalysisInput - The input type for the aiConversationAndSentimentAnalysis function.
 * - AIConversationAndSentimentAnalysisOutput - The return type for the aiConversationAndSentimentAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIConversationAndSentimentAnalysisInputSchema = z.object({
  message: z.string().describe('The user message to analyze.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'ai']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type AIConversationAndSentimentAnalysisInput = z.infer<typeof AIConversationAndSentimentAnalysisInputSchema>;

const AIConversationAndSentimentAnalysisOutputSchema = z.object({
  response: z.string().describe('The AI response to the user message.'),
  sentiment: z.string().describe('The sentiment of the user message.'),
});
export type AIConversationAndSentimentAnalysisOutput = z.infer<typeof AIConversationAndSentimentAnalysisOutputSchema>;

export async function aiConversationAndSentimentAnalysis(input: AIConversationAndSentimentAnalysisInput): Promise<AIConversationAndSentimentAnalysisOutput> {
  return aiConversationAndSentimentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiConversationAndSentimentAnalysisPrompt',
  input: {
    schema: AIConversationAndSentimentAnalysisInputSchema,
  },
  output: {
    schema: AIConversationAndSentimentAnalysisOutputSchema,
  },
  prompt: `You are an empathetic AI companion designed to support users\' mental wellness. Analyze the user\'s message for sentiment and provide a supportive and non-judgmental response.

  Conversation History:
  {{#each conversationHistory}}
    {{role}}: {{content}}
  {{/each}}

  User Message: {{{message}}}

  Analyze the sentiment of the user message and adapt your response accordingly. If the sentiment is negative, offer empathetic and supportive messages to help the user manage their emotional state. If the sentiment is positive, acknowledge their feelings and offer continued support.

  Respond in a way that is supportive, helpful, and tailored to the user\'s current emotional state. Your output should include the sentiment analysis and the AI response.

  Output format: { \"response\": \"your response here\", \"sentiment\": \"sentiment here\" }
  `,
});

const aiConversationAndSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'aiConversationAndSentimentAnalysisFlow',
    inputSchema: AIConversationAndSentimentAnalysisInputSchema,
    outputSchema: AIConversationAndSentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
