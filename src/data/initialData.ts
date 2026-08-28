import { Product, Category, Review, ValueProp } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    iconName: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    itemCount: 24,
    description: 'Precision engineered audio and sleek minimalist technology.'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    itemCount: 48,
    description: 'Timeless luxury apparel, cashmere outerwear, and tailored silhouettes.'
  },
  {
    id: 'home',
    name: 'Home',
    iconName: 'Armchair',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    itemCount: 36,
    description: 'Architectural furniture, artisanal ceramics, and ambient lighting.'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    itemCount: 18,
    description: 'Botanical formulations, organic skincare, and niche fragrances.'
  },
  {
    id: 'sports',
    name: 'Sports',
    iconName: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    itemCount: 15,
    description: 'High-performance activewear and matte finish equipment.'
  },
  {
    id: 'books',
    name: 'Books',
    iconName: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    itemCount: 20,
    description: 'Curated coffee table editions on architecture, art, and design.'
  },
  {
    id: 'toys',
    name: 'Toys',
    iconName: 'Gamepad2',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    itemCount: 12,
    description: 'Minimalist wooden heirlooms and design-led collectibles.'
  },
  {
    id: 'grocery',
    name: 'Grocery',
    iconName: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    itemCount: 22,
    description: 'Artisanal organic cold-pressed oils, rare spices, and gourmet provisions.'
  }
];

export const FEATURED_HERO_PRODUCT: Product = {
  id: 'obsidian-lounge-chair',
  name: 'The Obsidian Series Lounge Chair',
  category: 'Home',
  subCategory: 'Furniture',
  price: 24990,
  originalPrice: 28990,
  rating: 5.0,
  reviewCount: 42,
  image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
  ],
  badge: 'EXCLUSIVE',
  description: 'Crafted with premium walnut veneer and full-grain Italian leather, the Obsidian Series Lounge Chair merges mid-century ergonomic posture with contemporary tactile elegance.',
  isFeatured: true,
  inStock: true,
  specs: {
    'Frame': 'Molded Walnut Plywood',
    'Upholstery': 'Full-Grain Tuscan Aniline Leather',
    'Base': 'Die-cast Powder Coated Aluminum',
    'Dimensions': '84cm W x 85cm D x 84cm H',
    'Warranty': '10-Year Structural Guarantee'
  },
  tags: ['lounge', 'interior', 'luxury', 'furniture']
};

