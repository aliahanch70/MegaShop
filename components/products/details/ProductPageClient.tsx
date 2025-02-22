'use client';

import { useEffect, useState } from 'react';
import { getProduct, type Product } from '@/lib/api/products';
import ProductDetails from './ProductDetails';
import ProductNotFound from './ProductNotFound';
import ProductLoading from './ProductLoading';
import SpecificationsPopup from './SpecificationsPopup';

interface ProductPageClientProps {
  id: string;
  initialData: Product | null;
}

export default function ProductPageClient({ id, initialData }: ProductPageClientProps) {
  const [product, setProduct] = useState<Product | null>(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      const loadProduct = async () => {
        const data = await getProduct(id);
        setProduct(data);
        setLoading(false);
      };

      loadProduct(); // فراخوانی تابع
    }
  }, [initialData, id]);

  if (loading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails id={id} initialData={product} />

      
      </div>
  );
}