import fs from 'fs';
import path from 'path';

interface ProductView {
  productId: string;
  productName: string;
  price: number;
  category: string;
  viewedAt: string;
  imageUrl?: string;
}

export const trackProductView = async (product: ProductView) => {
  const filePath = path.join(process.cwd(), 'view.json');
  
  try {
    let views: ProductView[] = [];
    
    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]', 'utf-8');
    }
    
    // Read existing views
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    views = JSON.parse(fileContent || '[]');
    
    // Add new view
    views.push({
      ...product,
      viewedAt: new Date().toISOString()
    });
    
    // Keep only last 100 views
    if (views.length > 100) {
      views = views.slice(-100);
    }
    
    // Write back to file with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(views, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error tracking product view:', error);
    return false;
  }
};
