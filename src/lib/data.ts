
import type { Vehicle } from "./types";

export const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Yamaha RX 100",
    type: ["Bike", "Motorcycle", "Classic"],
    capacity: 2,
    pricePerDay: 40,
    images: ["/images/RX100/RX100-1.jpg", "/images/RX100/RX100-2.jpg"],
    aiHint: "classic red bike motorcycle",
    specifications: {
      engine: "98cc, 2-Stroke, Single Cylinder",
      transmission: "4-Speed Manual",
      fuelType: "Petrol",
      mileage: 35,
      year: 1996,
      color: "Red",
    },
    features: ["Kick Start", "Analog Speedometer", "Lightweight Frame"],
    rentalTerms:
      "Minimum 1 day rental. Includes 100 km/day. Standard helmet provided.",
    availability: [{ startDate: "2024-01-01", endDate: "2024-12-31" }],
    description:
      "The legendary Yamaha RX 100 offers a raw, classic riding experience. Lightweight, responsive, and iconic in design, perfect for city rides and vintage bike enthusiasts.",
  },
  {
    id: "2",
    name: "Toyota Corolla",
    type: ["Sedan", "Car"],
    capacity: 5,
    pricePerDay: 60,
    images: [
      "/images/ToyotaCorolla/toyota-corolla-1.jpg",
      "/images/ToyotaCorolla/toyota-corolla-2.jpg",
    ],
    aiHint: "white sedan daily commute",
    specifications: {
      engine: "1.8L 4-Cylinder",
      transmission: "CVT Automatic",
      fuelType: "Gasoline",
      mileage: 32,
      year: 2023,
      color: "Super White",
    },
    features: [
      "Apple CarPlay",
      "Rear Camera",
      "Adaptive Cruise Control",
      "Lane Assist",
    ],
    rentalTerms:
      "Minimum 1 day rental. Includes 150 miles/day. Fuel must be refilled on return.",
    availability: [{ startDate: "2024-02-01", endDate: "2024-11-30" }],
    description:
      "A reliable and fuel-efficient sedan, perfect for daily commutes or weekend getaways. The Toyota Corolla offers comfort, safety, and excellent mileage at an affordable rate.",
  },
  {
    id: "3",
    name: "Ather 450X",
    type: ["Electric Bike", "Scooter", "Scooty"],
    capacity: 2,
    pricePerDay: 35,
    images: [
      "/images/Ather450X/Ather450X-1.jpg",
      "/images/Ather450X/Ather450X-2.jpg",
    ],
    aiHint: "white electric scooter urban commute",
    specifications: {
      engine: "BLDC Electric Motor",
      transmission: "Automatic",
      fuelType: "Electric",
      mileage: 85, // range in km
      year: 2024,
      color: "White",
    },
    features: [
      "Fast Charging",
      "Digital Touchscreen Dashboard",
      "Reverse Mode",
      "Side Stand Sensor",
    ],
    rentalTerms:
      "Includes helmet and charger. Unlimited km within city limits. Minimum 1-day rental.",
    availability: [{ startDate: "2024-03-15", endDate: "2024-12-31" }],
    description:
      "The Ather 450X is a smart, lightweight electric scooter built for city travel. Quiet, eco-friendly, and loaded with tech for a smooth ride.",
  },
  {
    id: "4",
    name: "Honda SP 125",
    type: ["Motorcycle", "Bike", "Commuter"],
    capacity: 2,
    pricePerDay: 45,
    images: ["/images/HondaSP125/SP125-1.jpg"],
    aiHint: "black commuter motorcycle",
    specifications: {
      engine: "124cc, 4-Stroke, Air-Cooled",
      transmission: "5-Speed Manual",
      fuelType: "Gasoline",
      mileage: 65,
      year: 2023,
      color: "Black",
    },
    features: [
      "Digital Console",
      "CBS (Combi-Brake System)",
      "LED Headlamp",
      "Eco Indicator",
    ],
    rentalTerms:
      "Helmet included. Fuel not included. Requires valid motorcycle license.",
    availability: [{ startDate: "2024-04-01", endDate: "2024-12-31" }],
    description:
      "A stylish and economical bike designed for daily commuting. The Honda SP 125 offers great mileage, comfort, and smooth performance for city rides.",
  },
  {
    id: "5",
    name: "Maruti Suzuki Omni",
    type: ["Van", "Utility", "Car"],
    capacity: 8,
    pricePerDay: 40,
    images: ["/images/Omni/Omni-1.jpeg", "/images/Omni/Omni-2.png"],
    aiHint: "white compact van city",
    specifications: {
      engine: "796cc, 3-Cylinder",
      transmission: "4-Speed Manual",
      fuelType: "Gasoline",
      mileage: 19,
      year: 2019,
      color: "White",
    },
    features: [
      "Sliding Doors",
      "Compact Size for City Use",
      "Basic AC (optional)",
      "Foldable Rear Seats",
    ],
    rentalTerms:
      "Minimum 1-day rental. 150 km/day included. Fuel not included. Suitable for local city use only.",
    availability: [{ startDate: "2024-05-01", endDate: "2024-12-31" }],
    description:
      "A no-frills, budget-friendly van that's ideal for city transport and light utility needs. The Maruti Omni offers excellent maneuverability and space in a compact design.",
  },
  {
    id: "6",
    name: "Honda Activa 6G",
    type: ["Scooter", "Commuter"],
    capacity: 2,
    pricePerDay: 30,
    images: ["/images/Activa6G/Activa-1.jpg"],
    aiHint: "grey scooter daily commute",
    specifications: {
      engine: "109.5cc, Single Cylinder",
      transmission: "CVT Automatic",
      fuelType: "Gasoline",
      mileage: 50,
      year: 2023,
      color: "Matte Grey",
    },
    features: [
      "Silent Start",
      "LED Headlamp",
      "External Fuel Lid",
      "Digital-Analog Meter",
    ],
    rentalTerms:
      "Minimum 1-day rental. Helmet included. Fuel not included. Valid two-wheeler license required.",
    availability: [{ startDate: "2024-05-01", endDate: "2024-12-31" }],
    description:
      "The Honda Activa 6G is India's most trusted scooter. Smooth, efficient, and perfect for daily city rides. Easy to handle and great on mileage.",
  },
];

// Dynamically generate vehicleTypesList from the vehicles data
const allTypes = vehicles.flatMap(vehicle => vehicle.type);
export const vehicleTypesList: string[] = Array.from(new Set(allTypes)).sort();


export const vehicleCapacitiesList: number[] = [2, 4, 5, 7, 8, 15];
export const priceRangesList = [
  { label: "$0 - $50", value: "0-50", min: 0, max: 50 },
  { label: "$51 - $100", value: "51-100", min: 51, max: 100 },
  { label: "$101 - $150", value: "101-150", min: 101, max: 150 },
  { label: "$151 - $200", value: "151-200", min: 151, max: 200 },
  { label: "$200+", value: "200+", min: 201, max: Infinity },
];


export const getVehicleById = (id: string): Vehicle | undefined => {
  return vehicles.find((v) => v.id === id);
};
