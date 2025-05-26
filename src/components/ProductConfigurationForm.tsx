
"use client";

import type { Product, SelectedConfiguration, ProductOptionValue, GaragePricingParams } from "@/types";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation"; // Added useParams
import Link from "next/link";
import Image from "next/image";
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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductConfigurationFormProps {
  product: Product;
}

export function ProductConfigurationForm({ product }: ProductConfigurationFormProps) {
  const router = useRouter();
  const params = useParams(); // Get params if needed, e.g. for specific product logic
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const initializeConfiguration = (): SelectedConfiguration[] => {
    return product.options.map(opt => {
      let value: string | number | boolean = opt.defaultValue!;
      let label = '';
      let priceModifier = opt.priceModifier || 0;

      if (opt.type === 'select' || opt.type === 'radio') {
        const selectedValueObj = opt.values?.find(v => v.value === value) || opt.values?.[0];
        if (selectedValueObj) {
          label = selectedValueObj.label;
          priceModifier = selectedValueObj.priceModifier || 0;
          value = selectedValueObj.value; // ensure value is from the object
        } else if (opt.values?.[0]) { // Fallback to first option if defaultValue is invalid
            label = opt.values[0].label;
            value = opt.values[0].value;
            priceModifier = opt.values[0].priceModifier || 0;
        }
      } else if (opt.type === 'slider') {
        value = Number(opt.defaultValue);
        label = `${value} ${opt.unit || ''}`.trim();
        // priceModifier for slider is handled in custom logic mostly
      } else if (opt.type === 'checkbox') {
        value = Boolean(opt.defaultValue);
        label = opt.checkboxLabel || 'Enabled'; // General label
        if (value === true) { // priceModifier applies if checked
            priceModifier = opt.priceModifier || 0;
        } else {
            priceModifier = 0;
        }
      }
      return {
        optionId: opt.id,
        optionName: opt.name,
        value: value,
        label: label,
        priceModifier: priceModifier,
      };
    });
  };

  const [configuration, setConfiguration] = useState<SelectedConfiguration[]>(initializeConfiguration());
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0); // Initialize to 0, calculate on mount

  const getOptionValue = useCallback((optionId: string): string | number | boolean | undefined => {
    return configuration.find(c => c.optionId === optionId)?.value;
  }, [configuration]);

  const calculatePrice = useCallback(() => {
    let calculatedTotal = product.basePrice;

    if (product.id === 'garages' && product.garagePricingParams) {
      const params = product.garagePricingParams;
      const numBays = getOptionValue('numBays') as number || 1;
      const beamSize = getOptionValue('beamSize') as string || '6x6';
      const trussType = getOptionValue('trussType') as string || 'curved';
      const baySize = getOptionValue('baySize') as string || 'standard';
      const catSlide = getOptionValue('catSlide') as boolean || false;

      let price = product.basePrice; // Start with product base (e.g. for 1 bay)
      
      // Adjust for number of bays (base price is for 1 bay, add cost for additional bays)
      price += (numBays -1) * params.bayPrice; // If base price is not for 1 bay, then it is numBays * params.bayPrice

      // Cost for beam size (per bay)
      price += (params.beamSizePrices[beamSize] || 0) * numBays;
      
      // Cost for truss type (one-off)
      price += params.trussPrices[trussType] || 0;
      
      // Cost for cat slide (per bay)
      if (catSlide) {
        price += params.catSlidePricePerBay * numBays;
      }
      
      // Apply bay size multiplier to the subtotal
      calculatedTotal = price * (params.baySizeMultipliers[baySize] || 1.0);

    } else if (product.id === 'oak-beams' || product.id === 'oak-flooring') {
        // Custom pricing for items priced per unit (e.g. per meter or per m2)
        let unitBasedPrice = 0;
        let areaOrLength = 0;

        if (product.id === 'oak-beams') {
            areaOrLength = getOptionValue('length') as number || 1;
            // basePrice is per unit, or option priceModifier is per unit
            const lengthOption = product.options.find(o => o.id === 'length');
            unitBasedPrice = areaOrLength * (lengthOption?.priceModifier || product.basePrice);
        } else if (product.id === 'oak-flooring') {
            areaOrLength = getOptionValue('area') as number || 1;
            unitBasedPrice = areaOrLength * product.basePrice;
        }
        
        calculatedTotal = unitBasedPrice;

        // Add modifiers from other options
        configuration.forEach(opt => {
            const productOption = product.options.find(po => po.id === opt.optionId);
            if (productOption && productOption.type !== 'slider') { // Slider price handled above
                 if (productOption.type === 'checkbox' && opt.value === true) {
                    calculatedTotal += productOption.priceModifier || 0;
                 } else if (productOption.type !== 'checkbox') {
                    // For select/radio, priceModifier is on ProductOptionValue
                    const selectedValueObj = productOption.values?.find(v => v.value === opt.value);
                    if (selectedValueObj) {
                        // For flooring, modifiers are often per m2
                        if (product.id === 'oak-flooring') {
                            calculatedTotal += (selectedValueObj.priceModifier || 0) * areaOrLength;
                        } else {
                             calculatedTotal += selectedValueObj.priceModifier || 0;
                        }
                    }
                 }
            }
        });

    } else { // Generic pricing for other products
      const optionsPrice = configuration.reduce((sum, opt) => {
          // For checkboxes, priceModifier is on ProductOption itself if checked
          if (product.options.find(po => po.id === opt.optionId)?.type === 'checkbox') {
              return sum + (opt.value === true ? (product.options.find(po => po.id === opt.optionId)?.priceModifier || 0) : 0);
          }
          return sum + (opt.priceModifier || 0); // opt.priceModifier should be from ProductOptionValue for select/radio
      }, 0);
      calculatedTotal = product.basePrice + optionsPrice;
    }
    
    setCurrentPrice(calculatedTotal);
  }, [configuration, product]);

  useEffect(() => {
    calculatePrice();
  }, [configuration, calculatePrice]);

  const handleOptionChange = (
    optionId: string,
    newValue: string | number | boolean
  ) => {
    const productOption = product.options.find(opt => opt.id === optionId);
    if (!productOption) return;

    let newLabel = '';
    let newPriceModifier = 0; // This is the price modifier of the *specific option value chosen*

    if (productOption.type === 'select' || productOption.type === 'radio') {
      const valueObj = productOption.values?.find(v => v.value === (newValue as string));
      if (valueObj) {
        newLabel = valueObj.label;
        newPriceModifier = valueObj.priceModifier || 0;
      }
    } else if (productOption.type === 'slider') {
      newLabel = `${newValue} ${productOption.unit || ''}`.trim();
      // priceModifier for slider is complex, not a simple value.
      // The effect of slider on price is handled directly in calculatePrice.
    } else if (productOption.type === 'checkbox') {
      newLabel = newValue ? (productOption.checkboxLabel || 'Yes') : ('No');
      newPriceModifier = newValue ? (productOption.priceModifier || 0) : 0;
    }
    
    setConfiguration(prevConfig =>
      prevConfig.map(opt =>
        opt.optionId === optionId
          ? { ...opt, value: newValue, label: newLabel, priceModifier: newPriceModifier }
          : opt
      )
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, configuration);
    toast({
      title: "Added to Cart!",
      description: `${product.name} (x${quantity}) has been added to your basket.`,
    });
  };

  const handlePreview = () => {
    // Ensure configuration values are stringified correctly for URL
    const serializableConfiguration = configuration.map(opt => ({
        ...opt,
        value: String(opt.value) // Convert all values to string for query param
    }));

    const queryParams = new URLSearchParams({
      //productId: product.id, // productId is in the URL path already
      quantity: quantity.toString(),
      configuration: JSON.stringify(serializableConfiguration), // Use the original full config state
    }).toString();
    router.push(`/products/${product.id}/preview?${queryParams}`);
  };

  const totalPrice = currentPrice * quantity;

  return (
    <Card className="w-full shadow-xl rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">Configure Your {product.name}</CardTitle>
        {product.options.find(opt => opt.id === 'description' && opt.type === 'checkbox') && (
           <CardDescription>{product.options.find(opt => opt.id === 'description')?.checkboxLabel}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {product.options.map(option => {
          const currentValue = configuration.find(c => c.optionId === option.id)?.value;
          return (
            <div key={option.id} className="space-y-3 border-b pb-4 last:border-b-0 last:pb-0">
              <Label htmlFor={option.id} className="text-md font-medium text-foreground block">{option.name}</Label>
              {option.description && <p className="text-sm text-muted-foreground -mt-2 mb-2">{option.description}</p>}

              {option.type === 'select' && option.values && (
                <Select
                  value={currentValue as string}
                  onValueChange={(value) => handleOptionChange(option.id, value)}
                >
                  <SelectTrigger id={option.id} className="w-full bg-input/50">
                    <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.values.map(val => (
                      <SelectItem key={val.value} value={val.value}>
                        {val.label} {val.priceModifier && product.id !== 'garages' ? `(${val.priceModifier > 0 ? '+' : ''}$${val.priceModifier.toFixed(2)})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {option.type === 'radio' && option.values && (
                <RadioGroup
                  value={currentValue as string}
                  onValueChange={(value) => handleOptionChange(option.id, value)}
                  className="flex flex-wrap gap-4 pt-1"
                >
                  {option.values.map(val => (
                    <Label key={val.value} htmlFor={`${option.id}-${val.value}`} className="flex flex-col items-center space-y-2 p-3 border rounded-md hover:border-primary cursor-pointer data-[state=checked]:border-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary transition-all"
                      data-state={currentValue === val.value ? 'checked' : 'unchecked'}
                    >
                      <RadioGroupItem value={val.value} id={`${option.id}-${val.value}`} className="sr-only" />
                      {val.imageUrl && (
                        <div className="relative w-24 h-16 rounded overflow-hidden">
                          <Image src={val.imageUrl} alt={val.label} layout="fill" objectFit="cover" data-ai-hint={`${product.name.toLowerCase()} ${val.label.toLowerCase()}`}/>
                        </div>
                      )}
                      <span className="text-sm text-center">{val.label}</span>
                      {val.priceModifier && product.id !== 'garages' && (
                        <span className="text-xs text-muted-foreground">({val.priceModifier > 0 ? '+' : ''}${val.priceModifier.toFixed(2)})</span>
                      )}
                    </Label>
                  ))}
                </RadioGroup>
              )}

              {option.type === 'slider' && (
                <div className="space-y-2 pt-1">
                   <Slider
                    id={option.id}
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    value={[currentValue as number]}
                    onValueChange={(newVal) => handleOptionChange(option.id, newVal[0])}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {currentValue as number} {option.unit || ''}
                  </div>
                </div>
              )}

              {option.type === 'checkbox' && (
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id={option.id}
                    checked={currentValue as boolean}
                    onCheckedChange={(checked) => handleOptionChange(option.id, !!checked)}
                  />
                  <Label htmlFor={option.id} className="font-normal cursor-pointer">
                    {option.checkboxLabel || 'Enable'}
                    {option.priceModifier && product.id !== 'garages' && currentValue === true ? ` (+$${option.priceModifier.toFixed(2)})` : ''}
                  </Label>
                </div>
              )}
            </div>
          )
        })}
        
        <div className="space-y-2 pt-4">
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

        <div className="text-2xl font-bold text-primary pt-6 border-t mt-6">
          Total Price: ${totalPrice.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
         <Button onClick={() => router.back()} variant="outline" size="lg" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <Button onClick={handlePreview} variant="outline" size="lg" className="w-full sm:w-auto">
          <Eye className="mr-2 h-5 w-5" /> Preview Configuration
        </Button>
        <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

