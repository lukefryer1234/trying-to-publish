
import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dataAiHint = product.name.toLowerCase().split(' ').slice(0, 2).join(' ');
  
  // Differentiate Special Deals card background and content
  const isSpecialDeals = product.name === "Special Deals";
  const cardBackgroundColor = isSpecialDeals ? "bg-slate-700" : "bg-yellow-700/20";

  return (
    <Link href={`/products/${product.id}/configure`} className="block group">
      <Card className={`relative flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg h-96 cursor-pointer ${cardBackgroundColor}`}>
        {isSpecialDeals ? (
          <div className="flex-grow flex items-center justify-center p-4">
            <span className="text-2xl md:text-3xl font-bold text-white text-center">
              Coming Soon
            </span>
          </div>
        ) : (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint={dataAiHint}
            priority={product.name === "Garages"} /* Add priority for the LCP image */
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        <div className="relative p-4 z-10 mt-auto">
          <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
            {product.name}
          </h2>
        </div>
      </Card>
    </Link>
  );
}
