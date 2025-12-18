'use server';

/**
 * @fileOverview Provides personalized wellness recommendations based on user mood, past interactions, and stated goals.
 *
 * - personalizedWellnessRecommendations - A function that generates personalized wellness recommendations.
 * - PersonalizedWellnessRecommendationsInput - The input type for the personalizedWellnessRecommendations function.
 * - PersonalizedWellnessRecommendationsOutput - The return type for the personalizedWellnessRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWellnessRecommendationsInputSchema = z.object({
  mood: z.string().describe('The current mood of the user.'),
  pastInteractions: z.string().describe('A summary of the user\'s past interactions and preferences.'),
  goals: z.string().describe('The stated goals of the user.'),
});
export type PersonalizedWellnessRecommendationsInput = z.infer<typeof PersonalizedWellnessRecommendationsInputSchema>;

const PersonalizedWellnessRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      type: z.string().describe('The type of recommendation (meditation, journaling, breathing exercise).'),
      title: z.string().describe('The title of the recommendation.'),
      description: z.string().describe('A brief description of the recommendation.'),
      link: z.string().describe('A link to the recommended resource.'),
    })
  ).describe('A list of personalized wellness recommendations.'),
});
export type PersonalizedWellnessRecommendationsOutput = z.infer<typeof PersonalizedWellnessRecommendationsOutputSchema>;

export async function personalizedWellnessRecommendations(
  input: PersonalizedWellnessRecommendationsInput
): Promise<PersonalizedWellnessRecommendationsOutput> {
  return personalizedWellnessRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedWellnessRecommendationsPrompt',
  input: {schema: PersonalizedWellnessRecommendationsInputSchema},
  output: {schema: PersonalizedWellnessRecommendationsOutputSchema},
  prompt: `You are an AI wellness assistant.  Based on the user's current mood, past interactions, and goals, provide a list of personalized recommendations for guided meditations, journaling prompts, and breathing exercises.

Mood: {{{mood}}}
Past Interactions: {{{pastInteractions}}}
Goals: {{{goals}}}

Format your response as a JSON array of recommendations. Each object in the array should have the following fields:
- type: The type of recommendation (meditation, journaling, breathing exercise).
- title: The title of the recommendation.
- description: A brief description of the recommendation.
- link: A link to the recommended resource.
`,
});

const personalizedWellnessRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedWellnessRecommendationsFlow',
    inputSchema: PersonalizedWellnessRecommendationsInputSchema,
    outputSchema: PersonalizedWellnessRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
