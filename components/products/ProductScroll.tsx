'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  product_images: Array<{ url: string }>;
}

interface ProductScrollProps {
  products: Product[];
}

export default function ProductScroll({ products }: ProductScrollProps) {
  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.png';
    return url.startsWith('/') ? url : `/products/${url}`;
  };

  const handleProductClick = async (product: Product) => {
    try {
      const response = await fetch('/api/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          category: product.category,
          imageUrl: getImageUrl(product.product_images[0]?.url)
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to track product view');
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg">
      <div className="flex w-max space-x-4 p-4">
        {products.map((product) => (
          <Link 
            href={`/products/${product.id}`} 
            key={product.id}
          >
            <Card className="w-[250px] hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square relative w-full mb-3">
                  <Image
                    src={getImageUrl(product.product_images[0]?.url)}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold whitespace-normal">{product.name}</h3>
                <p className="text-sm text-gray-500">${product.price}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
