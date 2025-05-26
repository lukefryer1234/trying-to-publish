
"use client";

import { useSearchParams, useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProductById } from '@/lib/products';
import type { Product, SelectedConfiguration } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { AlertTriangle, Edit3, ShoppingCart } from 'lucide-react';

export default function ProductPreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [configuration, setConfiguration] = useState<SelectedConfiguration[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productId = params.productId as string;
    const quantityParam = searchParams.get('quantity');
    const configParam = searchParams.get('configuration');

    if (!productId || !quantityParam || !configParam) {
      setError("Missing product information for preview.");
      return;
    }

    const fetchedProduct = getProductById(productId);
    if (!fetchedProduct) {
      setError("Product not found.");
      return;
    }
    setProduct(fetchedProduct);

    try {
      const parsedQty = parseInt(quantityParam, 10);
      const parsedConfig: SelectedConfiguration[] = JSON.parse(configParam);
      
      setQuantity(parsedQty > 0 ? parsedQty : 1);
      setConfiguration(parsedConfig);

      const optionsPrice = parsedConfig.reduce((sum, opt) => sum + (opt.priceModifier || 0), 0);
      const unitPrice = fetchedProduct.basePrice + optionsPrice;
      setTotalPrice(unitPrice * parsedQty);

    } catch (e) {
      setError("Invalid configuration data.");
      console.error("Error parsing preview data:", e);
    }
  }, [searchParams, params]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Preview Error</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading preview...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, configuration);
      router.push('/basket');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Product Preview</h1>
      <Card className="max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">{product.name}</CardTitle>
          <CardDescription>Review your selections before adding to cart.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video relative w-full rounded-md overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint="product custom"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Configuration:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {configuration.map(opt => (
                <li key={opt.optionId}>
                  <span className="font-medium">{opt.optionName}:</span> {opt.label}
                  {opt.priceModifier !== 0 && (
                    <span className="text-xs ml-1">
                      ({opt.priceModifier > 0 ? '+' : ''}${opt.priceModifier.toFixed(2)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-md"><span className="font-semibold text-foreground">Quantity:</span> {quantity}</p>
          <p className="text-2xl font-bold text-primary">
            Total Price: ${totalPrice.toFixed(2)}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button onClick={() => router.push(`/products/${product.id}/configure`)} variant="outline" size="lg" className="w-full sm:w-auto">
            <Edit3 className="mr-2 h-5 w-5" /> Edit Configuration
          </Button>
          <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
