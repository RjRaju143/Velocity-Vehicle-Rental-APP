'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Lightbulb, List } from 'lucide-react';
import { getVehicleRecommendations } from '@/actions/vehicleActions';
import type { RecommendVehiclesInput } from '@/ai/flows/vehicle-recommendations';
import { Skeleton } from './ui/skeleton';

interface VehicleRecommendationsProps {
  currentFilters?: {
    vehicleType?: string;
    capacity?: number;
    priceRange?: string;
  } | any;
}

const VehicleRecommendations = ({ currentFilters }: VehicleRecommendationsProps) => {
  const [userPreferences, setUserPreferences] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Optionally pre-fill preferences based on filters
    if (currentFilters) {
      let initialPrefs = "Looking for a vehicle. ";
      if (currentFilters.vehicleType) initialPrefs += `Type: ${currentFilters.vehicleType}. `;
      if (currentFilters.capacity) initialPrefs += `Capacity: ${currentFilters.capacity}. `;
      if (currentFilters.priceRange) initialPrefs += `Price: around ${currentFilters.priceRange}. `;
      // setUserPreferences(initialPrefs); // Commented out to allow manual entry first
    }
  }, [currentFilters]);

  const handleFetchRecommendations = () => {
    if (!userPreferences.trim()) {
      setError("Please describe your preferences.");
      return;
    }
    setError(null);
    setRecommendations([]); // Clear previous recommendations

    startTransition(async () => {
      try {
        const input: RecommendVehiclesInput = {
          userPreferences,
          vehicleType: currentFilters?.vehicleType,
          capacity: currentFilters?.capacity,
          priceRange: currentFilters?.priceRange,
        };
        const result = await getVehicleRecommendations(input);
        setRecommendations(result.recommendations);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    });
  };

  return (
    <Card className="shadow-lg rounded-lg mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" /> AI Vehicle Recommender
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="userPreferences">Describe your dream ride or needs:</Label>
          <Textarea
            id="userPreferences"
            value={userPreferences}
            onChange={(e) => setUserPreferences(e.target.value)}
            placeholder="e.g., 'I need a fuel-efficient car for city commuting', 'A spacious SUV for family road trips with good safety features', 'Something sporty and fun for weekends'"
            rows={3}
            className="mt-1"
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isPending && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}
        {!isPending && recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center"><List className="mr-2 h-5 w-5 text-primary" />Our Suggestions:</h4>
            <ul className="list-disc list-inside space-y-1 bg-secondary/30 p-3 rounded-md">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-foreground">{rec}</li>
              ))}
            </ul>
          </div>
        )}
         {!isPending && recommendations.length === 0 && userPreferences && !error && (
          <p className="text-sm text-muted-foreground">No recommendations found based on your input. Try being more specific or general.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleFetchRecommendations} disabled={isPending || !userPreferences.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          {isPending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          ) : (
            'Get Recommendations'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleRecommendations;
