
"use client";

import type { CartItem, Product, SelectedConfiguration } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { toast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, configuration: SelectedConfiguration[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isClient: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateUnitPrice = (basePrice: number, configuration: SelectedConfiguration[]): number => {
  return configuration.reduce((acc, option) => acc + (option.priceModifier || 0), basePrice);
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('swiftcart-cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('swiftcart-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);

  const addToCart = (product: Product, quantity: number, configuration: SelectedConfiguration[]) => {
    const unitPrice = calculateUnitPrice(product.basePrice, configuration);
    const cartItemId = `${product.id}-${configuration.map(c => c.value).join('-')}-${Date.now()}`;
    
    // Check if an identical item (same product ID and configuration) already exists
    const existingItemIndex = cartItems.findIndex(item => 
      item.product.id === product.id &&
      JSON.stringify(item.configuration.map(c => ({optionId: c.optionId, value: c.value})).sort((a,b) => a.optionId.localeCompare(b.optionId))) === 
      JSON.stringify(configuration.map(c => ({optionId: c.optionId, value: c.value})).sort((a,b) => a.optionId.localeCompare(b.optionId)))
    );

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
      toast({ title: "Cart Updated", description: `${product.name} quantity increased.` });
    } else {
      setCartItems(prevItems => [
        ...prevItems,
        { cartItemId, product, quantity, configuration, unitPrice },
      ]);
      toast({ title: "Added to Cart", description: `${product.name} has been added to your cart.` });
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
    toast({ title: "Item Removed", description: "Item has been removed from your cart." });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        )
      );
      toast({ title: "Quantity Updated", description: "Item quantity has been updated." });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast({ title: "Cart Cleared", description: "Your cart has been emptied." });
  };

  const getCartTotal = useMemo(() => () => {
    return cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  const getItemCount = useMemo(() => () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);
  
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    isClient,
  }), [cartItems, isClient, getCartTotal, getItemCount]);


  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
