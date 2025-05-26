
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

  const totalPrice = getCartTotal();
  const totalItems = getItemCount();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">Your Shopping Basket</h1>
      <h2 className="text-xl text-muted-foreground mb-10 text-center">Items in Your Basket</h2>
      
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
        <div className="w-full flex flex-col items-center">
          <div className="w-full lg:w-5/6 xl:w-4/5 overflow-x-auto mb-8">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="border-b border-border">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 font-medium text-left text-muted-foreground uppercase text-xs tracking-wider">Product</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 font-medium text-left text-muted-foreground uppercase text-xs tracking-wider">Description</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-right font-medium text-muted-foreground uppercase text-xs tracking-wider">Price</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-center font-medium text-muted-foreground uppercase text-xs tracking-wider">Quantity</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-center font-medium text-muted-foreground uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cartItems.map(item => (
                  <tr key={item.cartItemId} className="hover:bg-muted/5 transition-colors duration-150">
                    <td className="px-4 sm:px-6 py-4 align-top text-foreground font-medium">
                      {item.product.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-top">
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {item.configuration.map(opt => (
                          <li key={opt.optionId}><strong>{opt.optionName}:</strong> {opt.label}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right align-middle text-muted-foreground">{formatCurrency(item.unitPrice)}</td>
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
                        <span className="w-8 text-center text-foreground font-medium tabular-nums">{item.quantity}</span>
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

          <div className="w-full lg:w-5/6 xl:w-4/5 mt-4 px-4 sm:px-0">
            <div className="text-left mb-6">
              <p className="text-xl font-bold text-foreground">Total: {formatCurrency(totalPrice)}</p>
              <p className="text-xs text-muted-foreground mt-1">(Excl. VAT & Delivery)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <ArrowRight className="mr-2 h-5 w-5 transform rotate-180" /> Continue Shopping
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/checkout">
                  Proceed to Checkout <CreditCard className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
