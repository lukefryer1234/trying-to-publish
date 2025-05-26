
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
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">Your Shopping Basket</h1>
      <p className="text-sm text-muted-foreground mb-10 text-center">All prices are before VAT.</p>
      
      {cartItems.length === 0 ? (
        <Card className="text-center py-12 shadow-lg rounded-lg border-border max-w-lg mx-auto">
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
        <div className="flex flex-col gap-8 items-center">
          <div className="w-full max-w-4xl">
            <div className="bg-card shadow-md rounded-lg overflow-hidden border border-border">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30 ">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold text-left">Product Details</th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">Quantity</th>
                    <th scope="col" className="px-6 py-4 text-right font-semibold">Unit Price</th>
                    <th scope="col" className="px-6 py-4 text-right font-semibold">Total</th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cartItems.map(item => (
                    <tr key={item.cartItemId} className="hover:bg-muted/20 transition-colors duration-150">
                      <td className="px-6 py-4 align-top">
                        <div className="font-semibold text-foreground mb-1">{item.product.name}</div>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {item.configuration.map(opt => (
                            <li key={opt.optionId}><strong>{opt.optionName}:</strong> {opt.label}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center justify-center space-x-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-foreground font-medium text-base">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right align-middle text-muted-foreground">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right align-middle font-semibold text-foreground">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label="Remove item"
                          className="text-destructive hover:text-destructive/80 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full max-w-md">
            <Card className="p-6 shadow-lg rounded-lg border border-border">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-xl font-semibold text-foreground">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-0">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})</span>
                  <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary font-medium">FREE</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Order Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="mt-6 p-0 flex flex-col gap-3">
                 <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/checkout">
                    Proceed to Checkout <CreditCard className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/">
                    <ArrowRight className="mr-2 h-5 w-5 transform rotate-180" /> Continue Shopping
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
