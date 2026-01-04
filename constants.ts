
import { ProductType, BackgroundStyle, LabelFinish, ContainerMaterial } from './types';

export const PRODUCT_TYPES: ProductType[] = [
  // Cosmetic
  { id: 'jar', name: 'Cosmetic Jar', category: 'COSMETIC', sizes: ['30g / 1 oz', '50g / 1.7 oz', '100g / 3.4 oz'] },
  { id: 'dropper', name: 'Dropper Bottle', category: 'COSMETIC', sizes: ['15 ml', '30 ml', '50 ml'] },
  { id: 'pump', name: 'Pump Bottle', category: 'COSMETIC', sizes: ['100 ml', '200 ml', '250 ml'] },
  { id: 'spray', name: 'Spray Bottle', category: 'COSMETIC', sizes: ['50 ml', '100 ml', '150 ml'] },
  { id: 'tube', name: 'Skincare Tube', category: 'COSMETIC', sizes: ['50 ml', '100 ml', '150 ml'] },
  { id: 'supplement', name: 'Supplement Bottle', category: 'COSMETIC', sizes: ['60 capsules', '90 capsules', '120 capsules'] },
  { id: 'vial', name: 'Medical Vial', category: 'COSMETIC', sizes: ['5 ml', '10 ml', '20 ml'] },
  { id: 'glass_luxury', name: 'Luxury Glass Bottle', category: 'COSMETIC', sizes: ['30 ml', '50 ml', '100 ml'] },
  
  // Merchandise
  { id: 'tshirt', name: 'T-Shirt', category: 'MERCHANDISE', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'mug', name: 'Mug', category: 'MERCHANDISE', sizes: ['11 oz', '15 oz'] },
  { id: 'tote', name: 'Tote Bag', category: 'MERCHANDISE', sizes: ['Standard Canvas'] },
  
  // Print
  { id: 'book_paperback', name: 'Paperback Book', category: 'PRINT', sizes: ['6 × 9 inches', '8.5 × 11 inches'] },
  { id: 'book_hardcover', name: 'Hardcover Book', category: 'PRINT', sizes: ['6 × 9 inches', '8.5 × 11 inches'] },
  { id: 'journal', name: 'Journal / Workbook', category: 'PRINT', sizes: ['A5', 'A4'] },
];

export const BACKGROUND_STYLES: BackgroundStyle[] = [
  { id: 'studio_white', name: 'Studio White', description: 'Clean, high-key commercial studio look.' },
  { id: 'luxury_spa', name: 'Luxury Spa', description: 'Neutral tones, marble, beige, sophisticated atmosphere.' },
  { id: 'lifestyle', name: 'Minimal Lifestyle', description: 'Vanity, shelf, or desk setting with soft lighting.' },
  { id: 'solid_color', name: 'Solid Color', description: 'Minimalist solid background for focused branding.' },
  { id: 'tabletop', name: 'Soft Shadow Tabletop', description: 'Natural light casting soft shadows on a premium surface.' },
];

export const FINISHES: { id: LabelFinish; name: string }[] = [
  { id: 'matte', name: 'Matte' },
  { id: 'glossy', name: 'Glossy' },
  { id: 'ultra-gloss', name: 'High Gloss' },
  { id: 'metallic', name: 'Foil / Metallic' },
  { id: 'satin', name: 'Soft Satin' },
];

export const MATERIALS: { id: ContainerMaterial; name: string }[] = [
  { id: 'glass', name: 'Amber/Clear Glass' },
  { id: 'plastic', name: 'Frosted Plastic' },
  { id: 'ceramic', name: 'Smooth Ceramic' },
  { id: 'paper', name: 'Premium Paper' },
  { id: 'metal', name: 'Brushed Metal' },
];
