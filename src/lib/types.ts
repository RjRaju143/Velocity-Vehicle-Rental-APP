
export type VehicleType = string;

export interface Vehicle {
  id: string;
  name: string;
  type: string[]; // Changed from string to string[]
  capacity: number | string;
  pricePerDay: number;
  images: string[]; // URLs to images
  aiHint: string; // For placeholder image generation
  specifications: {
    engine?: string;
    transmission?: string;
    fuelType?: string;
    mileage?: number; // in city/highway format or average
    year?: number;
    color?: string;
  };
  features: string[]; // e.g., 'GPS', 'Sunroof', 'Bluetooth', 'Cruise Control'
  rentalTerms: string;
  availability: { startDate: string; endDate: string }[]; // ISO date strings
  description: string;
}

export interface FilterOptions {
  type?: string; // Remains string for filter selection
  capacity?: number | 'Any';
  priceRange?: string | 'Any'; // e.g., "0-50", "51-100"
}

export interface InquiryFormData {
  name: string;
  email: string;
  message: string;
  vehicleName?: string;
}

export interface RentalCostInput {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
}

export interface User {
  id: number; // Database ID
  name: string;
  email: string;
  avatarUrl?: string; // Optional
}

export interface Booking {
  id: string; // Unique ID for the booking itself (client-generated or DB-generated)
  userId: number; // User's database ID
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string; // URL of the first vehicle image
  startDate: string; // ISO string
  endDate: string; // ISO string
  totalCost: number;
  bookedAt: string; // ISO string of when the booking was made
  numDays: number;
}
