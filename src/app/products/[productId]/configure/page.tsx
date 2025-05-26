
import { getProductById, mockFeaturedDeals } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { ProductConfigurationForm } from '@/components/ProductConfigurationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { FeaturedDealCard } from '@/components/FeaturedDealCard';
import type { Product } from '@/types';

interface ProductConfigurePageProps {
  params: { productId: string };
}

export default function ProductConfigurePage({ params }: ProductConfigurePageProps) {
  const { productId } = params;
  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Product Not Found</h1>
        <p className="text-muted-foreground">Sorry, the product you are looking for does not exist.</p>
      </div>
    );
  }

  if (productId === 'special-deals') {
    const featuredDeals: Product[] = mockFeaturedDeals;
    return (
      <div className="container mx-auto py-8 md:py-12">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
          {product.description && (
            <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
        {featuredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {featuredDeals.map((deal) => (
              <FeaturedDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No special deals available at the moment. Please check back later.</p>
        )}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-amber-700 hover:bg-amber-800 text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Centered layout for garages, gazebos
  if (productId === 'garages' || productId === 'gazebos') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center mb-6 md:mb-10">
          {productId === 'gazebos' && ( // Only show outer title for gazebos
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Configure Your {product.name}
            </h1>
          )}
          {/* For garages, the title "Configure Your New Garage" is inside ProductConfigurationForm */}
        </div>
        <ProductConfigurationForm product={product} />
      </div>
    );
  }

  // Centered layout for porches
  if (productId === 'porches') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
          {product.description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
              {product.description}
            </p>
          )}
           <Button asChild size="lg" className="bg-amber-700 hover:bg-amber-800 text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
        <ProductConfigurationForm product={product} />
      </div>
    );
  }


  // Centered layout for oak beams (form handles its own title)
  if (productId === 'oak-beams') {
    return (
      <div className="container mx-auto py-8">
        {/* Title and description are handled within the form for oak-beams */}
        <ProductConfigurationForm product={product} />
      </div>
    );
  }

  // Default layout for other products (image on left, form on right)
  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className="shadow-xl rounded-lg overflow-hidden sticky top-24">
          <CardHeader className="p-0">
            <div className="aspect-square relative w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint={`${product.name.toLowerCase().split(' ').slice(0,2).join(' ')} configure`}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="text-3xl font-bold text-foreground mb-3">{product.name}</CardTitle>
            <CardDescription className="text-md text-muted-foreground leading-relaxed">
              {product.description}
            </CardDescription>
          </CardContent>
        </Card>
        
        <ProductConfigurationForm product={product} />
      </div>
    </div>
  );
}
