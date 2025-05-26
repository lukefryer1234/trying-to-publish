
"use client";

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, ArrowRight, CreditCard, ChevronUp, ChevronDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function BasketPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getItemCount, isClient } = useCart();

  if (!isClient) {
    return <div className="text-center py-10 text-muted-foreground">Loading basket...</div>;
  }

  const totalItems = getItemCount();
  const totalPrice = getCartTotal();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">Your Shopping Basket</h1>
      <p className="text-sm text-muted-foreground mb-10 text-center">All prices are before VAT.</p>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg shadow-sm bg-card max-w-lg mx-auto">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl text-foreground font-semibold mb-2">Your basket is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            Looks like you haven't added any products yet.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">
              Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          {/* Order Summary Section (Left on LG, First on Mobile) */}
          <div className="w-full lg:w-1/3 lg:order-1">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})</span>
                <span className="text-foreground">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary font-medium">FREE</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Order Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3">
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
            </div>
          </div>

          {/* Items Table Section (Right on LG, Second on Mobile) */}
          <div className="w-full lg:w-2/3 lg:order-2">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-4 font-semibold text-left text-muted-foreground uppercase text-xs tracking-wider">Product Details</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-center font-semibold text-muted-foreground uppercase text-xs tracking-wider">Quantity</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-right font-semibold text-muted-foreground uppercase text-xs tracking-wider">Unit Price</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-right font-semibold text-muted-foreground uppercase text-xs tracking-wider">Total</th>
                  <th scope="col" className="px-4 sm:px-6 py-4 text-center font-semibold text-muted-foreground uppercase text-xs tracking-wider">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cartItems.map(item => (
                  <tr key={item.cartItemId} className="hover:bg-muted/10 transition-colors duration-150">
                    <td className="px-4 sm:px-6 py-4 align-top">
                      <div className="font-semibold text-foreground mb-1">{item.product.name}</div>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {item.configuration.map(opt => (
                          <li key={opt.optionId}><strong>{opt.optionName}:</strong> {opt.label}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-middle">
                      <div className="flex items-center justify-center space-x-1">
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
                        <span className="w-8 text-center text-foreground font-medium">{item.quantity}</span>
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
                    <td className="px-4 sm:px-6 py-4 text-right align-middle text-muted-foreground">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-4 text-right align-middle font-semibold text-foreground">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center align-middle">
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
      )}
    </div>
  );
}

