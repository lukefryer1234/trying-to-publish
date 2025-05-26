
"use client";

import type { Product, SelectedConfiguration, ProductOptionValue, GaragePricingParams, ProductOption } from "@/types";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { ShoppingCart, Eye, ArrowLeft, Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductConfigurationFormProps {
  product: Product;
}

// Helper function to render a single option
const renderOption = (
  option: ProductOption, 
  currentValue: string | number | boolean | undefined, 
  handleOptionChange: (optionId: string, newValue: string | number | boolean) => void,
  productName: string
) => {
  return (
    <div key={option.id} className="text-center">
      <Label htmlFor={option.id} className="text-md font-semibold text-foreground block mb-3">
        {option.name}
      </Label>
      {option.description && <p className="text-sm text-muted-foreground -mt-2 mb-3">{option.description}</p>}

      {option.type === 'select' && option.values && (
        <div className="mx-auto max-w-xs">
          <Select
            value={currentValue as string}
            onValueChange={(value) => handleOptionChange(option.id, value)}
          >
            <SelectTrigger id={option.id} className="w-full bg-input/50 text-center">
              <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {option.values.map(val => (
                <SelectItem key={val.value} value={val.value}>
                  {val.label} {val.priceModifier && productName !== 'Garages' ? `(${val.priceModifier > 0 ? '+' : ''}$${val.priceModifier.toFixed(2)})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {option.type === 'radio' && option.values && (
        <RadioGroup
          value={currentValue as string}
          onValueChange={(value) => handleOptionChange(option.id, value)}
          className="flex justify-center flex-wrap gap-4 pt-1"
        >
          {option.values.map(val => (
            <Label 
              key={val.value} 
              htmlFor={`${option.id}-${val.value}`} 
              className={cn(
                `flex flex-col items-center justify-center space-y-2 border-2 rounded-lg hover:border-primary/70 cursor-pointer transition-all`,
                `w-40 h-40 p-3`, // Square dimensions
                currentValue === val.value ? 'border-primary ring-2 ring-primary/50' : 'border-border'
              )}
            >
              <RadioGroupItem value={val.value} id={`${option.id}-${val.value}`} className="sr-only" />
              {val.imageUrl && (
                <div className={cn(
                  "relative rounded overflow-hidden mb-1",
                  "w-28 h-28" // Square image container
                )}>
                  <Image 
                    src={val.imageUrl} 
                    alt={val.label} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint={`${productName.toLowerCase().replace(' ', '')} ${val.label.toLowerCase().replace(' ', '')}`}
                  />
                </div>
              )}
              <span className="text-sm text-center block">{val.label}</span>
                {val.priceModifier && productName !== 'Garages' ? <span className="text-xs text-muted-foreground">({val.priceModifier > 0 ? '+' : ''}$${val.priceModifier.toFixed(2)})</span> : ''}
            </Label>
          ))}
        </RadioGroup>
      )}

      {option.type === 'slider' && (
        <div className="space-y-2 pt-1 mx-auto max-w-xs">
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
        <div className="flex items-center justify-center space-x-2 pt-1">
          <Checkbox
            id={option.id}
            checked={currentValue as boolean}
            onCheckedChange={(checked) => handleOptionChange(option.id, !!checked)}
          />
          <Label htmlFor={option.id} className="font-normal cursor-pointer text-sm">
            {option.checkboxLabel || 'Yes'}
              {option.priceModifier && productName !== 'Garages' && currentValue === true ? ` (+$${option.priceModifier.toFixed(2)})` : ''}
          </Label>
        </div>
      )}
    </div>
  );
};


export function ProductConfigurationForm({ product }: ProductConfigurationFormProps) {
  const router = useRouter();
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
          value = selectedValueObj.value; 
        } else if (opt.values?.[0]) { 
            label = opt.values[0].label;
            value = opt.values[0].value;
            priceModifier = opt.values[0].priceModifier || 0;
        }
      } else if (opt.type === 'slider' || opt.type === 'number_input') {
        value = Number(opt.defaultValue);
        label = `${value} ${opt.unit || ''}`.trim();
      } else if (opt.type === 'checkbox') {
        value = Boolean(opt.defaultValue);
        label = opt.checkboxLabel || 'Enabled'; 
        if (value === true) { 
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
  const [currentPrice, setCurrentPrice] = useState(0); 

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

      let price = product.basePrice; 
      
      price += (numBays -1) * params.bayPrice; 
      price += (params.beamSizePrices[beamSize] || 0) * numBays;
      price += params.trussPrices[trussType] || 0;
      
      if (catSlide) {
        price += params.catSlidePricePerBay * numBays;
      }
      
      calculatedTotal = price * (params.baySizeMultipliers[baySize] || 1.0);

    } else if (product.id === 'oak-beams') {
        const lengthCm = getOptionValue('lengthCm') as number || 0;
        const widthCm = getOptionValue('widthCm') as number || 0;
        const thicknessCm = getOptionValue('thicknessCm') as number || 0;
        
        const volumeCm3 = lengthCm * widthCm * thicknessCm;
        let price = volumeCm3 * 0.0008; 

        const oakTypeConfig = configuration.find(c => c.optionId === 'oakType');
        if (oakTypeConfig) {
            price += oakTypeConfig.priceModifier || 0;
        }
        calculatedTotal = price;
        
    } else if (product.id === 'oak-flooring') {
        let unitBasedPrice = 0;
        let areaOrLength = 0;

        areaOrLength = getOptionValue('area') as number || 1;
        unitBasedPrice = areaOrLength * product.basePrice;
        
        calculatedTotal = unitBasedPrice;

        configuration.forEach(opt => {
            const productOption = product.options.find(po => po.id === opt.optionId);
            if (productOption && productOption.type !== 'slider') { 
                 if (productOption.type === 'checkbox' && opt.value === true) {
                    calculatedTotal += productOption.priceModifier || 0;
                 } else if (productOption.type !== 'checkbox') {
                    const selectedValueObj = productOption.values?.find(v => v.value === opt.value);
                    if (selectedValueObj) {
                        if (product.id === 'oak-flooring') {
                            calculatedTotal += (selectedValueObj.priceModifier || 0) * areaOrLength;
                        } else {
                             calculatedTotal += selectedValueObj.priceModifier || 0;
                        }
                    }
                 }
            }
        });

    } else { 
      // Default pricing for gazebos, porches, etc.
      const optionsPrice = configuration.reduce((sum, opt) => {
          const productOption = product.options.find(po => po.id === opt.optionId);
          if (productOption?.type === 'checkbox') {
              return sum + (opt.value === true ? (productOption.priceModifier || 0) : 0);
          }
          // For sliders and number_inputs, their values usually contribute to a more complex formula (handled above for oak-beams/flooring)
          // or their price is included in basePrice or another option (e.g. garage bay slider controls quantity factored into other modifiers)
          // So, typically, we don't add a simple priceModifier for them here unless it's a standalone cost.
          return sum + (productOption?.type !== 'slider' && productOption?.type !== 'number_input' ? (opt.priceModifier || 0) : 0); 
      }, 0);
      calculatedTotal = product.basePrice + optionsPrice;
    }
    
    setCurrentPrice(calculatedTotal);
  }, [configuration, product, getOptionValue]);

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
    let newPriceModifier = productOption.priceModifier || 0; 

    if (productOption.type === 'select' || productOption.type === 'radio') {
      const valueObj = productOption.values?.find(v => v.value === (newValue as string));
      if (valueObj) {
        newLabel = valueObj.label;
        newPriceModifier = valueObj.priceModifier || 0;
      }
    } else if (productOption.type === 'slider' || productOption.type === 'number_input') {
      const numericValue = Number(newValue);
      newLabel = `${numericValue} ${productOption.unit || ''}`.trim();
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

  const handleAddToCart = (message?: string) => {
    addToCart(product, quantity, configuration);
    toast({
      title: message || "Added to Cart!",
      description: `${product.name} (x${quantity}) has been added to your basket.`,
    });
  };

  const handlePreview = () => {
    const serializableConfiguration = configuration.map(opt => ({
        ...opt,
        // Ensure value is always a string for query params, especially booleans
        value: String(opt.value) 
    }));

    const queryParams = new URLSearchParams({
      quantity: quantity.toString(),
      configuration: JSON.stringify(serializableConfiguration), 
    }).toString();
    router.push(`/products/${product.id}/preview?${queryParams}`);
  };

  const totalPrice = currentPrice * quantity;

  const isSpecialConfigLayout = product.id === 'garages' || product.id === 'gazebos';
  const isOakBeamsLayout = product.id === 'oak-beams';
  const isPorchesLayout = product.id === 'porches';


  if (isSpecialConfigLayout) { // Garages & Gazebos
    const numBaysOption = product.options.find(opt => opt.id === 'numBays');
    const baySizeOption = product.options.find(opt => opt.id === 'baySize');
    const otherOptions = product.options.filter(opt => opt.id !== 'numBays' && opt.id !== 'baySize');
    
    return (
      <Card className={cn("w-full max-w-2xl mx-auto shadow-xl rounded-lg", "bg-secondary")}>
        <CardContent className="space-y-8 pt-8 px-4 md:px-8">
          {numBaysOption && renderOption(numBaysOption, getOptionValue(numBaysOption.id), handleOptionChange, product.name)}
          {baySizeOption && renderOption(baySizeOption, getOptionValue(baySizeOption.id), handleOptionChange, product.name)}
          
          {otherOptions.map(option => {
            const currentValue = configuration.find(c => c.optionId === option.id)?.value;
            return renderOption(option, currentValue, handleOptionChange, product.name);
          })}
          
           {(product.id === 'gazebos') && (
            <div className="text-center pt-4">
              <Label htmlFor="quantity-special" className="text-md font-semibold text-foreground block mb-3">
                Quantity
              </Label>
              <Input
                id="quantity-special"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                className="w-24 mx-auto bg-input/50"
              />
            </div>
          )}


          <Separator className="my-6" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Estimated Price (excl. VAT & Delivery)</p>
            <p className="text-3xl font-bold text-foreground mb-6">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-2 pb-8">
           {product.id === 'garages' && (
             <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
               <Link href="/">
                 Back to Home
               </Link>
             </Button>
           )}
          <Button onClick={handlePreview} size="lg" className="w-full sm:w-auto">
            <Eye className="mr-2 h-5 w-5" /> Preview Purchase
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isOakBeamsLayout) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl rounded-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">Configure Your Oak Beams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-4 md:px-8">
          {product.options.filter(opt => opt.id === 'oakType').map(option => {
            const currentValue = configuration.find(c => c.optionId === option.id)?.value;
            return (
              <div key={option.id} className="text-center">
                <Label htmlFor={option.id} className="text-md font-semibold text-foreground block mb-2">
                  {option.name}
                </Label>
                <div className="mx-auto max-w-xs">
                  <Select
                    value={currentValue as string}
                    onValueChange={(value) => handleOptionChange(option.id, value)}
                  >
                    <SelectTrigger id={option.id} className="w-full bg-input/50 text-center">
                      <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {option.values?.map(val => (
                        <SelectItem key={val.value} value={val.value}>
                          {val.label} {val.priceModifier ? `(${val.priceModifier > 0 ? '+' : ''}$${val.priceModifier.toFixed(2)})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}

          <div className="text-center">
            <Label className="text-md font-semibold text-foreground block mb-3">Dimensions (cm)</Label>
            <div className="grid grid-cols-3 gap-3 mx-auto max-w-md">
              {['lengthCm', 'widthCm', 'thicknessCm'].map(dimId => {
                const option = product.options.find(opt => opt.id === dimId) as ProductOption | undefined;
                if (!option) return null;
                const currentValue = configuration.find(c => c.optionId === option.id)?.value;
                return (
                  <div key={option.id} className="space-y-1">
                    <Label htmlFor={option.id} className="text-sm text-muted-foreground">{option.name}</Label>
                    <Input
                      id={option.id}
                      type="number"
                      value={currentValue as number}
                      onChange={(e) => handleOptionChange(option.id, parseFloat(e.target.value) || 0)}
                      min={option.min || 0}
                      max={option.max || undefined}
                      step={option.step || 1}
                      className="w-full text-center bg-input/50"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-center pt-2">
            <Label htmlFor="quantity-oak-beams" className="text-md font-semibold text-foreground block mb-2">
              Quantity
            </Label>
            <Input
              id="quantity-oak-beams"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              className="w-24 mx-auto bg-input/50"
            />
          </div>

          <Separator className="my-4" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Estimated Price for this Beam (excl. VAT & Delivery)</p>
            <p className="text-2xl font-bold text-foreground">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 pt-6 pb-8">
          <Button onClick={() => handleAddToCart("Added to Cutting List")} variant="default" size="lg" className="w-full sm:w-auto bg-slate-600 hover:bg-slate-700 text-white">
            <Plus className="mr-2 h-5 w-5" /> Add to Cutting List
          </Button>
          <Button onClick={() => handleAddToCart("Added Direct to Basket")} variant="outline" size="lg" className="w-full sm:w-auto">
            <ShoppingCart className="mr-2 h-5 w-5" /> Add Direct to Basket
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isPorchesLayout) {
    return (
      <Card className="w-full max-w-xl mx-auto shadow-xl rounded-lg">
        <CardHeader className="text-center pb-4 bg-muted/30">
          <CardTitle className="text-2xl font-bold text-foreground">Configure Your {product.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6 md:p-8">
          {product.options.map(option => {
            const currentValue = configuration.find(c => c.optionId === option.id)?.value;
            return renderOption(option, currentValue, handleOptionChange, product.name);
          })}
          <div className="text-center pt-2">
            <Label htmlFor="quantity-porches" className="text-md font-semibold text-foreground block mb-2">
              Quantity
            </Label>
            <Input
              id="quantity-porches"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              className="w-24 mx-auto bg-input/50"
            />
          </div>
          <Separator className="my-4" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Estimated Price (excl. VAT & Delivery)</p>
            <p className="text-3xl font-bold text-primary">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-2 pb-8">
          <Button onClick={handlePreview} size="lg" className="w-full sm:w-auto max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground">
             Preview Purchase <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    );
  }


  // Default form for other products (e.g. Oak Flooring)
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
          return renderOption(option, currentValue, handleOptionChange, product.name);
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
        <Button onClick={()=> handleAddToCart()} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

