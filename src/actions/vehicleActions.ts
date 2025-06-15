
'use server';
import { recommendVehicles as recommendVehiclesFlow, type RecommendVehiclesInput, type RecommendVehiclesOutput } from '@/ai/flows/vehicle-recommendations';
import type { InquiryFormData } from '@/lib/types';

export async function getVehicleRecommendations(input: RecommendVehiclesInput): Promise<RecommendVehiclesOutput> {
  try {
    const result = await recommendVehiclesFlow(input);
    return result;
  } catch (error) {
    console.error("Error in getVehicleRecommendations (vehicleActions.ts):", error);
    // Re-throw a more specific error but include the original message for client-side handling if needed.
    // This helps in debugging while still allowing the client to show a user-friendly message.
    if (error instanceof Error) {
        throw new Error(`AI Recommendation failed: ${error.message}`);
    }
    // Fallback for non-Error objects thrown
    throw new Error("Failed to fetch recommendations due to an unknown server error.");
  }
}

export async function submitInquiry(formData: InquiryFormData): Promise<{ success: boolean; message: string }> {
  // This is a placeholder. In a real app, you would:
  // 1. Validate the data
  // 2. Save to a database (e.g., Firebase Firestore, Supabase, etc.) - or your SQLite DB
  // 3. Send an email notification
  console.log("Server Action: Submitting inquiry", formData);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a successful submission
  if (formData.email && formData.name && formData.message) {
    // TODO: Consider saving inquiries to the database as well
    return { success: true, message: "Inquiry submitted successfully!" };
  } else {
    return { success: false, message: "Failed to submit inquiry. Please check your input." };
  }
}

