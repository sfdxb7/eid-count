'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating congratulatory messages and virtual stickers.
 * It includes a fallback mechanism for image generation to handle tier-based restrictions.
 *
 * - congratulateChild - A function that generates a message and a sticker.
 * - CongratulateChildInput - The input type for the congratulateChild function.
 * - CongratulateChildOutput - The return type for the congratulateChild function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CongratulateChildInputSchema = z.object({
  amountAdded: z.number().describe('The amount of money just added.'),
  currentTotal: z.number().describe('The current total money collected.'),
});
export type CongratulateChildInput = z.infer<typeof CongratulateChildInputSchema>;

const CongratulateChildOutputSchema = z.object({
  message: z.string().describe('A fun, encouraging congratulatory message.'),
  stickerDataUri: z
    .string()
    .describe(
      "A data URI of a virtual sticker image, including MIME type and Base64 encoding."
    ),
  isFallback: z.boolean().optional().describe('Whether the sticker is a fallback SVG.'),
});
export type CongratulateChildOutput = z.infer<typeof CongratulateChildOutputSchema>;

const PromptOutputSchema = z.object({
  message: z.string().describe('A fun, encouraging congratulatory message.'),
  stickerDescription: z.string().describe('A brief description for generating a virtual sticker image.'),
  emoji: z.string().describe('A single celebratory emoji matching the achievement.'),
});

const congratulatoryPrompt = ai.definePrompt({
  name: 'congratulatoryPrompt',
  input: {schema: CongratulateChildInputSchema},
  output: {schema: PromptOutputSchema},
  prompt: `You are a friendly and enthusiastic assistant celebrating a child receiving Eideya (Eid money gift).
The child just added {{{amountAdded}}} and their new total is {{{currentTotal}}}.
Generate a fun and encouraging message, suggest a simple sticker description, and pick one perfect emoji.
Consider milestones: first Eideya, reaching 50, 100, 500, or 1000. Keep messages short and exciting.

Output should be JSON.

Examples:
{ "message": "Yay! Your first Eideya! Off to a great start!", "stickerDescription": "A happy golden coin with a smile.", "emoji": "💰" }
`,
});

const generateFallbackSticker = (emoji: string, description: string): string => {
  const svg = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="8" dy="8" stdDeviation="0" flood-color="black" />
        </filter>
      </defs>
      <rect x="10" y="10" width="180" height="180" fill="#FFBF00" stroke="black" stroke-width="4" filter="url(#shadow)" />
      <text x="50%" y="55%" font-family="sans-serif" font-size="80" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
      <text x="50%" y="85%" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="black">${description.toUpperCase().slice(0, 20)}</text>
    </svg>
  `;
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

const congratulateChildFlow = ai.defineFlow(
  {
    name: 'congratulateChildFlow',
    inputSchema: CongratulateChildInputSchema,
    outputSchema: CongratulateChildOutputSchema,
  },
  async input => {
    const {output: promptOutput} = await congratulatoryPrompt(input);

    if (!promptOutput) {
      throw new Error('Failed to generate congratulatory content.');
    }

    const {message, stickerDescription, emoji} = promptOutput;

    try {
      const {media} = await ai.generate({
        model: 'googleai/imagen-3.0-fast-generate-001',
        prompt: `A vibrant, child-friendly cartoon sticker of: ${stickerDescription}. White background, high contrast.`,
        config: {
          safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }],
        },
      });

      if (media && media.url) {
        return { message, stickerDataUri: media.url, isFallback: false };
      }
    } catch (error) {
      // Gracefully catch billing/tier errors and provide a fallback
      return {
        message,
        stickerDataUri: generateFallbackSticker(emoji, stickerDescription),
        isFallback: true
      };
    }

    // Default return if something else goes wrong
    return {
      message,
      stickerDataUri: generateFallbackSticker(emoji, stickerDescription),
      isFallback: true
    };
  }
);

export async function congratulateChild(
  input: CongratulateChildInput
): Promise<CongratulateChildOutput> {
  return congratulateChildFlow(input);
}