export const PRODUCTS: Product[] = [
  FEATURED_HERO_PRODUCT,
  {
    id: 'terraform-sculptural-lamp',
    name: 'Terraform Sculptural Lamp',
    category: 'Home',
    subCategory: 'Lighting',
    price: 12499,
    originalPrice: 15999,
    rating: 4.9,
    reviewCount: 28,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'NEW',
    description: 'Tactile ceramic base with hand-loomed linen shade delivering warm ambient architectural illumination.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Material': 'Hand-turned Stoneware & Linen',
      'Bulb Type': 'Dimmable LED Warm 2700K',
      'Cord Length': '2.2 meters Fabric Cable'
    }
  },
  {
    id: 'aurora-glass-carafe',
    name: 'Aurora Glass Carafe',
    category: 'Home',
    subCategory: 'Dining',
    price: 2999,
    originalPrice: 3999,
    rating: 4.8,
    reviewCount: 19,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'SALE',
    description: 'Hand-blown smoked glass carafe paired with a solid turned oak sphere stopper.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Capacity': '1.2 Liters',
      'Glass Type': 'Borosilicate Smoked Glass',
      'Care': 'Dishwasher Safe (Glass Body)'
    }
  },
  {
    id: 'linear-leather-portfolio',
    name: 'Linear Leather Portfolio',
    category: 'Fashion',
    subCategory: 'Accessories',
    price: 6999,
    originalPrice: 8999,
    rating: 4.8,
    reviewCount: 34,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'SALE',
    description: 'Fine-grain vegetable-tanned leather document sleeve engineered for laptops up to 15 inches.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Leather': 'Full Grain Calfskin',
      'Hardware': 'Brushed Silver YKK Zipper',
      'Lining': 'Microfiber Suede'
    }
  },
  {
    id: 'modulus-wall-clock',
    name: 'Modulus Wall Clock',
    category: 'Home',
    subCategory: 'Decor',
    price: 4499,
    originalPrice: 5999,
    rating: 4.8,
    reviewCount: 16,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    badge: 'SALE',
    description: 'Brushed brass dial clock with silent sweep Japanese quartz movement.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Movement': 'Silent Sweep Quartz',
      'Diameter': '30 cm',
      'Finish': 'Anodized Matte Brass'
    }
  },
  {
    id: 'symphony-anc-headphones',
    name: 'Symphony ANC Wireless Headphones',
    category: 'Electronics',
    subCategory: 'Audio',
    price: 18999,
    originalPrice: 22999,
    rating: 4.9,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'Studio-grade spatial acoustic drivers with active noise cancellation encased in bead-blasted aluminum.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Battery Life': '38 Hours',
      'Codec Support': 'LDAC, aptX Adaptive, AAC',
      'Weight': '250 grams'
    }
  },
  {
    id: 'botanical-serum-no3',
    name: 'Botanical Elixir Facial Serum No. 3',
    category: 'Beauty',
    subCategory: 'Skincare',
    price: 3499,
    originalPrice: 4499,
    rating: 5.0,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=800&q=80',
    badge: 'LIMITED',
    description: 'Cold-pressed wild rosehip, squalane, and vitamin C complex bottled in ultraviolet glass.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Volume': '50 ml',
      'Origin': 'Provence, France',
      'Key Ingredients': 'Rosehip, Marula, Bakuchiol'
    }
  },
  {
    id: 'zenith-minimalist-watch',
    name: 'Zenith Minimalist Chronograph',
    category: 'Fashion',
    subCategory: 'Accessories',
    price: 14999,
    originalPrice: 17999,
    rating: 4.9,
    reviewCount: 41,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    badge: 'EXCLUSIVE',
    description: 'Saphire glass face with surgical grade stainless steel casing and quick-release Horween leather strap.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Case Diameter': '40mm',
      'Movement': 'Swiss Quartz Chrono',
      'Water Resistance': '5 ATM / 50 meters'
    }
  },
  {
    id: 'solaris-desk-lamp',
    name: 'Solaris Matte Brass Desk Lamp',
    category: 'Home',
    subCategory: 'Lighting',
    price: 8499,
    originalPrice: 10999,
    rating: 4.8,
    reviewCount: 22,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'Architectural task light with continuous touch dimmer control and counterweighted arm balance.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Material': 'Solid Anodized Brass',
      'Bulb': 'Integrated High CRI LED 3000K',
      'Adjustability': '360 Degree Rotational Head'
    }
  },
  {
    id: 'velvet-accent-armchair',
    name: 'Velvet Atelier Accent Armchair',
    category: 'Home',
    subCategory: 'Furniture',
    price: 32999,
    originalPrice: 38999,
    rating: 4.9,
    reviewCount: 17,
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80',
    badge: 'EXCLUSIVE',
    description: 'Plush forest green velvet upholstery with hand-welded matte black steel geometry.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Fabric': 'High-Martindale Performance Velvet',
      'Dimensions': '78cm W x 80cm D x 82cm H'
    }
  },
  {
    id: 'artisan-ceramic-coffee-set',
    name: 'Artisan Ceramic Pour-Over Set',
    category: 'Home',
    subCategory: 'Dining',
    price: 4999,
    originalPrice: 6299,
    rating: 4.7,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    badge: 'SALE',
    description: 'Speckled stoneware coffee dripper and matching double-walled thermal mugs.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Set Includes': '1 Dripper, 1 Carafe, 2 Mugs',
      'Dishwasher Safe': 'Yes'
    }
  },
  {
    id: 'cashmere-overcoat-noir',
    name: 'Atelier Cashmere Tailored Overcoat',
    category: 'Fashion',
    subCategory: 'Apparel',
    price: 22499,
    originalPrice: 27999,
    rating: 5.0,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    badge: 'LIMITED',
    description: 'Pure Mongolian cashmere overcoat with horn buttons and silk satin lining.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Material': '100% Grade-A Cashmere',
      'Fit': 'Tailored European Cut'
    }
  },
  {
    id: 'studio-monitors-mk2',
    name: 'Acoustic Studio Monitors MkII',
    category: 'Electronics',
    subCategory: 'Audio',
    price: 28999,
    originalPrice: 34999,
    rating: 4.9,
    reviewCount: 53,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'Bi-amplified nearfield monitors crafted in solid walnut enclosures with custom silk dome tweeters.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Power Output': '120W RMS Per Speaker',
      'Frequency Response': '38Hz - 24kHz'
    }
  },
  {
    id: 'aero-smart-air-purifier',
    name: 'Aero Pure HEPA Smart Air Purifier',
    category: 'Electronics',
    subCategory: 'Smart Home',
    price: 16999,
    originalPrice: 19999,
    rating: 4.8,
    reviewCount: 37,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    badge: 'SALE',
    description: 'Whisper-quiet medical grade H13 HEPA filtration with real-time AQI OLED monitor and mobile app control.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Coverage': 'Up to 600 sq ft',
      'Filter Life': '12 Months Active Usage'
    }
  },
  {
    id: 'botanical-candle-santal',
    name: 'Santal & Amber Botanical Soy Candle',
    category: 'Beauty',
    subCategory: 'Fragrance',
    price: 2499,
    originalPrice: 3299,
    rating: 4.9,
    reviewCount: 71,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    badge: 'LIMITED',
    description: 'Hand-poured coconut soy wax infused with Australian sandalwood, crushed cardamom, and rich smoked amber.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Burn Time': '65 Hours',
      'Weight': '320g Wax Weight'
    }
  },
  {
    id: 'nordic-oak-dining-table',
    name: 'Nordic Solid Oak Dining Table',
    category: 'Home',
    subCategory: 'Furniture',
    price: 54999,
    originalPrice: 62999,
    rating: 5.0,
    reviewCount: 15,
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
    badge: 'EXCLUSIVE',
    description: 'Sustainably harvested Scandinavian white oak finished with matte natural wax oil to celebrate organic wood grain.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Seating Capacity': '6 to 8 Persons',
      'Dimensions': '200cm L x 90cm W x 75cm H'
    }
  },
  {
    id: 'titanium-active-smartwatch',
    name: 'Titanium Active GPS Smartwatch',
    category: 'Electronics',
    subCategory: 'Wearables',
    price: 21999,
    originalPrice: 25999,
    rating: 4.8,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'Aerospace grade titanium chassis, sapphire AMOLED display, dual-frequency GPS, and 14-day battery life.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Display': '1.4 Inch Sapphire AMOLED',
      'Battery': 'Up to 14 Days'
    }
  },
  {
    id: 'monochrome-wool-rug',
    name: 'Monochrome Hand-Knotted Wool Rug',
    category: 'Home',
    subCategory: 'Decor',
    price: 18499,
    originalPrice: 22999,
    rating: 4.9,
    reviewCount: 26,
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    badge: 'SALE',
    description: 'Plush New Zealand wool woven by master artisans with high tactile density and fringe details.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Size': '5 x 8 Feet',
      'Material': '100% Pure New Zealand Wool'
    }
  },
  {
    id: 'pure-linen-bedding-set',
    name: 'French Flax Pure Linen Bedding Set',
    category: 'Home',
    subCategory: 'Textiles',
    price: 9999,
    originalPrice: 12999,
    rating: 4.9,
    reviewCount: 58,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    badge: 'LIMITED',
    description: 'Stone-washed French flax linen duvet cover and pillowcase set that grows softer with every wash.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Includes': '1 Duvet Cover + 2 King Pillowcases',
      'Fabric': '100% Certified Organic Flax'
    }
  },
  {
    id: 'artisan-matcha-ceremony-kit',
    name: 'Uji Ceremony Matcha & Whisk Set',
    category: 'Grocery',
    subCategory: 'Gourmet',
    price: 3899,
    originalPrice: 4899,
    rating: 5.0,
    reviewCount: 31,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'First harvest ceremonial grade Uji matcha powder accompanied by a hand-carved bamboo chasen whisk and stoneware bowl.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Matcha Grade': 'Ceremonial First Harvest',
      'Origin': 'Kyoto Prefecture, Japan'
    }
  },
  {
    id: 'leather-travel-duffle',
    name: 'Horween Leather Weekend Duffle',
    category: 'Fashion',
    subCategory: 'Bags',
    price: 17999,
    originalPrice: 21999,
    rating: 4.9,
    reviewCount: 49,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    badge: 'EXCLUSIVE',
    description: 'Supple full-grain leather carry-on duffle with reinforced brass studs, shoe compartment, and padded shoulder strap.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Capacity': '45 Liters',
      'Dimensions': '52cm x 28cm x 30cm'
    }
  },
  {
    id: 'pro-mat-yoga-cushion',
    name: 'Cork & Rubber Performance Yoga Mat',
    category: 'Sports',
    subCategory: 'Wellness',
    price: 4299,
    originalPrice: 5499,
    rating: 4.8,
    reviewCount: 33,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    badge: 'SALE',
    description: 'Antimicrobial natural cork surface fused with heavy-density natural rubber base for optimal joint cushion.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Thickness': '5mm Dense Cushion',
      'Material': 'Organic Cork & Tree Rubber'
    }
  },
  {
    id: 'architectural-monograph-vol1',
    name: 'Architectural Digest Monograph Vol. 1',
    category: 'Books',
    subCategory: 'Design',
    price: 3199,
    originalPrice: 3999,
    rating: 5.0,
    reviewCount: 20,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    badge: 'LIMITED',
    description: 'Cloth-bound hardcover coffee table book exploring 100 legendary mid-century architectural masterpieces.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Page Count': '384 Pages High Gloss Print',
      'Format': 'Hardcover Linen Foil Stamped'
    }
  },
  {
    id: 'walnut-chess-heritage-set',
    name: 'Hand-Carved Walnut Heritage Chess Set',
    category: 'Toys',
    subCategory: 'Collectibles',
    price: 7499,
    originalPrice: 9499,
    rating: 4.9,
    reviewCount: 18,
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'Weighted Staunton chess pieces carved from solid maple and American walnut with magnetic storage drawer.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Board Size': '40cm x 40cm Solid Wood',
      'King Height': '8.5 cm Weighted Base'
    }
  },
  {
    id: 'ergonomic-executive-desk-chair',
    name: 'Aero Ergonomic Executive Task Chair',
    category: 'Home',
    subCategory: 'Furniture',
    price: 29999,
    originalPrice: 35999,
    rating: 4.9,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    badge: 'EXCLUSIVE',
    description: 'Breathable elastic mesh back with 4D lumbar support, synchronized tilt mechanism, and polished aluminum base.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Adjustment': '4D Armrests, Lumbar & Headrest',
      'Weight Capacity': '150 kg'
    }
  },
  {
    id: 'cold-pressed-organic-olive-oil',
    name: 'Tuscan Reserve Extra Virgin Olive Oil',
    category: 'Grocery',
    subCategory: 'Gourmet',
    price: 1899,
    originalPrice: 2399,
    rating: 4.9,
    reviewCount: 44,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    badge: 'SALE',
    description: 'Single-estate early harvest cold-pressed extra virgin olive oil with peppery notes and polyphenol richness.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Volume': '750 ml Dark Glass Bottle',
      'Acidity': '< 0.2%'
    }
  },
  {
    id: 'copper-drip-coffee-kettle',
    name: 'Artisan Gooseneck Copper Kettle',
    category: 'Home',
    subCategory: 'Kitchen',
    price: 3699,
    originalPrice: 4599,
    rating: 4.8,
    reviewCount: 27,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'Precision spout gooseneck kettle crafted in hammered solid copper with natural walnut handle.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Capacity': '1.0 Liter',
      'Induction Compatible': 'Yes (Tri-ply Base)'
    }
  },
  {
    id: 'carbon-fiber-tennis-racket',
    name: 'Pro Graphite Carbon Tennis Racket',
    category: 'Sports',
    subCategory: 'Equipment',
    price: 12999,
    originalPrice: 15999,
    rating: 4.8,
    reviewCount: 14,
    image: 'https://images.unsplash.com/photo-1617083934555-ac7d4fed8814?auto=format&fit=crop&w=800&q=80',
    badge: 'EXCLUSIVE',
    description: 'High-modulus graphite carbon frame delivering exceptional control, torsional stiffness, and spin potential.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Weight': '300g Unstrung',
      'Head Size': '98 sq in'
    }
  },
  {
    id: 'hydrating-glow-facial-cream',
    name: 'Hydra-Silk Peptide Moisture Cream',
    category: 'Beauty',
    subCategory: 'Skincare',
    price: 2899,
    originalPrice: 3699,
    rating: 4.9,
    reviewCount: 62,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    badge: 'SALE',
    description: 'Tri-peptide complex blended with snow mushroom extract and niacinamide for deep dermal hydration.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Volume': '60 ml',
      'Skin Type': 'All Skin Types'
    }
  },
  {
    id: 'wireless-mechanical-keyboard',
    name: 'Keycraft Anodized Aluminum Keyboard',
    category: 'Electronics',
    subCategory: 'Accessories',
    price: 11499,
    originalPrice: 13999,
    rating: 4.9,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'CNC-milled aluminum chassis with hot-swappable tactile switches, RGB per-key backlighting, and Bluetooth 5.2.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Connectivity': 'Bluetooth / 2.4Ghz / USB-C',
      'Battery': '4000 mAh'
    }
  },
  {
    id: 'shearling-leather-jacket',
    name: 'Heritage Shearling Leather Aviator Jacket',
    category: 'Fashion',
    subCategory: 'Outerwear',
    price: 34999,
    originalPrice: 42999,
    rating: 5.0,
    reviewCount: 19,
    image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80',
    badge: 'EXCLUSIVE',
    description: 'Supple nappa leather exterior with thick plush shearling fleece collar and brass buckle fasteners.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Material': 'Genuine Shearling Lambskin',
      'Origin': 'Tuscany Atelier'
    }
  },
  {
    id: 'terrazzo-side-table',
    name: 'Venetian Terrazzo Cylinder Side Table',
    category: 'Home',
    subCategory: 'Furniture',
    price: 13899,
    originalPrice: 16999,
    rating: 4.8,
    reviewCount: 23,
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'Cast terrazzo stone cylinder featuring natural marble aggregate chips hand-polished to a honed satin finish.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Dimensions': '38cm Diameter x 48cm H',
      'Weight': '22 kg Solid Cast'
    }
  },
  {
    id: 'handcrafted-wooden-toy-train',
    name: 'Artisan Beechwood Modular Toy Express',
    category: 'Toys',
    subCategory: 'Wooden',
    price: 2299,
    originalPrice: 2999,
    rating: 4.9,
    reviewCount: 15,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    badge: 'LIMITED',
    description: 'Natural non-toxic organic beechwood train blocks finished with food-grade beeswax.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Material': 'FSC Certified Beechwood',
      'Age Grade': '2 Years+'
    }
  },
  {
    id: 'modern-art-hardcover-edition',
    name: 'The Modern Minimalist Living Collection',
    category: 'Books',
    subCategory: 'Art',
    price: 4599,
    originalPrice: 5499,
    rating: 5.0,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    badge: 'EXCLUSIVE',
    description: 'Vibrant oversized coffee table book featuring master photography of serene interior spaces around the world.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Pages': '420 Pages Art Paper',
      'Weight': '3.2 kg'
    }
  },
  {
    id: 'single-origin-espresso-beans',
    name: 'Ethiopian Yirgacheffe Single Origin Beans',
    category: 'Grocery',
    subCategory: 'Coffee',
    price: 1499,
    originalPrice: 1899,
    rating: 4.9,
    reviewCount: 81,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW',
    description: 'Freshly roasted micro-lot Arabica beans with notes of jasmine, bergamot, and sweet citrus clarity.',
    isEditorialPick: false,
    inStock: true,
    specs: {
      'Roast Level': 'Medium Light Specialty Roast',
      'Weight': '500g Nitrogen Flush Valve Bag'
    }
  },
  {
    id: 'pro-carbon-running-shoes',
    name: 'Aero Carbon Plate Marathon Running Shoes',
    category: 'Sports',
    subCategory: 'Footwear',
    price: 15499,
    originalPrice: 18999,
    rating: 4.9,
    reviewCount: 50,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    badge: 'SALE',
    description: 'Supercritical PEBA foam midsole with full-length curved carbon fiber propulsion plate for ultimate energy return.',
    isEditorialPick: true,
    inStock: true,
    specs: {
      'Weight': '195 grams (US Size 9)',
      'Stack Height': '39mm Heel / 31mm Forefoot'
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Julian Voss',
    role: 'Interior Designer',
    text: 'The quality of the Obsidian series exceeded every expectation. True luxury in every stitch and curve.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    date: '2026-06-12'
  },
  {
    id: '2',
    name: 'Elena Rossi',
    role: 'Creative Director',
    text: 'Minimalism done right. LUXE has become my primary destination for home essentials and tailored wardrobe pieces.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    date: '2026-07-01'
  },
  {
    id: '3',
    name: 'David Chen',
    role: 'Tech Entrepreneur',
    text: 'Fast global delivery and impeccable unboxing experience. The customer experience is as premium as the product.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    date: '2026-07-18'
  },
  {
    id: '4',
    name: 'Sophia Laurent',
    role: 'Architect',
    text: 'The architectural lighting collection brings warmth and timeless elegance to all my client projects.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    date: '2026-07-22'
  }
];

export const VALUE_PROPS: ValueProp[] = [
  {
    icon: 'Truck',
    title: 'Express India Shipping',
    description: 'Complimentary insured shipping on all orders over ₹2,499'
  },
  {
    icon: 'ShieldCheck',
    title: 'Secure Payments',
    description: 'UPI, Credit Cards, Net Banking & 256-bit SSL encrypted checkout'
  },
  {
    icon: 'RotateCcw',
    title: 'Hassle-Free Returns',
    description: 'Stress-free 30-day doorstep return policy'
  },
  {
    icon: 'Headphones',
    title: 'Concierge Support',
    description: '24/7 dedicated assistance for all inquiries & orders'
  },
  {
    icon: 'Gem',
    title: '100% Authentic Luxury',
    description: 'Sourced directly from verified master artisans & ateliers'
  },
  {
    icon: 'Gift',
    title: 'Signature Gift Wrapping',
    description: 'Luxury packaging and custom embossed message card included'
  }
];
