
'use client'; 

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'; // Added useRouter
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RentalCalculator from '@/components/RentalCalculator';
import InquiryForm from '@/components/InquiryForm';
import { getVehicleById } from '@/lib/data';
import type { Vehicle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, CalendarDays, Droplet, Zap, Gauge, Palette, Car, CheckCircle, Info, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils'; // Imported cn


export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter(); // Initialize router
  const id = typeof params.id === 'string' ? params.id : '';
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundVehicle = getVehicleById(id);
      setVehicle(foundVehicle || null);
      setCurrentImageIndex(0); // Reset image index when vehicle changes
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <Info className="h-4 w-4" />
            <AlertTitle>Vehicle Not Found</AlertTitle>
            <AlertDescription>
              The vehicle you are looking for does not exist or is currently unavailable.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  const nextImage = () => {
    if (vehicle && vehicle.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % vehicle.images.length);
    }
  };

  const prevImage = () => {
    if (vehicle && vehicle.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };

  const specIconMap: { [key: string]: React.ElementType } = {
    engine: Car,
    transmission: Gauge,
    fueltype: Droplet, 
    mileage: Gauge,
    year: CalendarDays,
    color: Palette,
    electricrange: Zap, 
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Button>
        <article>
          <Card className="overflow-hidden shadow-xl rounded-lg">
            <CardHeader className="bg-card/10 p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{vehicle.name}</h1>
                <Badge variant="secondary" className="text-lg px-4 py-2 self-start md:self-center">{vehicle.type.join(', ')}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <div className="relative group">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md bg-muted">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <Image
                        src={vehicle.images[currentImageIndex]}
                        alt={`${vehicle.name} - Image ${currentImageIndex + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                        data-ai-hint={vehicle.aiHint}
                        priority={currentImageIndex === 0} // Prioritize first image
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image Available
                      </div>
                    )}
                  </div>
                  {vehicle.images && vehicle.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/70 hover:bg-card text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/70 hover:bg-card text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {vehicle.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={cn(
                              "h-2 w-2 rounded-full transition-all",
                              index === currentImageIndex ? "bg-primary w-4" : "bg-muted hover:bg-muted-foreground/50"
                            )}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-6">
                  <h2 className="text-2xl font-headline font-semibold mb-3 text-primary">Description</h2>
                  <p className="text-foreground leading-relaxed">{vehicle.description}</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-xl text-primary">Specifications</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {Object.entries(vehicle.specifications).map(([key, value]) => {
                       if (!value) return null;
                       const specKey = key.toLowerCase().replace(/\s+/g, ''); 
                       const Icon = specIconMap[specKey] || Info;
                       const label = key.charAt(0).toUpperCase() + key.slice(1);
                       return (
                          <div key={key} className="flex items-center justify-between">
                            <span className="flex items-center text-muted-foreground"><Icon className="w-4 h-4 mr-2 text-primary" /> {label}:</span>
                            <span className="font-medium text-foreground">{value.toString()} {key === "mileage" && (vehicle.type.includes("Electric") || vehicle.type.includes("Electric Bike") ? "miles range" : "MPG")}</span>
                          </div>
                       );
                    })}
                     <div className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Users className="w-4 h-4 mr-2 text-primary" /> Capacity:</span>
                        <span className="font-medium text-foreground">{vehicle.capacity}</span>
                      </div>
                  </CardContent>
                </Card>

                {vehicle.features.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-xl text-primary">Features</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {vehicle.features.map(feature => (
                          <li key={feature} className="flex items-center text-foreground">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader><CardTitle className="text-xl text-primary">Rental Terms</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground">{vehicle.rentalTerms}</p>
                    <Separator className="my-3"/>
                    <p className="text-lg font-semibold text-primary">${vehicle.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
                  </CardContent>
                </Card>
                
              </div>
            </CardContent>
          </Card>
          
          <Separator className="my-12" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <RentalCalculator vehicle={vehicle} />
            <InquiryForm vehicleName={vehicle.name} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
