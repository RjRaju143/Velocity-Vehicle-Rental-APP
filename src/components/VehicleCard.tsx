
import Image from 'next/image';
import type { Vehicle } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Tag, DollarSign } from 'lucide-react';
import { Badge } from './ui/badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
}

const VehicleCard = ({ vehicle, onViewDetails }: VehicleCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={vehicle.images[0]}
            alt={vehicle.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={vehicle.aiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-2 text-primary truncate">{vehicle.name}</CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <Badge variant="secondary" className="truncate">{vehicle.type.join(', ')}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Capacity: {vehicle.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">${vehicle.pricePerDay}/day</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground line-clamp-3">{vehicle.description}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button onClick={() => onViewDetails(vehicle)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
