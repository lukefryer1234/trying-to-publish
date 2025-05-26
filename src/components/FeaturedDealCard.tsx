
import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FeaturedDealCardProps {
  deal: Product; // Reusing Product type for simplicity
}

export function FeaturedDealCard({ deal }: FeaturedDealCardProps) {
  const dataAiHint = deal.name.toLowerCase().split(' ').slice(0, 2).join(' ');
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Placeholder
  }).format(deal.basePrice);

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden shadow-lg rounded-lg h-full transition-shadow hover:shadow-xl">
      <div className="relative w-full sm:w-2/5 h-48 sm:h-auto shrink-0">
        <Image
          src={deal.imageUrl}
          alt={deal.name}
          layout="fill"
          objectFit="cover"
          data-ai-hint={dataAiHint + " deal"}
        />
      </div>
      <div className="flex flex-col justify-between p-4 sm:p-6 flex-grow">
        <div>
          <CardTitle className="text-xl md:text-2xl font-semibold text-foreground mb-2">{deal.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
            {deal.description}
          </CardDescription>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-bold text-primary mb-4">{formattedPrice}</p>
          <Button asChild variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
            <Link href={`/products/${deal.id}/configure`}>
              View Deal <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
