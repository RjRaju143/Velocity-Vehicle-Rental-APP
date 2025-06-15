
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VehicleCard from '@/components/VehicleCard';
import VehicleFilter from '@/components/VehicleFilter';
import VehicleRecommendations from '@/components/VehicleRecommendations';
import VehicleDetailModal from '@/components/VehicleDetailModal';
import { vehicles as allVehicles, priceRangesList } from '@/lib/data';
import type { FilterOptions, Vehicle } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

const defaultFilters: FilterOptions = {
  type: undefined,
  capacity: undefined,
  priceRange: undefined,
};

export default function HomePage() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const filteredVehicles = useMemo(() => {
    return allVehicles.filter(vehicle => {
      if (filters.type && !vehicle.type.includes(filters.type)) return false; // Updated filter logic
      if (filters.capacity && vehicle.capacity < filters.capacity) return false;
      if (filters.priceRange) {
        const range = priceRangesList.find(r => r.value === filters.priceRange);
        if (range && (vehicle.pricePerDay < range.min || vehicle.pricePerDay > range.max)) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicleForModal(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicleForModal(null);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </aside>
            <section className="lg:col-span-3">
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section aria-labelledby="main-title" className="text-center mb-10">
          <h1 id="main-title" className="font-headline text-4xl md:text-5xl font-bold mb-3 text-primary">
            Find Your Perfect Ride
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive collection of vehicles. Use the filters to narrow down your search or get AI-powered recommendations.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-8">
            <VehicleFilter initialFilters={defaultFilters} onFilterChange={handleFilterChange} />
            <VehicleRecommendations currentFilters={filters} />
          </aside>

          <section aria-labelledby="vehicle-listing-title" className="lg:col-span-3">
            <h2 id="vehicle-listing-title" className="font-headline text-3xl font-semibold mb-6 text-primary">
              Available Vehicles ({filteredVehicles.length})
            </h2>

            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} onViewDetails={handleViewDetails} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No vehicles match your current filters.</p>
                <p className="text-sm mt-2">Try adjusting your search or resetting the filters.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      {selectedVehicleForModal && (
        <VehicleDetailModal
          vehicle={selectedVehicleForModal}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
