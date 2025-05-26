
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ShoppingCart, Lock } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react"; 
import Script from "next/script";

declare global {
  interface Window {
    paypal?: any; // PayPal SDK attaches itself to the window object
  }
}

export default function CheckoutPage() {
  const { getCartTotal, getItemCount, isClient, cartItems } = useCart(); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isPayPalSdkReady, setIsPayPalSdkReady] = useState(false);

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

  useEffect(() => {
    if (isPayPalSdkReady && window.paypal && totalPrice > 0 && itemCount > 0 && isClient) {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      // Clear previous buttons if any, to prevent duplicates on re-render
      if (paypalButtonContainer) {
        paypalButtonContainer.innerHTML = ''; 
      }

      if (paypalButtonContainer && window.paypal.Buttons) { 
        try {
          window.paypal.Buttons({
            createOrder: async (data: any, actions: any) => {
              console.log("Attempting to create order with amount:", totalPrice.toFixed(2));
              alert("SIMULATING: Contacting server to create PayPal order...");
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: totalPrice.toFixed(2), 
                    currency_code: 'GBP'
                  },
                  description: `Your order of ${itemCount} item(s) from SwiftCart.`,
                }]
              });
            },
            onApprove: async (data: any, actions: any) => {
              console.log("Order approved by user:", data);
              alert(`SIMULATING: Contacting server to capture PayPal order ID: ${data.orderID}...`);
              return actions.order.capture().then((details: any) => {
                alert(`Transaction completed by ${details.payer.name.given_name}! Order ID: ${data.orderID}`);
                // TODO: Redirect to an order confirmation page, clear cart, etc.
              }).catch((err: any) => {
                console.error("Payment capture failed:", err);
                alert("Payment capture failed. Please try again.");
              });
            },
            onError: (err: any) => {
              console.error("PayPal Button Error:", err);
              alert("An error occurred with the PayPal payment. Please try again or contact support.");
            }
          }).render('#paypal-button-container').catch((err: any) => {
            console.error("Failed to render PayPal buttons:", err);
            if (paypalButtonContainer) {
                paypalButtonContainer.innerHTML = '<p class="text-destructive-foreground text-sm">Error loading PayPal buttons. Please try refreshing.</p>';
            }
          });
        } catch (error) {
            console.error("Error initializing PayPal Buttons:", error);
            if (paypalButtonContainer) {
                paypalButtonContainer.innerHTML = '<p class="text-destructive-foreground text-sm">Could not initialize PayPal. Please try again later.</p>';
            }
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPayPalSdkReady, totalPrice, itemCount, cartItems, isClient]);


  if (!isClient) {
    return <div className="text-center py-10 text-muted-foreground">Loading checkout...</div>;
  }

  if (itemCount === 0 && isClient) {
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
    <>
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AVrdZkjO4CpPX8mNf7tEDUbhBekgtsR6SR-h8X5wne5uCZc2U5SCELJcrax-q_7Ld1rdi6261UfIA5z9'}&currency=GBP&components=buttons&enable-funding=paylater,card`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("PayPal SDK loaded.");
          setIsPayPalSdkReady(true);
        }}
        onError={(e) => {
          console.error("PayPal SDK failed to load", e);
          const paypalButtonContainer = document.getElementById('paypal-button-container');
          if (paypalButtonContainer) {
            paypalButtonContainer.innerHTML = '<p class="text-destructive text-sm">Payment options failed to load. Please check your connection and try again.</p>';
          }
        }}
      />
      <div className="container mx-auto py-12 flex flex-col items-center">
        <Card className="w-full max-w-lg shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <CreditCard className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold text-foreground">Checkout</CardTitle>
            <CardDescription className="text-muted-foreground pt-1">
              You are about to pay <strong className="text-foreground font-semibold">{formatCurrency(totalPrice)}</strong> for {itemCount} item(s).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 border border-dashed rounded-md bg-accent/10 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Ready to Pay?</h3>
              <p className="text-muted-foreground">
                Choose your preferred payment method below. You can use your PayPal account,
                Pay in 3 (if eligible), or pay with a credit/debit card.
              </p>
              {isClient && totalPrice > 0 ? (
                <div id="paypal-button-container" className="min-h-[100px] flex justify-center items-center">
                   {!isPayPalSdkReady && <p className="text-muted-foreground">Loading payment options...</p>}
                </div>
              ) : (
                <div className="min-h-[100px] flex justify-center items-center text-muted-foreground">
                 <p>Preparing payment options...</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" /> Secure Checkout via PayPal
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
