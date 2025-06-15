// Vehicle-recommendations.ts
'use server';

/**
 * @fileOverview Recommends vehicles to users based on their past searches and preferences.
 *
 * - recommendVehicles - A function that handles the vehicle recommendation process.
 * - RecommendVehiclesInput - The input type for the recommendVehicles function.
 * - RecommendVehiclesOutput - The return type for the recommendVehicles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendVehiclesInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('A description of the user preferences and past searches.'),
  vehicleType: z.string().optional().describe('The type of vehicle the user is looking for (optional).'),
  capacity: z.number().optional().describe('The capacity of the vehicle the user is looking for (optional).'),
  priceRange: z.string().optional().describe('The price range the user is looking for (optional).'),
});

export type RecommendVehiclesInput = z.infer<typeof RecommendVehiclesInputSchema>;

const RecommendVehiclesOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of recommended vehicles based on user preferences.'),
});

export type RecommendVehiclesOutput = z.infer<typeof RecommendVehiclesOutputSchema>;

export async function recommendVehicles(input: RecommendVehiclesInput): Promise<RecommendVehiclesOutput> {
  return recommendVehiclesFlow(input);
}

const recommendVehiclesPrompt = ai.definePrompt({
  name: 'recommendVehiclesPrompt',
  input: {schema: RecommendVehiclesInputSchema},
  output: {schema: RecommendVehiclesOutputSchema},
  prompt: `You are a vehicle recommendation expert. Your task is to recommend a list of vehicles based on the user's preferences and any provided filters.

User Preferences: {{{userPreferences}}}
{{#if vehicleType}}Vehicle Type: {{{vehicleType}}}{{/if}}
{{#if capacity}}Capacity: {{{capacity}}}{{/if}}
{{#if priceRange}}Price Range: {{{priceRange}}}{{/if}}

Please return your response strictly as a JSON object with a single key "recommendations".
The value of "recommendations" MUST be an array of strings, where each string is a suggested vehicle name or type.

Example of expected JSON output:
{
  "recommendations": ["Honda Civic", "Toyota RAV4", "Ford F-150"]
}

If no specific vehicles come to mind based on the input, provide general types like ["Sedan", "SUV", "Truck"].
Do NOT include any other text, explanations, or markdown formatting outside of this JSON object.
Ensure the output is valid JSON.`,
});

const recommendVehiclesFlow = ai.defineFlow(
  {
    name: 'recommendVehiclesFlow',
    inputSchema: RecommendVehiclesInputSchema,
    outputSchema: RecommendVehiclesOutputSchema,
  },
  async input => {
    const {output} = await recommendVehiclesPrompt(input);
    if (!output) {
      // This case might happen if the model fails to produce any output or output that doesn't conform to the schema at all.
      // Genkit usually tries to parse and validate, but if the output is drastically different (e.g., empty or plain text not resembling JSON),
      // `output` could be null or undefined.
      console.error('AI Recommendation Flow: Model output was null or undefined after prompt execution.');
      throw new Error('AI model did not return valid recommendations.');
    }
    return output; // output! was removed, as Genkit's `prompt` call with an output schema should ensure it's valid or throw.
                  // If it can be null/undefined despite the schema, the above check handles it.
  }
);

