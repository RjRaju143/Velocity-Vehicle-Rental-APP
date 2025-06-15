
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import type { Booking } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarCheck, Car, CalendarDays, DollarSign, Info, ListChecks, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';


export default function MyBookingsPage() {
  const { user, isAuthenticated, isLoading: authOperationIsLoading, getBookings } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authOperationIsLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authOperationIsLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchUserBookings = async () => {
        setPageLoading(true);
        const result = await getBookings();
        if ('error' in result) {
          toast({
            title: 'Error fetching bookings',
            description: result.error,
            variant: 'destructive',
          });
          setBookings([]);
        } else {
          // Bookings are already sorted by DB query (DESC)
          setBookings(result);
        }
        setPageLoading(false);
      };
      fetchUserBookings();
    } else if (!authOperationIsLoading && !isAuthenticated) {
      // If auth is resolved and user is not authenticated, stop loading
      setPageLoading(false);
    }
  }, [isAuthenticated, user, getBookings, toast]); // Removed authOperationIsLoading from dependencies

  if (authOperationIsLoading || pageLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-lg">
                <CardHeader>
                  <Skeleton className="h-32 w-full rounded-md" />
                  <Skeleton className="h-6 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // This case should ideally be handled by the redirect,
    // but as a fallback or if redirect hasn't fired yet.
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>Please log in to view your bookings.</AlertDescription>
                </Alert>
            </main>
            <Footer />
        </div>
    )
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section aria-labelledby="my-bookings-title" className="text-center mb-12">
          <h1 id="my-bookings-title" className="font-headline text-4xl md:text-5xl font-bold mb-3 text-primary flex items-center justify-center">
            <ListChecks className="mr-3 h-10 w-10" /> My Bookings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's a list of all your vehicle rentals.
          </p>
        </section>

        {bookings.length === 0 ? (
          <Alert className="max-w-xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertTitle>No Bookings Yet</AlertTitle>
            <AlertDescription>
              You haven't made any bookings. Ready to find your perfect ride?
              <Button asChild variant="link" className="px-1">
                <Link href="/">Browse Vehicles</Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="shadow-lg flex flex-col overflow-hidden rounded-lg">
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 bg-muted">
                    <Image
                      src={booking.vehicleImage || 'https://placehold.co/600x400.png'}
                      alt={booking.vehicleName}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="rented vehicle"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-xl font-headline mb-1 text-primary truncate">{booking.vehicleName}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mb-3">
                        Booked on: {format(new Date(booking.bookedAt), 'PPP p')}
                    </CardDescription>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-foreground">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <span>From: {format(new Date(booking.startDate), 'PPP')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <span>To: {format(new Date(booking.endDate), 'PPP')}</span>
                        </div>
                         <div className="flex items-center gap-2 text-foreground">
                            <CalendarCheck className="h-4 w-4 text-primary" />
                            <span>Duration: {booking.numDays} day{booking.numDays !== 1 ? 's':''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="font-semibold">Total: ${booking.totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-4 border-t">
                   <Button asChild variant="outline" className="w-full">
                     <Link href={`/vehicles/${booking.vehicleId}`}>View Vehicle Details</Link>
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
