
"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, Home } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockProducts } from '@/lib/products'; // To get product list for menu

export function Header() {
  const { getCartTotal, getItemCount, isClient } = useCart();
  
  const cartTotal = isClient ? getCartTotal() : 0;
  const itemCount = isClient ? getItemCount() : 0;

  const formattedCartTotal = new Intl.NumberFormat('en-GB', { // Changed to en-GB
    style: 'currency',
    currency: 'GBP', // Changed to GBP
  }).format(cartTotal);

  const productsForMenu = mockProducts.filter(p => p.id !== 'special-deals');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Products</DropdownMenuLabel>
              {productsForMenu.map(product => (
                <Link key={product.id} href={`/products/${product.id}/configure`} passHref>
                  <DropdownMenuItem>{product.name}</DropdownMenuItem>
                </Link>
              ))}
              <Link href="/products/special-deals/configure" passHref>
                <DropdownMenuItem>Special Deals</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/about" passHref>
                <DropdownMenuItem>About Us</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" aria-label="Store Home">
              <Home className="h-6 w-6 text-primary" />
            </Button>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-3 sm:space-x-4">
          {isClient && (
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              {formattedCartTotal}
            </span>
          )}
          <Link href="/basket" passHref>
            <Button variant="ghost" className="relative flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 sm:p-2" aria-label="Shopping basket">
              <ShoppingBag className="h-5 w-5" />
              {isClient && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
