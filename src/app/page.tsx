
import { ProductCard } from '@/components/ProductCard';
import { FeaturedDealCard } from '@/components/FeaturedDealCard';
import { mockProducts, mockFeaturedDeals } from '@/lib/products';

export default function HomePage() {
  const products = mockProducts;
  const featuredDeals = mockFeaturedDeals;

  return (
    <div className="space-y-12 md:space-y-16 py-8">
      {products.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center text-muted-foreground">No products available at the moment. Please check back later.</p>
      )}

      {featuredDeals.length > 0 && (
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-8 text-center">
            Featured Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {featuredDeals.map((deal) => (
              <FeaturedDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
