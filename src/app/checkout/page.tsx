
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
    if (isPayPalSdkReady && window.paypal && totalPrice > 0 && itemCount > 0) {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      if (paypalButtonContainer && paypalButtonContainer.children.length === 0) { // Render only if not already rendered
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            console.log("Creating order with amount:", totalPrice.toFixed(2));
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalPrice.toFixed(2), // PayPal expects a string for the value
                  currency_code: 'GBP'
                },
                description: `Your order of ${itemCount} item(s) from SwiftCart.`,
                // You can add a more detailed item_list here if needed:
                // items: cartItems.map(item => ({
                //   name: item.product.name,
                //   quantity: item.quantity.toString(),
                //   unit_amount: {
                //     value: item.unitPrice.toFixed(2),
                //     currency_code: 'GBP'
                //   },
                //   description: item.configuration.map(c => `${c.optionName}: ${c.label}`).join(', ')
                // }))
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            console.log("Order approved:", data);
            // This function captures the funds from the transaction.
            // In a real scenario, you would typically call your server to capture the payment.
            return actions.order.capture().then((details: any) => {
              // This function shows a transaction success message to your buyer.
              alert(`Transaction completed by ${details.payer.name.given_name}! Order ID: ${data.orderID}`);
              // TODO: Here you would typically redirect to an order confirmation page
              // and potentially clear the cart.
              // Example: router.push('/order-confirmation?orderId=' + data.orderID);
            }).catch((err: any) => {
              console.error("Payment capture failed:", err);
              alert("Payment failed. Please try again.");
            });
          },
          onError: (err: any) => {
            console.error("PayPal Button Error:", err);
            alert("An error occurred with the PayPal payment. Please try again.");
          }
        }).render('#paypal-button-container').catch((err: any) => {
          console.error("Failed to render PayPal buttons:", err);
        });
      }
    }
  }, [isPayPalSdkReady, totalPrice, itemCount, cartItems, isClient]); // Added cartItems and isClient to dependencies


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
        src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID_HERE&currency=GBP&components=buttons&enable-funding=paylater,card"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("PayPal SDK loaded.");
          setIsPayPalSdkReady(true);
        }}
        onError={(e) => {
          console.error("PayPal SDK failed to load", e);
        }}
      />
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
            <div className="text-center p-6 border border-dashed rounded-md bg-accent/10 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Ready to Pay?</h3>
              <p className="text-muted-foreground">
                Choose your preferred payment method below. You can use your PayPal account,
                Pay in 3 (if eligible), or pay with a credit/debit card.
              </p>
              {/* Container for PayPal buttons */}
              {isPayPalSdkReady && totalPrice > 0 ? (
                <div id="paypal-button-container" className="min-h-[100px] flex justify-center items-center">
                  {/* PayPal buttons will render here */}
                </div>
              ) : (
                <div className="min-h-[100px] flex justify-center items-center text-muted-foreground">
                  Loading payment options...
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
