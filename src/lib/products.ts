import type { Product } from '@/types';

export const mockProducts: Product[] = [
  {
    id: 'custom-tshirt',
    name: 'Custom T-Shirt',
    description: 'Design your own unique t-shirt with custom text and graphics. High-quality cotton for maximum comfort.',
    imageUrl: 'https://placehold.co/600x400.png',
    basePrice: 20,
    options: [
      {
        id: 'size',
        name: 'Size',
        type: 'select',
        defaultValue: 'M',
        values: [
          { label: 'Small', value: 'S' },
          { label: 'Medium', value: 'M' },
          { label: 'Large', value: 'L', priceModifier: 2 },
          { label: 'X-Large', value: 'XL', priceModifier: 3 },
        ],
      },
      {
        id: 'color',
        name: 'Color',
        type: 'radio',
        defaultValue: 'white',
        values: [
          { label: 'White', value: 'white' },
          { label: 'Black', value: 'black' },
          { label: 'Rose', value: 'rose', priceModifier: 1 },
        ],
      },
    ],
  },
  {
    id: 'personalized-mug',
    name: 'Personalized Mug',
    description: 'Start your day right with a coffee mug personalized with your favorite photo or quote.',
    imageUrl: 'https://placehold.co/600x400.png',
    basePrice: 15,
    options: [
      {
        id: 'mug_type',
        name: 'Mug Type',
        type: 'select',
        defaultValue: 'ceramic_white',
        values: [
          { label: 'Ceramic White (11oz)', value: 'ceramic_white' },
          { label: 'Ceramic Black (11oz)', value: 'ceramic_black', priceModifier: 1 },
          { label: 'Magic Mug (Color Changing)', value: 'magic_mug', priceModifier: 5 },
        ],
      },
    ],
  },
  {
    id: 'engraved-keychain',
    name: 'Engraved Keychain',
    description: 'Carry your keys in style with a custom engraved keychain. Perfect as a gift.',
    imageUrl: 'https://placehold.co/600x400.png',
    basePrice: 10,
    options: [
      {
        id: 'material',
        name: 'Material',
        type: 'radio',
        defaultValue: 'stainless_steel',
        values: [
          { label: 'Stainless Steel', value: 'stainless_steel' },
          { label: 'Leather', value: 'leather', priceModifier: 2 },
          { label: 'Wood', value: 'wood', priceModifier: 1 },
        ],
      },
    ],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};
