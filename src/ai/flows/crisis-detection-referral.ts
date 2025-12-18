'use server';

/**
 * @fileOverview A crisis detection and referral AI agent.
 *
 * - crisisDetectionAndReferral - A function that handles the crisis detection and referral process.
 * - CrisisDetectionAndReferralInput - The input type for the crisisDetectionAndReferral function.
 * - CrisisDetectionAndReferralOutput - The return type for the crisisDetectionAndReferral function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrisisDetectionAndReferralInputSchema = z.object({
  message: z.string().describe('The user message to analyze for distress.'),
});
export type CrisisDetectionAndReferralInput = z.infer<
  typeof CrisisDetectionAndReferralInputSchema
>;

const CrisisDetectionAndReferralOutputSchema = z.object({
  isCrisis: z.boolean().describe('Whether the message indicates a crisis.'),
  referralMessage: z
    .string()
    .describe(
      'A message providing links to crisis hotlines and resources if a crisis is detected.'
    ),
});
export type CrisisDetectionAndReferralOutput = z.infer<
  typeof CrisisDetectionAndReferralOutputSchema
>;

export async function crisisDetectionAndReferral(
  input: CrisisDetectionAndReferralInput
): Promise<CrisisDetectionAndReferralOutput> {
  return crisisDetectionAndReferralFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crisisDetectionAndReferralPrompt',
  input: {schema: CrisisDetectionAndReferralInputSchema},
  output: {schema: CrisisDetectionAndReferralOutputSchema},
  prompt: `You are a crisis detection AI. You will determine if the user's message indicates a crisis situation.

  If the message indicates a crisis, set isCrisis to true and provide a referral message with links to crisis hotlines and resources.

  If the message does not indicate a crisis, set isCrisis to false and leave the referral message empty.

  Message: {{{message}}}

  Here are some helpful crisis hotline:
  - Crisis Text Line: Text HOME to 741741
  - Suicide Prevention Lifeline: Call or text 988
  `,
});

const crisisDetectionAndReferralFlow = ai.defineFlow(
  {
    name: 'crisisDetectionAndReferralFlow',
    inputSchema: CrisisDetectionAndReferralInputSchema,
    outputSchema: CrisisDetectionAndReferralOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
