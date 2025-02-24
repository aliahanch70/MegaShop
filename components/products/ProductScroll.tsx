'use client';

import { useRef, useState, MouseEvent } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

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

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragDistance(0);
    setDragStartTime(Date.now());
    if (scrollContainerRef.current) {
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Adjust scrolling speed
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
      setDragDistance(Math.abs(x - startX)); // Track drag distance
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleClick = (e: MouseEvent, productId: string) => {
    // Only prevent navigation if there was significant dragging
    if (isDragging && dragDistance > 5) {
      e.preventDefault();
    } else {
      // If it was a clean click or tiny movement, allow navigation
      window.location.href = `/products/${productId}`;
    }
  };

  return (
    <div className="relative overflow-hidden px-4">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide select-none -mx-4"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="flex gap-4 px-4">
          {products.map((product) => (
            <div 
              key={product.id}
              className="flex-none w-[38vw] sm:w-[200px] md:w-[250px]"
              onClick={(e: any) => handleClick(e, product.id)}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-2 sm:p-4 flex flex-col">
                  <div className="aspect-square relative w-full mb-2 sm:mb-3">
                    <Image
                      src={getImageUrl(product.product_images[0]?.url)}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                      draggable={false}
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <h3 className="font-semibold line-clamp-2 text-sm sm:text-base">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">${product.price}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
