
"use client";

import type { Product, SelectedConfiguration, ProductOptionValue } from "@/types";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Eye } from "lucide-react";

interface ProductConfigurationFormProps {
  product: Product;
}

export function ProductConfigurationForm({ product }: ProductConfigurationFormProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const initialConfiguration = product.options.map(opt => {
    const defaultValue = opt.defaultValue || opt.values[0].value;
    const selectedValueObj = opt.values.find(v => v.value === defaultValue) || opt.values[0];
    return {
      optionId: opt.id,
      optionName: opt.name,
      value: selectedValueObj.value,
      label: selectedValueObj.label,
      priceModifier: selectedValueObj.priceModifier || 0,
    };
  });

  const [configuration, setConfiguration] = useState<SelectedConfiguration[]>(initialConfiguration);
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(product.basePrice);

  const calculatePrice = useCallback(() => {
    const optionsPrice = configuration.reduce((sum, opt) => sum + (opt.priceModifier || 0), 0);
    setCurrentPrice(product.basePrice + optionsPrice);
  }, [configuration, product.basePrice]);

  useEffect(() => {
    calculatePrice();
  }, [configuration, calculatePrice]);

  const handleOptionChange = (optionId: string, value: string) => {
    const productOption = product.options.find(opt => opt.id === optionId);
    if (!productOption) return;

    const selectedValueObj = productOption.values.find(v => v.value === value);
    if (!selectedValueObj) return;
    
    setConfiguration(prevConfig =>
      prevConfig.map(opt =>
        opt.optionId === optionId
          ? { ...opt, value: selectedValueObj.value, label: selectedValueObj.label, priceModifier: selectedValueObj.priceModifier || 0 }
          : opt
      )
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, configuration);
  };

  const handlePreview = () => {
    const queryParams = new URLSearchParams({
      productId: product.id,
      quantity: quantity.toString(),
      configuration: JSON.stringify(configuration),
    }).toString();
    router.push(`/products/${product.id}/preview?${queryParams}`);
  };

  return (
    <Card className="w-full shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">Configure Your {product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {product.options.map(option => (
          <div key={option.id} className="space-y-2">
            <Label htmlFor={option.id} className="text-md font-medium text-foreground">{option.name}</Label>
            {option.type === 'select' && (
              <Select
                defaultValue={configuration.find(c => c.optionId === option.id)?.value}
                onValueChange={(value) => handleOptionChange(option.id, value)}
              >
                <SelectTrigger id={option.id} className="w-full bg-input/50">
                  <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {option.values.map(val => (
                    <SelectItem key={val.value} value={val.value}>
                      {val.label} {val.priceModifier ? `(+$${val.priceModifier.toFixed(2)})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {option.type === 'radio' && (
              <RadioGroup
                defaultValue={configuration.find(c => c.optionId === option.id)?.value}
                onValueChange={(value) => handleOptionChange(option.id, value)}
                className="flex flex-wrap gap-4"
              >
                {option.values.map(val => (
                  <div key={val.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={val.value} id={`${option.id}-${val.value}`} />
                    <Label htmlFor={`${option.id}-${val.value}`} className="font-normal">
                      {val.label} {val.priceModifier ? `(+$${val.priceModifier.toFixed(2)})` : ''}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        ))}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-md font-medium text-foreground">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            className="w-24 bg-input/50"
          />
        </div>
        <div className="text-2xl font-bold text-primary pt-4">
          Total Price: ${ (currentPrice * quantity).toFixed(2) }
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
        <Button onClick={handlePreview} variant="outline" size="lg" className="w-full sm:w-auto">
          <Eye className="mr-2 h-5 w-5" /> Preview Configuration
        </Button>
      </CardFooter>
    </Card>
  );
}
