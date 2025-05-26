
"use client";

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
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

            <div className="flex flex-col gap-3 items-center sm:items-end">
              {/* Pay with PayPal Button (Top) */}
              <Button
                asChild
                size="lg"
                className="w-full max-w-sm sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Link href="/checkout">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.326 4.111c.404-.196.606.096.48.492l-2.05 6.993c-.11.375.068.66.45.66h2.727c2.56 0 4.259-1.215 4.527-3.708.215-1.96-.859-3.016-2.739-3.016h-2.063c-.233 0-.39-.114-.31-.325l.836-2.096c.08-.21.242-.35.46-.35h2.563c.382 0 .58-.275.47-.643L11.251.53C11.141.176 10.94 0 10.557 0H4.493c-.383 0-.581.276-.471.643l1.746 4.389c.11.276-.068.562-.45.562H3.165c-2.31 0-3.621 1.5-3.165 4.027.382 2.13 1.968 3.334 4.027 3.334h1.478c.55 0 .836.383.709.909l-1.715 5.503c-.128.41.053.709.442.709h4.027l.096-.3c.128-.41.347-.677.693-.677h.958c2.822 0 5.138-1.58 5.626-4.6.382-2.406-.766-3.85-2.806-3.85h-2.096c-.347 0-.548-.259-.45-.612l1.698-5.765z"/>
                  </svg>
                  Pay with PayPal
                </Link>
              </Button>

              {/* Continue Shopping Button (Bottom) */}
              <Button asChild variant="outline" size="lg" className="w-full max-w-sm sm:w-auto">
                <Link href="/">
                  <ArrowRight className="mr-2 h-5 w-5 transform rotate-180" /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

