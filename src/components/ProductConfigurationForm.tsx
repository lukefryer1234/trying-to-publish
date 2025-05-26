
"use client";

import type { Product, SelectedConfiguration, ProductOption } from "@/types";
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
  product: Product, // Changed from productName to product object
  isSpecialLayout: boolean // Determines centered styling for labels/controls
) => {
  const controlContainerClasses = isSpecialLayout ? "mx-auto max-w-xs" : "";
  const inputClasses = isSpecialLayout ? "bg-background/70" : "bg-input/50";
  const productName = product.name; // Get productName from product object

  return (
    <div key={option.id} className={cn(isSpecialLayout ? "text-center mb-8" : "mb-6")}>
      <Label htmlFor={option.id} className={cn("text-md font-semibold text-foreground block mb-3", isSpecialLayout ? "" : "text-left")}>
        {option.name}
      </Label>
      {option.description && <p className={cn("text-sm text-muted-foreground -mt-2 mb-3", isSpecialLayout ? "" : "text-left")}>{option.description}</p>}

      {option.type === 'select' && option.values && (
        <div className={controlContainerClasses}>
          <Select
            value={currentValue as string}
            onValueChange={(value) => handleOptionChange(option.id, value)}
          >
            <SelectTrigger id={option.id} className={cn("w-full", inputClasses, isSpecialLayout ? "text-center" : "")}>
              <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {option.values.map(val => (
                <SelectItem key={val.value} value={val.value}>
                  {val.label} {val.priceModifier && productName !== 'Garages' && product.id !== 'oak-beams' ? `(${val.priceModifier > 0 ? '+' : ''}£${val.priceModifier.toFixed(2)})` : ''}
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
          className={cn("flex flex-wrap gap-4 pt-1", isSpecialLayout ? "justify-center" : "")}
        >
          {option.values.map(val => (
            <Label
              key={val.value}
              htmlFor={`${option.id}-${val.value}`}
              className={cn(
                `flex flex-col items-center justify-center space-y-2 border-2 rounded-lg hover:border-primary/70 cursor-pointer transition-all`,
                isSpecialLayout ? "w-40 h-40 p-3" : "w-24 h-24 p-2",
                currentValue === val.value ? 'border-primary ring-2 ring-primary/50' : 'border-border'
              )}
            >
              <RadioGroupItem value={val.value} id={`${option.id}-${val.value}`} className="sr-only" />
              {val.imageUrl && (
                <div className={cn(
                  "relative rounded overflow-hidden mb-1",
                   isSpecialLayout ? "w-28 h-28" : "w-20 h-20"
                )}
                data-ai-hint={`${productName.toLowerCase().replace(/\s+/g, '-')}-${val.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Image
                    src={val.imageUrl}
                    alt={val.label}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <span className="text-sm text-center block">{val.label}</span>
                {val.priceModifier && productName !== 'Garages' && product.id !== 'oak-beams' ? <span className="text-xs text-muted-foreground">({val.priceModifier > 0 ? '+' : ''}£${val.priceModifier.toFixed(2)})</span> : ''}
            </Label>
          ))}
        </RadioGroup>
      )}

      {option.type === 'slider' && (
        <div className={cn("space-y-2 pt-1", controlContainerClasses)}>
          <Slider
            id={option.id}
            min={option.min}
            max={option.max}
            step={option.step}
            value={[currentValue as number]}
            onValueChange={(newVal) => handleOptionChange(option.id, newVal[0])}
            className="w-full"
          />
          <div className={cn("text-sm text-muted-foreground", isSpecialLayout ? "text-center" : "text-left")}>
            {currentValue as number} {option.unit || ''}
          </div>
        </div>
      )}

      {option.type === 'number_input' && (
         <div className={controlContainerClasses}>
            <Input
                id={option.id}
                type="number"
                value={currentValue as number}
                onChange={(e) => handleOptionChange(option.id, parseFloat(e.target.value) || 0)}
                min={option.min || 0}
                max={option.max || undefined}
                step={option.step || 1}
                className={cn("w-full", inputClasses, isSpecialLayout ? "text-center" : "")}
            />
         </div>
      )}


      {option.type === 'checkbox' && (
        <div className={cn("flex items-center space-x-2 pt-1", isSpecialLayout ? "justify-center" : "")}>
          <Checkbox
            id={option.id}
            checked={currentValue as boolean}
            onCheckedChange={(checked) => handleOptionChange(option.id, !!checked)}
          />
          <Label htmlFor={option.id} className="font-normal cursor-pointer text-sm">
            {option.checkboxLabel || 'Yes'}
              {option.priceModifier && productName !== 'Garages' && product.id !== 'oak-beams' && currentValue === true ? ` (+£${option.priceModifier.toFixed(2)})` : ''}
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
      const baySize = getOptionValue('baySize') as string || 'standard'; // Width Per Bay
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
        value: String(opt.value)
    }));

    const queryParams = new URLSearchParams({
      quantity: quantity.toString(),
      configuration: JSON.stringify(serializableConfiguration),
    }).toString();
    router.push(`/products/${product.id}/preview?${queryParams}`);
  };

  const totalPrice = currentPrice * quantity;
  const formattedTotalPrice = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(totalPrice);

  const isOakBeamsLayout = product.id === 'oak-beams';
  const isPorchesLayout = product.id === 'porches';

  // Determine if special centered layout should be used (Garages, Gazebos, Oak Flooring, etc.)
  const isSpecialConfigLayout = !isOakBeamsLayout && !isPorchesLayout;


  if (isOakBeamsLayout) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl rounded-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">Configure Your Oak Beams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-4 md:px-8">
          {product.options.filter(opt => opt.id === 'oakType').map(option => {
            const currentValue = configuration.find(c => c.optionId === option.id)?.value;
            return renderOption(option, currentValue, handleOptionChange, product, false);
          })}

          <div className="text-center">
            <Label className="text-md font-semibold text-foreground block mb-3">Dimensions (cm)</Label>
            <div className="grid grid-cols-3 gap-3 mx-auto max-w-md">
              {['lengthCm', 'widthCm', 'thicknessCm'].map(dimId => {
                const option = product.options.find(opt => opt.id === dimId) as ProductOption | undefined;
                if (!option) return null;
                 return renderOption(option, getOptionValue(option.id), handleOptionChange, product, false);
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
              {formattedTotalPrice}
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
            return renderOption(option, currentValue, handleOptionChange, product, false);
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
              {formattedTotalPrice}
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

  // Default layout for Garages, Gazebos, Oak Flooring, and other generic products
  // Uses centered options and specific card styling.
  const orderedOptionsConfig = [
    { id: 'numBays', productIds: ['garages', 'gazebos'] },
    { id: 'beamSize', productIds: ['garages'] },
    { id: 'baySize', productIds: ['garages', 'gazebos'] }, // Width Per Bay
    { id: 'trussType', productIds: ['garages', 'gazebos'] },
    { id: 'catSlide', productIds: ['garages'] },
    // Gazebo specific options
    { id: 'legType', productIds: ['gazebos'] },
    { id: 'sizeType', productIds: ['gazebos'] }, // This is width for Gazebos
  ];

  let orderedOptions: ProductOption[] = [];
  let remainingOptions: ProductOption[] = [...product.options];

  if (isSpecialConfigLayout) { // This covers Garages and Gazebos
    orderedOptionsConfig.forEach(config => {
      if (config.productIds.includes(product.id)) {
        const option = product.options.find(opt => opt.id === config.id);
        if (option) {
          orderedOptions.push(option);
          remainingOptions = remainingOptions.filter(opt => opt.id !== config.id);
        }
      }
    });
    // Ensure specific order for garages
    if (product.id === 'garages') {
        orderedOptions.sort((a,b) => {
            const order = ['numBays', 'beamSize', 'baySize', 'trussType', 'catSlide'];
            return order.indexOf(a.id) - order.indexOf(b.id);
        });
    }
     // Ensure specific order for Gazebos (if different from garages)
    if (product.id === 'gazebos') {
        orderedOptions.sort((a,b) => {
            const order = ['legType', 'sizeType', 'trussType']; // Example specific order for gazebos
            return order.indexOf(a.id) - order.indexOf(b.id);
        });
    }
  } else {
    // For other products that might fall into isSpecialConfigLayout but are not Garages/Gazebos (e.g. Oak Flooring)
    orderedOptions = [...product.options];
    remainingOptions = [];
  }


  return (
    <Card className={cn("w-full shadow-xl rounded-lg border-2 bg-secondary", (isSpecialConfigLayout) ? "max-w-2xl mx-auto" : "")}>
      {isSpecialConfigLayout && product.id !== 'garages' && (
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">Configure Your {product.name}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("space-y-8 pt-8 px-4 md:px-8", !isSpecialConfigLayout || product.id === 'garages' ? "pt-6" : "")}>
        {product.id === 'garages' && (
          <>
            <h2 className="text-3xl font-bold text-foreground text-center mb-6">
              Configure Your New Garage
            </h2>
            <Separator className="my-6 bg-border/50" />
          </>
        )}

        {orderedOptions.map(option => {
          const currentValue = configuration.find(c => c.optionId === option.id)?.value;
          return renderOption(option, currentValue, handleOptionChange, product, true); // true for isSpecialLayout
        })}
        {remainingOptions.map(option => {
            const currentValue = configuration.find(c => c.optionId === option.id)?.value;
            return renderOption(option, currentValue, handleOptionChange, product, true); // true for isSpecialLayout
        })}

        <div className="text-center pt-4">
          <Label htmlFor={`quantity-${product.id}`} className="text-md font-semibold text-foreground block mb-3">
            Quantity
          </Label>
          <Input
            id={`quantity-${product.id}`}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            className="w-24 mx-auto bg-background/70"
          />
        </div>

        <Separator className="my-6" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Estimated Price (excl. VAT & Delivery)</p>
          <p className="text-3xl font-bold text-foreground mb-6">
            {formattedTotalPrice}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-8 px-4 md:px-8">
        {(product.id === 'garages' || product.id === 'gazebos') ? (
          <div className="w-full grid grid-cols-2 gap-4">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => handleAddToCart()}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Basket
            </Button>
            <Button
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => {
                handleAddToCart("Item added to cart. Proceeding to checkout...");
                router.push('/checkout');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.326 4.111c.404-.196.606.096.48.492l-2.05 6.993c-.11.375.068.66.45.66h2.727c2.56 0 4.259-1.215 4.527-3.708.215-1.96-.859-3.016-2.739-3.016h-2.063c-.233 0-.39-.114-.31-.325l.836-2.096c.08-.21.242-.35.46-.35h2.563c.382 0 .58-.275.47-.643L11.251.53C11.141.176 10.94 0 10.557 0H4.493c-.383 0-.581.276-.471.643l1.746 4.389c.11.276-.068.562-.45.562H3.165c-2.31 0-3.621 1.5-3.165 4.027.382 2.13 1.968 3.334 4.027 3.334h1.478c.55 0 .836.383.709.909l-1.715 5.503c-.128.41.053.709.442.709h4.027l.096-.3c.128-.41.347-.677.693-.677h.958c2.822 0 5.138-1.58 5.626-4.6.382-2.406-.766-3.85-2.806-3.85h-2.096c-.347 0-.548-.259-.45-.612l1.698-5.765z"/>
              </svg>
              Pay Now
            </Button>
          </div>
        ) : (
          // Buttons for Oak Flooring and other generic products (now using isSpecialConfigLayout)
          <div className="w-full flex flex-col sm:flex-row gap-3 pt-6 justify-center">
             <Button onClick={() => router.back()} variant="outline" size="lg" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
            </Button>
            <Button onClick={()=> handleAddToCart()} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
             <Button
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => {
                handleAddToCart("Item added to cart. Proceeding to checkout...");
                router.push('/checkout');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.326 4.111c.404-.196.606.096.48.492l-2.05 6.993c-.11.375.068.66.45.66h2.727c2.56 0 4.259-1.215 4.527-3.708.215-1.96-.859-3.016-2.739-3.016h-2.063c-.233 0-.39-.114-.31-.325l.836-2.096c.08-.21.242-.35.46-.35h2.563c.382 0 .58-.275.47-.643L11.251.53C11.141.176 10.94 0 10.557 0H4.493c-.383 0-.581.276-.471.643l1.746 4.389c.11.276-.068.562-.45.562H3.165c-2.31 0-3.621 1.5-3.165 4.027.382 2.13 1.968 3.334 4.027 3.334h1.478c.55 0 .836.383.709.909l-1.715 5.503c-.128.41.053.709.442.709h4.027l.096-.3c.128-.41.347-.677.693-.677h.958c2.822 0 5.138-1.58 5.626-4.6.382-2.406-.766-3.85-2.806-3.85h-2.096c-.347 0-.548-.259-.45-.612l1.698-5.765z"/>
              </svg>
              Pay Now
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

