
"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, Home } from 'lucide-react'; // Changed ShoppingBag to ShoppingCart
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
import { mockProducts } from '@/lib/products'; 

export function Header() {
  const { getItemCount, getCartTotal, isClient } = useCart(); 
  
  const itemCount = isClient ? getItemCount() : 0;
  const cartTotal = isClient ? getCartTotal() : 0;
  
  const formattedCartTotal = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(cartTotal);

  const productsForMenu = mockProducts.filter(p => p.id !== 'special-deals');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-secondary">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-7 w-7 text-foreground" />
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
              <Home className="h-7 w-7 text-primary" />
            </Button>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-3"> {/* Added space-x-3 for spacing */}
          {isClient && (
            <span className="text-sm font-medium text-muted-foreground">
              {formattedCartTotal}
            </span>
          )}
          <Link href="/basket" passHref>
            <Button variant="ghost" className="relative flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 sm:p-2" aria-label="Shopping basket">
              <ShoppingCart className="h-6 w-6" /> {/* Changed to ShoppingCart */}
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
