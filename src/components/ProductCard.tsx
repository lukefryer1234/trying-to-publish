
import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dataAiHint = product.name.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <Link href={`/products/${product.id}/configure`} className="block group">
      <Card className="relative flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg h-72 md:h-80 cursor-pointer">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
          data-ai-hint={dataAiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative mt-auto p-4 md:p-6 z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
            {product.name}
          </h2>
        </div>
      </Card>
    </Link>
  );
}
