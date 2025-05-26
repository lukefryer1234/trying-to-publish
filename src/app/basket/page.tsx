
"use client";

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ShoppingCart, ArrowRight, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function BasketPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getItemCount, isClient } = useCart();

  if (!isClient) {
    // Or a loading skeleton
    return <div className="text-center py-10 text-muted-foreground">Loading basket...</div>;
  }

  const totalItems = getItemCount();
  const totalPrice = getCartTotal();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Your Shopping Basket</h1>
      
      {cartItems.length === 0 ? (
        <Card className="text-center py-12 shadow-lg rounded-lg">
          <CardHeader>
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl text-foreground">Your basket is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground mb-6">
              Looks like you haven't added any products yet. Explore our collection and find something you love!
            </CardDescription>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/">
                Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <Card key={item.cartItemId} className="flex flex-col md:flex-row gap-4 p-4 shadow-md rounded-lg overflow-hidden">
                <div className="relative w-full md:w-32 h-32 aspect-square rounded-md overflow-hidden shrink-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="cart item"
                  />
                </div>
                <div className="flex-grow space-y-2">
                  <h2 className="text-lg font-semibold text-foreground">{item.product.name}</h2>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {item.configuration.map(opt => (
                      <li key={opt.optionId}><strong>{opt.optionName}:</strong> {opt.label}</li>
                    ))}
                  </ul>
                  <p className="text-sm font-medium text-primary">${item.unitPrice.toFixed(2)} / unit</p>
                </div>
                <div className="flex flex-col md:items-end justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`quantity-${item.cartItemId}`} className="sr-only">Quantity</Label>
                    <Input
                      id={`quantity-${item.cartItemId}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.cartItemId, parseInt(e.target.value))}
                      min="1"
                      className="w-20 h-9 text-center bg-input/50"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.cartItemId)} aria-label="Remove item">
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                  <p className="text-md font-semibold text-foreground">
                    Total: ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-1 p-6 shadow-lg rounded-lg sticky top-24">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-2xl text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary">FREE</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="mt-6 p-0">
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/checkout">
                  Proceed to Checkout <CreditCard className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
