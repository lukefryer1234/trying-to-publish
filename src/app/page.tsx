
import { ProductCard } from '@/components/ProductCard';
import { mockProducts } from '@/lib/products';

export default function HomePage() {
  const products = mockProducts;

  return (
    <div>
      <section className="py-8 md:py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-8 md:mb-10 text-center">
          Our Products
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No products available at the moment. Please check back later.</p>
        )}
      </section>
    </div>
  );
}
