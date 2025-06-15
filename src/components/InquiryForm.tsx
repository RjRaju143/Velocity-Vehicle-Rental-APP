'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { InquiryFormData } from '@/lib/types';
import { Mail } from 'lucide-react';

interface InquiryFormProps {
  vehicleName?: string;
}

const InquiryForm = ({ vehicleName }: InquiryFormProps) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    message: '',
    vehicleName: vehicleName || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Inquiry submitted:', formData);
    toast({
      title: 'Inquiry Sent!',
      description: `Thank you, ${formData.name}. We'll get back to you soon regarding ${vehicleName ? vehicleName : 'your inquiry'}.`,
      variant: 'default',
    });
    setFormData({ name: '', email: '', message: '', vehicleName: vehicleName || '' });
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg rounded-lg mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">
          Inquire About {vehicleName || 'This Vehicle'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {vehicleName && (
            <Input type="hidden" name="vehicleName" value={vehicleName} />
          )}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your questions or comments..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              <>
              <Mail className="mr-2 h-4 w-4" /> Send Inquiry
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InquiryForm;
