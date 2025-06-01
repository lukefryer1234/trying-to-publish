
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
      <div className="container mx-auto w-full flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
           <Link href="/" passHref>
            <Button variant="ghost" size="icon" aria-label="Store Home">
              <Home className="h-7 w-7 text-foreground" /> {/* Changed text-primary to text-foreground */}
            </Button>
          </Link>
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
              <Link href="/gallery" passHref>
                <DropdownMenuItem>Gallery</DropdownMenuItem>
              </Link>
              <Link href="/about" passHref>
                <DropdownMenuItem>About Us</DropdownMenuItem>
              </Link>
              <Link href="/custom-order" passHref>
                <DropdownMenuItem>Custom Order</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Product links in the header (main products only) */}
        <nav className="hidden md:flex flex-grow items-center justify-evenly space-x-2">
          {productsForMenu.map(product => (
            <Link key={product.id} href={`/products/${product.id}/configure`} passHref>
              <Button variant="link" className="text-base font-semibold text-foreground hover:text-primary px-2"> {/* Changed text-muted-foreground to text-foreground */}
                {product.name}
              </Button>
            </Link>
          ))}
          <Link href="/products/special-deals/configure" passHref>
            <Button variant="link" className="text-base font-semibold text-foreground hover:text-primary px-2"> {/* Changed text-muted-foreground to text-foreground */}
              Special Deals
            </Button>
          </Link>
        </nav>
        
        <nav className="flex items-center space-x-3 ml-auto"> {/* Added ml-auto back */}
          {isClient && (
            <span className="text-sm font-medium text-foreground"> {/* Changed text-muted-foreground to text-foreground */}
              {formattedCartTotal}
            </span>
          )}
          <Link href="/basket" passHref>
            <Button variant="ghost" className="relative flex items-center text-sm font-medium text-foreground transition-colors hover:text-primary p-2 sm:p-2" aria-label="Shopping basket"> {/* Changed text-muted-foreground to text-foreground */}
              <ShoppingCart className="h-6 w-6 text-foreground" /> {/* Ensured icon also uses text-foreground */}
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
