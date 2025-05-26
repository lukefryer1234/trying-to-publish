
export interface ProductOptionValue {
  label: string;
  value: string;
  priceModifier?: number;
  imageUrl?: string; // For radio options with images
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'select' | 'radio' | 'slider' | 'checkbox';
  values?: ProductOptionValue[]; // Optional for checkbox, slider might define min/max/step here or directly
  defaultValue?: string | number | boolean; // Can be string for select/radio, number for slider, boolean for checkbox
  
  // For slider
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // e.g. "Bays", "meters"
  
  // For checkbox
  checkboxLabel?: string; // e.g. "Yes, include this feature"
  priceModifier?: number; // Price modifier for when the checkbox is checked (primarily for simpler products)
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  options: ProductOption[];
  // Optional: Specific pricing parameters for complex products like garages
  garagePricingParams?: GaragePricingParams;
}

export interface GaragePricingParams {
  bayPrice: number; // Price per bay
  catSlidePricePerBay: number;
  beamSizePrices: { [key: string]: number }; // e.g. { "6x6": 0, "7x7": 200, "8x8": 450 }
  trussPrices: { [key: string]: number }; // e.g. { "curved": 0, "straight": 50 }
  baySizeMultipliers: { [key: string]: number }; // e.g. { "standard": 1.0, "large": 1.1 }
}

export interface SelectedConfiguration {
  optionId: string;
  optionName: string;
  value: string | number | boolean; // Flexible value type
  label: string; // Display label for the selected value (e.g., "Single Bay", "Curved", "3 Bays", "Yes")
  priceModifier: number; // Original price modifier from ProductOptionValue or ProductOption (for checkbox)
                           // Note: For complex pricing like garages, this might not be directly summed.
}

export interface CartItem {
  cartItemId: string; // Unique ID for this item instance in the cart
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration[];
  unitPrice: number; // Price of one unit with selected configuration
}
