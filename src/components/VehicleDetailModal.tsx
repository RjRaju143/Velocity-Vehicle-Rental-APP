
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Vehicle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Users, CalendarDays, Droplet, Zap, Gauge, Palette, Car, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleDetailModal = ({ vehicle, isOpen, onClose }: VehicleDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!vehicle) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + vehicle.images.length) % vehicle.images.length);
  };

  const specIconMap: { [key: string]: React.ElementType } = {
    engine: Car,
    transmission: Gauge,
    fueltype: Droplet,
    mileage: Gauge,
    year: CalendarDays,
    color: Palette,
    capacity: Users,
    electricrange: Zap,
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setCurrentImageIndex(0); // Reset image index when closing
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-2xl md:text-3xl text-primary">{vehicle.name}</DialogTitle>
          <DialogDescription>
            <Badge variant="secondary" className="text-md px-3 py-1">{vehicle.type.join(', ')}</Badge>
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-6">
            {/* Image Gallery */}
            <div className="relative group">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md bg-muted">
                {vehicle.images.length > 0 ? (
                  <Image
                    src={vehicle.images[currentImageIndex]}
                    alt={`${vehicle.name} - Image ${currentImageIndex + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 ease-in-out"
                    data-ai-hint={vehicle.aiHint}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image Available</div>
                )}
              </div>
              {vehicle.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/70 hover:bg-card text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/70 hover:bg-card text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                    {vehicle.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "h-2 w-2 rounded-full transition-all",
                          index === currentImageIndex ? "bg-primary w-3" : "bg-muted hover:bg-muted-foreground/50"
                        )}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Description</h3>
                <p className="text-sm text-foreground leading-relaxed">{vehicle.description}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Specifications</h3>
                <ul className="space-y-1 text-sm">
                  {Object.entries(vehicle.specifications).map(([key, value]) => {
                    if (!value) return null;
                    const Icon = specIconMap[key.toLowerCase().replace(/\s+/g, '')] || Info;
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    return (
                      <li key={key} className="flex items-center justify-between">
                        <span className="flex items-center text-muted-foreground"><Icon className="w-4 h-4 mr-2 text-primary" /> {label}:</span>
                        <span className="font-medium text-foreground text-right">{value.toString()} {key === "mileage" && (vehicle.type.includes("Electric") || vehicle.type.includes("Electric Bike") ? "miles range" : "MPG")}</span>
                      </li>
                    );
                  })}
                  <li className="flex items-center justify-between">
                    <span className="flex items-center text-muted-foreground"><Users className="w-4 h-4 mr-2 text-primary" /> Capacity:</span>
                    <span className="font-medium text-foreground">{vehicle.capacity}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {vehicle.features.length > 0 && (
            <>
            <Separator className="my-4"/>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Features</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {vehicle.features.map(feature => (
                  <li key={feature} className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            </>
          )}
          
          <Separator className="my-4"/>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">Rental Terms</h3>
            <p className="text-sm text-foreground mb-2">{vehicle.rentalTerms}</p>
            <p className="text-xl font-bold text-primary">${vehicle.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
          </div>

        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t bg-background bottom-0 sm:justify-between">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto order-first sm:order-none">
            <Link href={`/vehicles/${vehicle.id}`} onClick={onClose}>
              <ExternalLink className="mr-2 h-4 w-4" /> Full Details & Booking
            </Link>
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto order-last sm:order-last mt-2 sm:mt-0">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;
