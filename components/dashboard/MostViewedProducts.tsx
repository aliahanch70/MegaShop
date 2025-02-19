import { useState, useEffect } from 'react';
import viewData from '../../view.json';
import Link from 'next/link';

const MostViewedProducts = () => {
  const [topProducts, setTopProducts] = useState<Array<any>>([]);

  useEffect(() => {
    // Group records by productId and count views
    const viewCounts = viewData.reduce((acc, cur) => {
      if (acc[cur.productId]) {
        acc[cur.productId].views += 1;
      } else {
        acc[cur.productId] = { ...cur, views: 1 };
      }
      return acc;
    }, {} as Record<string, any>);

    const sortedProducts = Object.values(viewCounts)
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 6);

    setTopProducts(sortedProducts);
  }, []);

  return (
    <div className="bg-black p-4 rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Most Viewed Products</h2>
      <div className=" flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {topProducts.map((product: any) => (
          <Link 
            href={`/products/${product.productId}`}
            key={product.productId}
            className=" flex-shrink-0 w-36 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
          >
            <div className="relative">
              <img 
                src={product.imageUrl} 
                alt={product.productName} 
                className="w-full h-40 object-cover rounded-lg border border-gray-700"
              />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {product.views}
              </span>
            </div>
            <div className="mt-3">
              <p className="font-semibold text-white truncate">{product.productName}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-gray-400 text-sm">${product.price}</p>
                <span className="text-gray-500 text-xs">{product.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MostViewedProducts;
