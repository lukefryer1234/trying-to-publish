
"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, LayoutGrid, UserCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

export function Header() {
  const { getCartTotal, isClient } = useCart();
  
  const cartTotal = isClient ? getCartTotal() : 0;
  const formattedCartTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Placeholder, ideally this would be configurable or based on locale
  }).format(cartTotal);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="md:hidden"> {/* For mobile sidebar toggle */}
            <Menu className="h-6 w-6 text-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" aria-label="Store Home">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </Button>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-3 sm:space-x-4">
          <Link href="/basket" passHref>
            <Button variant="ghost" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 sm:p-2">
              <ShoppingBag className="h-5 w-5" />
              {isClient && cartTotal > 0 && (
                <span className="ml-2 hidden sm:inline">{formattedCartTotal}</span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="My Account">
            <UserCircle className="h-6 w-6 text-muted-foreground hover:text-primary" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
