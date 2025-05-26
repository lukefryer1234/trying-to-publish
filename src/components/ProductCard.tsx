
import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dataAiHint = product.name.toLowerCase().split(' ').slice(0, 2).join(' ');

  // Placeholder for brownish/gold background similar to the image
  // You might want to define this as a custom Tailwind color or use a more specific utility
  const cardBackgroundColor = product.name === "Special Deals" ? "bg-slate-700" : "bg-yellow-700/20"; // Example color

  return (
    <Link href={`/products/${product.id}/configure`} className="block group">
      <Card className={`relative flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg h-48 md:h-56 cursor-pointer ${cardBackgroundColor}`}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="opacity-60 group-hover:opacity-80 transition-opacity duration-300 ease-in-out group-hover:scale-105"
          data-ai-hint={dataAiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative mt-auto p-4 z-10">
          <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
            {product.name}
          </h2>
        </div>
      </Card>
    </Link>
  );
}
