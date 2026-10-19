export interface Shade {
  id: string;
  name: string;
  hex: string;
  finish: 'Velvet Matte' | 'Satin Silk' | 'Glass Gloss' | 'Luminous Shimmer';
  code: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'lips' | 'face' | 'eyes' | 'bestsellers' | 'new';
  price: number; // in INR
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  formulaHighlights: string[];
  shades: Shade[];
  defaultShadeIndex: number;
  image: string;
  modelType: 'lipstick' | 'serum' | 'compact' | 'gloss' | 'palette';
  volume?: string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem {
  id: string; // product.id + '-' + shade.id
  product: Product;
  selectedShade: Shade;
  quantity: number;
}

export type CategoryFilter = 'all' | 'lips' | 'face' | 'eyes' | 'bestsellers' | 'new';
