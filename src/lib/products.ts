
import type { Product, GaragePricingParams } from '@/types';

const defaultGaragePricingParams: GaragePricingParams = {
  bayPrice: 1500, // Cost per bay
  catSlidePricePerBay: 150,
  beamSizePrices: { // Cost per bay for this beam size
    "6x6": 0,
    "7x7": 200,
    "8x8": 450,
  },
  trussPrices: { // One-off cost for truss type
    "curved": 0,
    "straight": 0, // Example: could be 100 if straight trusses are more expensive
  },
  baySizeMultipliers: { // Overall price multiplier
    "standard": 1.0,
    "large": 1.1,
  }
};

export const mockProducts: Product[] = [
  {
    id: 'garages',
    name: 'Garages',
    description: 'High-quality oak garages, built to last. Fully customizable options available, from number of bays to truss types and beam sizes.',
    imageUrl: 'https://placehold.co/600x400.png', 
    basePrice: 8000, 
    options: [
      {
        id: 'numBays',
        name: 'Number of Bays',
        type: 'slider',
        min: 1,
        max: 4,
        step: 1,
        defaultValue: 2,
        unit: 'Bays',
      },
      {
        id: 'beamSize',
        name: 'Structural Beam Sizes',
        type: 'select',
        defaultValue: '6x6',
        values: [
          { label: '6 inch x 6 inch', value: '6x6' },
          { label: '7 inch x 7 inch', value: '7x7' },
          { label: '8 inch x 8 inch', value: '8x8' },
        ],
      },
      {
        id: 'trussType',
        name: 'Truss Type',
        type: 'radio',
        defaultValue: 'curved',
        values: [
          { label: 'Curved', value: 'curved', imageUrl: 'https://placehold.co/100x75.png' },
          { label: 'Straight', value: 'straight', imageUrl: 'https://placehold.co/100x75.png' },
        ],
      },
      {
        id: 'baySize',
        name: 'Size Per Bay',
        type: 'select',
        defaultValue: 'standard',
        values: [
          { label: 'Standard (e.g., 3m wide)', value: 'standard' },
          { label: 'Large (e.g., 3.5m wide)', value: 'large' },
        ],
      },
      {
        id: 'catSlide',
        name: 'Include Cat Slide Roof?',
        description: '(Applies to all bays)', 
        type: 'checkbox',
        checkboxLabel: 'Yes, include cat slide roof',
        defaultValue: false,
      },
    ],
    garagePricingParams: defaultGaragePricingParams,
  },
  {
    id: 'gazebos',
    name: 'Gazebos',
    description: 'Elegant oak gazebos to enhance your garden space. Perfect for outdoor relaxation.',
    imageUrl: 'https://placehold.co/600x400.png',
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
    imageUrl: 'https://placehold.co/600x400.png',
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
    imageUrl: 'https://placehold.co/600x400.png',
    basePrice: 100, 
    options: [
      {
        id: 'length',
        name: 'Length (meters)',
        type: 'slider', 
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 3,
        unit: 'm',
        priceModifier: 30, 
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
    imageUrl: 'https://placehold.co/600x400.png',
    basePrice: 50, 
    options: [
      {
        id: 'area', 
        name: 'Area (sq meters)',
        type: 'slider',
        min: 5,
        max: 100,
        step: 1,
        defaultValue: 20,
        unit: 'm²',
      },
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
    imageUrl: 'https://placehold.co/600x400.png',
    basePrice: 0, 
    options: [ 
       {
        id: 'offer_info',
        name: 'Information',
        type: 'select', 
        defaultValue: 'view_deals',
        values: [
          { label: 'See active promotions below.', value: 'view_deals' },
        ],
      },
    ],
  },
];

export const mockFeaturedDeals: Product[] = [
  {
    id: 'pre-configured-double-garage',
    name: 'Pre-Configured Double Garage',
    description: 'Limited time offer on our popular 2-bay garage. Includes standard roofing and joinery. Fixed configuration.',
    imageUrl: 'https://placehold.co/200x150.png',
    basePrice: 10500, 
    options: [ 
      {
        id:'deal_info',
        name: 'Deal Specification',
        type: 'select', 
        defaultValue: '2bay_tile_roof',
        values: [
            {label: '2 Bay, Tiled Roof, Standard Beams', value: '2bay_tile_roof'}
        ]
      }
    ],
  },
  {
    id: 'garden-gazebo-kit',
    name: 'Garden Gazebo Kit (3m x 3m)',
    description: 'Easy-to-assemble 3m x 3m oak gazebo kit. Perfect DIY project. Includes all necessary timbers and basic plans.',
    imageUrl: 'https://placehold.co/200x150.png',
    basePrice: 2850, 
    options: [
      {
        id:'kit_info',
        name: 'Kit Contents',
        type: 'select', 
        defaultValue: 'standard_kit',
        values: [
            {label: 'Standard 3m x 3m Kit', value: 'standard_kit'}
        ]
      }
    ],
  },
];


export const getProductById = (id: string): Product | undefined => {
  const allProducts = [...mockProducts, ...mockFeaturedDeals];
  return allProducts.find(p => p.id === id);
};
