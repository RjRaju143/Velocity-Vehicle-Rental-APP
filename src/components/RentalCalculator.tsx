
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Vehicle, Booking } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface RentalCalculatorProps {
  vehicle: Vehicle;
}

const RentalCalculator = (props: RentalCalculatorProps) => {
  const { vehicle } = props;
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [numDays, setNumDays] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<string | null>(null);
  const { toast } = useToast();
  const { addBooking, user, isLoading: authIsLoading } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (startDate && endDate && vehicle.pricePerDay && isClient) {
      if (endDate < startDate) {
        setError('End date cannot be before start date.');
        setTotalCost(null);
        setNumDays(0);
        return;
      }
      const days = differenceInDays(endDate, startDate) + 1;
      if (days <= 0) {
         setError('Rental must be for at least one day.');
         setTotalCost(null);
         setNumDays(0);
         return;
      }
      setNumDays(days);
      setTotalCost(days * vehicle.pricePerDay);
      setError(null);
    } else {
      setTotalCost(null);
      setNumDays(0);
      if(isClient && startDate && endDate && endDate < startDate) {
        // Error already set
      } else {
        setError(null);
      }
    }
  }, [startDate, endDate, vehicle.pricePerDay, isClient]);

  const handleBooking = async () => {
    if (!startDate || !endDate || error || totalCost === null || !user) {
      toast({
        title: "Booking Error",
        description: user ? "Please select valid start and end dates." : "Please log in to make a booking.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    setBookingConfirmation(null);

    try {
      const bookingDetailsOmit: Omit<Booking, 'id' | 'userId' | 'bookedAt'> = {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleImage: vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://placehold.co/600x400.png',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalCost: totalCost,
        numDays: numDays,
      };
      
      const result = await addBooking(bookingDetailsOmit);
      if ('error' in result) {
        throw new Error(result.error);
      }

      const formattedStartDate = format(startDate, "PPP");
      const formattedEndDate = format(endDate, "PPP");

      toast({
        title: "Booking Confirmed & Saved!",
        description: `${vehicle.name} from ${formattedStartDate} to ${formattedEndDate} (Total: $${totalCost.toFixed(2)}) has been recorded and saved.`,
        variant: 'default',
      });

      setBookingConfirmation(`Successfully booked ${vehicle.name} from ${formattedStartDate} to ${formattedEndDate}. Your booking is saved.`);
    } catch (bookingError) {
      console.error("Booking failed:", bookingError);
      toast({
        title: "Booking Failed",
        description: bookingError instanceof Error ? bookingError.message : "Could not complete your booking.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (!isClient) {
    return (
      <Card className="shadow-lg rounded-lg mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">Calculate Rental Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading calculator...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">Calculate Rental Cost</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
                disabled={!!bookingConfirmation || isBooking || authIsLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || !!bookingConfirmation || isBooking || authIsLoading}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
                disabled={!!bookingConfirmation || isBooking || authIsLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => (startDate ? date < startDate : date < new Date(new Date().setHours(0,0,0,0))) || !!bookingConfirmation || isBooking || authIsLoading}
              />
            </PopoverContent>
          </Popover>
        </div>
        {error && !bookingConfirmation && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {bookingConfirmation && (
          <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-600">Booking Confirmed!</AlertTitle>
            <AlertDescription className="text-green-700">{bookingConfirmation}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 border-t pt-4">
        {totalCost !== null && !bookingConfirmation && (
          <div className="text-lg font-semibold">
            Total Estimated Cost ({numDays} day{numDays !== 1 ? 's' : ''}): <span className="text-primary">${totalCost.toFixed(2)}</span>
          </div>
        )}
        <Button 
          onClick={handleBooking} 
          disabled={!startDate || !endDate || !!error || totalCost === null || isBooking || !!bookingConfirmation || !user || authIsLoading} 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isBooking || authIsLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          ) : bookingConfirmation ? (
            <>
            <CheckCircle className="mr-2 h-4 w-4" /> Booked!
            </>
          ) : (
            'Book Now'
          )}
        </Button>
        {!user && !authIsLoading && <p className="text-xs text-destructive text-center w-full">Please log in to make a booking.</p>}
      </CardFooter>
    </Card>
  );
};

export default RentalCalculator;
