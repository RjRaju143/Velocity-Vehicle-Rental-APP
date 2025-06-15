'use client';

import * as React from 'react';
import type { FilterOptions, VehicleType } from '@/lib/types';
import { vehicleTypesList, vehicleCapacitiesList, priceRangesList } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterX } from 'lucide-react';

interface VehicleFilterProps {
  initialFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const VehicleFilter = ({ initialFilters, onFilterChange }: VehicleFilterProps) => {
  const [filters, setFilters] = React.useState<FilterOptions>(initialFilters);

  const handleTypeChange = (value: string) => {
    const newType = value === 'All' ? undefined : value as VehicleType;
    setFilters(prev => ({ ...prev, type: newType }));
  };

  const handleCapacityChange = (value: string) => {
    const newCapacity = value === 'Any' ? undefined : parseInt(value);
    setFilters(prev => ({ ...prev, capacity: newCapacity }));
  };

  const handlePriceRangeChange = (value: string) => {
    const newPriceRange = value === 'Any' ? undefined : value;
    setFilters(prev => ({ ...prev, priceRange: newPriceRange }));
  };
  
  React.useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const resetFilters = () => {
    const defaultFilters = { type: undefined, capacity: undefined, priceRange: undefined };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">Filter Vehicles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="vehicleType" className="text-sm font-medium">Vehicle Type</Label>
          <Select value={filters.type || 'All'} onValueChange={handleTypeChange}>
            <SelectTrigger id="vehicleType" className="w-full mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {vehicleTypesList.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="capacity" className="text-sm font-medium">Capacity</Label>
          <Select value={filters.capacity?.toString() || 'Any'} onValueChange={handleCapacityChange}>
            <SelectTrigger id="capacity" className="w-full mt-1">
              <SelectValue placeholder="Select capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any Capacity</SelectItem>
              {vehicleCapacitiesList.map(cap => (
                <SelectItem key={cap} value={cap.toString()}>{cap} seats</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priceRange" className="text-sm font-medium">Price Range (/day)</Label>
          <Select value={filters.priceRange || 'Any'} onValueChange={handlePriceRangeChange}>
            <SelectTrigger id="priceRange" className="w-full mt-1">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Any">Any Price</SelectItem>
              {priceRangesList.map(range => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={resetFilters} variant="outline" className="w-full">
          <FilterX className="mr-2 h-4 w-4" /> Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleFilter;
