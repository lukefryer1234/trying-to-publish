"use client";

import React, { useState } from 'react';
import { mockProducts } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';

export default function CustomOrderPage() {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customRequest, setCustomRequest] = useState<string>('');

  const handleSubmit = () => {
    // Placeholder for submission logic
    console.log('Custom Order Submitted:', { selectedProductId, customRequest });
    alert('Custom order request submitted (see console for details). Actual submission to a backend is not yet implemented.');
  };

  const productsForDropdown = mockProducts.filter(p => p.id !== 'special-deals' && p.id !== 'all');


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8"> {/* Removed outer wrappers */}
        <Card className="w-full max-w-xl mx-auto shadow-lg rounded-lg bg-card border-2"> {/* Changed to shadow-lg, border-2 */}
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">
            Create Your Custom Order
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-2">
            Have a unique requirement? Let us know what you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <Label htmlFor="product-select" className="text-lg font-semibold text-foreground block mb-3 text-center">
              Which product is your custom order related to?
            </Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger id="product-select" className="w-full max-w-md mx-auto bg-input/50">
                <SelectValue placeholder="Select a product category" />
              </SelectTrigger>
              <SelectContent>
                {productsForDropdown.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other/Not Listed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label htmlFor="custom-request-details" className="text-lg font-semibold text-foreground block mb-3 text-center">
              Describe your custom requirements
            </Label>
            <Textarea
              id="custom-request-details"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="Please provide as much detail as possible, including dimensions, specific features, materials, or any other relevant information..."
              rows={8}
              className="w-full bg-input/50"
            />
          </div>
          
          <div className="text-center pt-4">
            <Button onClick={handleSubmit} size="lg" className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground">
              Submit Custom Order Request
            </Button>
          </div>
        </CardContent>
        </Card>
    </div>
  );
}
