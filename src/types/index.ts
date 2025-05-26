
export interface ProductOptionValue {
  label: string;
  value: string;
  priceModifier?: number;
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'select' | 'radio';
  values: ProductOptionValue[];
  defaultValue?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  options: ProductOption[];
}

export interface SelectedConfiguration {
  optionId: string;
  optionName: string;
  value: string;
  label: string;
  priceModifier: number;
}

export interface CartItem {
  cartItemId: string; // Unique ID for this item instance in the cart
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration[];
  unitPrice: number; // Price of one unit with selected configuration
}
