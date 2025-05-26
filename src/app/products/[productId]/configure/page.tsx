
import { getProductById } from '@/lib/products';
import Image from 'next/image';
import { ProductConfigurationForm } from '@/components/ProductConfigurationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ProductConfigurePageProps {
  params: { productId: string };
}

export default function ProductConfigurePage({ params }: ProductConfigurePageProps) {
  const product = getProductById(params.productId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Product Not Found</h1>
        <p className="text-muted-foreground">Sorry, the product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className="shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="p-0">
            <div className="aspect-square relative w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint="product image"
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
