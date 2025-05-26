
import type { Product } from '@/types';

export const mockProducts: Product[] = [
  {
    id: 'garages',
    name: 'Garages',
    description: 'High-quality oak garages, built to last. Fully customizable options available.',
    imageUrl: 'https://placehold.co/400x300.png',
    basePrice: 10000,
    options: [
      {
        id: 'size',
        name: 'Size',
        type: 'select',
        defaultValue: 'single',
        values: [
          { label: 'Single Bay', value: 'single' },
          { label: 'Double Bay', value: 'double', priceModifier: 5000 },
          { label: 'Triple Bay', value: 'triple', priceModifier: 10000 },
        ],
      },
      {
        id: 'roof_type',
        name: 'Roof Type',
        type: 'radio',
        defaultValue: 'tile',
        values: [
          { label: 'Tile', value: 'tile' },
          { label: 'Shingle', value: 'shingle', priceModifier: -500 },
        ],
      },
    ],
  },
  {
    id: 'gazebos',
    name: 'Gazebos',
    description: 'Elegant oak gazebos to enhance your garden space. Perfect for outdoor relaxation.',
    imageUrl: 'https://placehold.co/400x300.png',
    basePrice: 3000,
    options: [
      {
        id: 'shape',
        name: 'Shape',
        type: 'select',
        defaultValue: 'square',
        values: [
          { label: 'Square', value: 'square' },
          { label: 'Hexagonal', value: 'hexagonal', priceModifier: 500 },
        ],
      },
      {
        id: 'siding',
        name: 'Siding',
        type: 'radio',
        defaultValue: 'open',
        values: [
          { label: 'Open Sides', value: 'open' },
          { label: 'Partial Sides', value: 'partial', priceModifier: 300 },
          { label: 'Full Sides', value: 'full', priceModifier: 600 },
        ],
      },
    ],
  },
  {
    id: 'porches',
    name: 'Porches',
    description: 'Add character to your home with a beautifully crafted oak porch.',
    imageUrl: 'https://placehold.co/400x300.png',
    basePrice: 2500,
    options: [
       {
        id: 'style',
        name: 'Style',
        type: 'select',
        defaultValue: 'lean_to',
        values: [
          { label: 'Lean-to', value: 'lean_to' },
          { label: 'Gable End', value: 'gable_end', priceModifier: 400 },
        ],
      },
    ],
  },
  {
    id: 'oak-beams',
    name: 'Oak Beams',
    description: 'Structural and decorative oak beams, cut to your specifications.',
    imageUrl: 'https://placehold.co/400x300.png',
    basePrice: 100, // Price per meter or unit
    options: [
      {
        id: 'length',
        name: 'Length (meters)',
        type: 'select',
        defaultValue: '3',
        values: [
          { label: '3m', value: '3' },
          { label: '4m', value: '4', priceModifier: 30 },
          { label: '5m', value: '5', priceModifier: 60 },
        ],
      },
      {
        id: 'finish',
        name: 'Finish',
        type: 'radio',
        defaultValue: 'planed',
        values: [
          { label: 'Planed Smooth', value: 'planed' },
          { label: 'Rough Sawn', value: 'rough_sawn', priceModifier: -10 },
        ],
      },
    ],
  },
  {
    id: 'oak-flooring',
    name: 'Oak Flooring',
    description: 'Durable and timeless solid oak flooring for a premium finish.',
    imageUrl: 'https://placehold.co/400x300.png',
    basePrice: 50, // Price per sq meter
    options: [
      {
        id: 'grade',
        name: 'Grade',
        type: 'select',
        defaultValue: 'rustic',
        values: [
          { label: 'Rustic', value: 'rustic' },
          { label: 'Prime', value: 'prime', priceModifier: 20 },
        ],
      },
      {
        id: 'width',
        name: 'Board Width',
        type: 'radio',
        defaultValue: '150mm',
        values: [
          { label: '150mm', value: '150mm' },
          { label: '200mm', value: '200mm', priceModifier: 10 },
        ],
      },
    ],
  },
  {
    id: 'special-deals',
    name: 'Special Deals',
    description: 'Check out our latest special offers and discounted oak products.',
    imageUrl: 'https://placehold.co/400x300.png',
    basePrice: 0, // Placeholder
    options: [
       {
        id: 'offer',
        name: 'Current Offers',
        type: 'select',
        defaultValue: 'none',
        values: [
          { label: 'View All Deals', value: 'all_deals' },
        ],
      },
    ],
  },
];

export const mockFeaturedDeals: Product[] = [
  {
    id: 'pre-configured-double-garage',
    name: 'Pre-Configured Double Garage',
    description: 'Limited time offer on our popular 2-bay garage. Includes standard roofing and joinery.',
    imageUrl: 'https://placehold.co/200x150.png',
    basePrice: 8500,
    options: [ // Simplified options for a pre-configured deal
      {
        id: 'roof_type',
        name: 'Roof Type',
        type: 'select',
        defaultValue: 'tile_standard',
        values: [
          { label: 'Standard Tiles', value: 'tile_standard' },
        ],
      },
    ],
  },
  {
    id: 'garden-gazebo-kit',
    name: 'Garden Gazebo Kit',
    description: 'Easy-to-assemble 3m x 3m oak gazebo kit. Perfect DIY project.',
    imageUrl: 'https://placehold.co/200x150.png',
    basePrice: 3200,
    options: [
      {
        id: 'kit_contents',
        name: 'Kit Contents',
        type: 'select',
        defaultValue: 'full_kit',
        values: [
          { label: 'Full Kit', value: 'full_kit' },
        ],
      },
    ],
  },
];


export const getProductById = (id: string): Product | undefined => {
  const allProducts = [...mockProducts, ...mockFeaturedDeals];
  return allProducts.find(p => p.id === id);
};
