
"use client";

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ShoppingCart, ArrowRight, CreditCard, ChevronUp, ChevronDown } from 'lucide-react';
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
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">Your Shopping Basket</h1>
      <p className="text-sm text-muted-foreground mb-8 text-center">All prices are before VAT.</p>
      
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
        <>
          <div className="overflow-x-auto bg-card shadow-md rounded-lg mb-8">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-card border-b">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Product Details</th>
                  <th scope="col" className="px-6 py-4 text-center font-semibold">Quantity</th>
                  <th scope="col" className="px-6 py-4 text-right font-semibold">Unit Price</th>
                  <th scope="col" className="px-6 py-4 text-right font-semibold">Total</th>
                  <th scope="col" className="px-6 py-4 text-center font-semibold">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.cartItemId} className="border-b last:border-b-0 hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{item.product.name}</div>
                      <ul className="text-xs text-muted-foreground space-y-0.5 mt-1">
                        {item.configuration.map(opt => (
                          <li key={opt.optionId}><strong>{opt.optionName}:</strong> {opt.label}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-foreground font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.cartItemId)}
                        aria-label="Remove item"
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="w-full p-6 shadow-lg rounded-lg">
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
                <span>Order Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="mt-6 p-0 flex flex-col sm:flex-row gap-3">
               <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <ArrowRight className="mr-2 h-5 w-5 transform rotate-180" /> Continue Shopping
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/checkout">
                  Proceed to Checkout <CreditCard className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}
