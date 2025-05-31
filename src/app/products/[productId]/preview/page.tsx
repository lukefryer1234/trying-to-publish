
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

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
      // Ensure configuration values are correctly parsed back if they were stringified
      const rawConfig: Array<SelectedConfiguration & { value: string }> = JSON.parse(configParam);
      const parsedConfig = rawConfig.map(opt => {
        const productOption = fetchedProduct.options.find(po => po.id === opt.optionId);
        let actualValue: string | number | boolean = opt.value;
        if (productOption) {
          if (productOption.type === 'checkbox') {
            actualValue = opt.value === 'true';
          } else if (productOption.type === 'slider' || productOption.type === 'number_input') {
            actualValue = parseFloat(opt.value);
          }
        }
        return { ...opt, value: actualValue };
      });
      
      setQuantity(parsedQty > 0 ? parsedQty : 1);
      setConfiguration(parsedConfig);

      const optionsPrice = parsedConfig.reduce((sum, opt) => {
         // For checkboxes, priceModifier applies if true. For others, it's direct.
        const productOption = fetchedProduct.options.find(po => po.id === opt.optionId);
        if (productOption?.type === 'checkbox') {
          return sum + (opt.value === true ? (opt.priceModifier || 0) : 0);
        }
        return sum + (opt.priceModifier || 0);
      }, 0);

      let unitPrice = fetchedProduct.basePrice;
      // Apply special pricing logic if necessary (e.g. for garages or oak beams)
      if (fetchedProduct.id === 'garages' && fetchedProduct.garagePricingParams) {
        // Simplified version of garage pricing for preview
        // A more robust solution would share the exact pricing logic
        const numBaysConfig = parsedConfig.find(c => c.optionId === 'numBays');
        const numBays = numBaysConfig ? Number(numBaysConfig.value) : 1;
        unitPrice = fetchedProduct.basePrice + ((numBays -1) * fetchedProduct.garagePricingParams.bayPrice); 
        // This is a simplification; a full rebuild of garage pricing would be needed here for 100% accuracy
         unitPrice += optionsPrice; // Add other modifiers
      } else if (fetchedProduct.id === 'oak-beams') {
        const lengthCm = parsedConfig.find(c => c.optionId === 'lengthCm')?.value as number || 0;
        const widthCm = parsedConfig.find(c => c.optionId === 'widthCm')?.value as number || 0;
        const thicknessCm = parsedConfig.find(c => c.optionId === 'thicknessCm')?.value as number || 0;
        const volumeCm3 = lengthCm * widthCm * thicknessCm;
        unitPrice = volumeCm3 * 0.0008; // Example pricing factor
        unitPrice += optionsPrice; // Add oak type modifier
      } else {
        unitPrice += optionsPrice;
      }
      
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
        <Button onClick={() => router.push('/')} className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Go to Homepage</Button>
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
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
              data-ai-hint="product custom preview"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Configuration:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {configuration.map(opt => (
                <li key={opt.optionId}>
                  <span className="font-medium">{opt.optionName}:</span> {opt.label}
                  {opt.priceModifier !== 0 && product.id !== 'garages' && product.id !== 'oak-beams' && ( // Modifiers are part of base for these
                    <span className="text-xs ml-1">
                      ({opt.priceModifier > 0 ? '+' : ''}{formatCurrency(opt.priceModifier)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-md"><span className="font-semibold text-foreground">Quantity:</span> {quantity}</p>
          <p className="text-2xl font-bold text-primary">
            Total Price: {formatCurrency(totalPrice)}
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
