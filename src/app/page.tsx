
import { ProductCard } from '@/components/ProductCard';
import { mockProducts } from '@/lib/products';

export default function HomePage() {
  const products = mockProducts;

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-lg shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Welcome to <span className="text-primary">SwiftCart</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover unique products and customize them to your liking. Effortless shopping, swift checkout.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-8 text-center">
          Our Products
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
