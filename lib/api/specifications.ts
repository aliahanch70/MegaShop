import { createClient } from '@/lib/supabase/client';

export async function getUniqueSpecifications() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('specifications');

    if (error) {
      console.error('Error fetching specifications:', error);
      return { labels: [], values: [] };
    }

    const uniqueLabels = new Set<string>();
    const uniqueValues = new Set<string>();

    // Add null check and ensure specifications is an array
    data?.forEach(product => {
      if (Array.isArray(product.specifications)) {
        product.specifications.forEach((spec: { label: string, value: string }) => {
          if (spec?.label) uniqueLabels.add(spec.label);
          if (spec?.value) uniqueValues.add(spec.value);
        });
      }
    });

    return {
      labels: Array.from(uniqueLabels) || [],
      values: Array.from(uniqueValues) || []
    };
  } catch (error) {
    console.error('Error in getUniqueSpecifications:', error);
    return { labels: [], values: [] };
  }
}
