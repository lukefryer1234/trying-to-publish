
import { mockProducts, mockFeaturedDeals } from '@/lib/products';
import PreviewClient from './preview-client';

// This function is needed for static exports
export function generateStaticParams() {
  // Generate paths for all product IDs
  const allProducts = [...mockProducts, ...mockFeaturedDeals];
  return allProducts.map(product => ({
    productId: product.id,
  }));
}

export default function ProductPreviewPage() {
  return <PreviewClient />;
}
