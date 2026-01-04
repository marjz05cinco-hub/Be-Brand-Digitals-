
export type ProductCategory = 'COSMETIC' | 'MERCHANDISE' | 'PRINT';
export type LabelFinish = 'matte' | 'glossy' | 'ultra-gloss' | 'metallic' | 'satin';
export type ContainerMaterial = 'glass' | 'plastic' | 'ceramic' | 'paper' | 'metal';

export interface ProductType {
  id: string;
  name: string;
  category: ProductCategory;
  sizes: string[];
}

export interface BackgroundStyle {
  id: string;
  name: string;
  description: string;
}

export interface MockupResult {
  id: string;
  url: string;
  timestamp: number;
  config: {
    product: string;
    size: string;
    background: string;
    finish: LabelFinish;
    material: ContainerMaterial;
    bodyColor: string;
    capColor: string;
  };
}

export interface GenerationSettings {
  category: ProductCategory;
  productTypeId: string;
  size: string;
  backgroundId: string;
  variations: number;
  finish: LabelFinish;
  material: ContainerMaterial;
  bodyColor: string;
  capColor: string;
}
