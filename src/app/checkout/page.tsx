
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ShoppingCart, Lock } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react"; 

export default function CheckoutPage() {
  const { getCartTotal, getItemCount, isClient } = useCart(); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  useEffect(() => {
    if (isClient) {
      setTotalPrice(getCartTotal());
      setItemCount(getItemCount());
    }
  }, [isClient, getCartTotal, getItemCount]);


  if (!isClient) {
    return <div className="text-center py-10 text-muted-foreground">Loading checkout...</div>;
  }


  if (itemCount === 0) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center text-center">
         <ShoppingCart className="h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          You need to add items to your cart before proceeding to checkout.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 flex flex-col items-center">
      <Card className="w-full max-w-lg shadow-xl rounded-lg">
        <CardHeader className="text-center">
          <CreditCard className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-foreground">Checkout</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            You are about to pay <strong className="text-primary">{formatCurrency(totalPrice)}</strong> for {itemCount} item(s).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 border border-dashed rounded-md bg-accent/10">
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Pay?</h3>
            <p className="text-muted-foreground mb-4">
              We use PayPal for secure and easy payments. You can use your PayPal account,
              Pay in 3, or pay with a credit/debit card through PayPal.
            </p>
            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => alert("Redirecting to PayPal... (This is a placeholder for actual PayPal integration)")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.326 4.111c.404-.196.606.096.48.492l-2.05 6.993c-.11.375.068.66.45.66h2.727c2.56 0 4.259-1.215 4.527-3.708.215-1.96-.859-3.016-2.739-3.016h-2.063c-.233 0-.39-.114-.31-.325l.836-2.096c.08-.21.242-.35.46-.35h2.563c.382 0 .58-.275.47-.643L11.251.53C11.141.176 10.94 0 10.557 0H4.493c-.383 0-.581.276-.471.643l1.746 4.389c.11.276-.068.562-.45.562H3.165c-2.31 0-3.621 1.5-3.165 4.027.382 2.13 1.968 3.334 4.027 3.334h1.478c.55 0 .836.383.709.909l-1.715 5.503c-.128.41.053.709.442.709h4.027l.096-.3c.128-.41.347-.677.693-.677h.958c2.822 0 5.138-1.58 5.626-4.6.382-2.406-.766-3.85-2.806-3.85h-2.096c-.347 0-.548-.259-.45-.612l1.698-5.765z"/>
              </svg>
              Pay with PayPal
            </Button>
          </div>
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Lock className="h-4 w-4 mr-2" /> Secure Checkout via PayPal
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
