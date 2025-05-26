
"use client";

import Link from 'next/link';
import { ShoppingBag, HomeIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { getItemCount, isClient } = useCart();
  const itemCount = isClient ? getItemCount() : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">SwiftCart</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <HomeIcon className="h-5 w-5 inline-block mr-1" />
            Home
          </Link>
          <Link href="/basket" className="relative flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <ShoppingBag className="h-5 w-5" />
            <span className="ml-1">Basket</span>
            {isClient && itemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {itemCount}
              </Badge>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
