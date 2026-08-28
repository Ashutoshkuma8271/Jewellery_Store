import { Category, Product, Review, ValueProp } from '../types';

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

export const CATEGORIES: Category[] = [
  { id: 'rings', name: 'Rings', iconName: 'Gem', image: image('photo-1605100804763-247f67b3557e'), itemCount: 18, description: 'Diamond solitaires, stackable bands and signature gold rings.' },
  { id: 'necklaces', name: 'Necklaces', iconName: 'Sparkles', image: image('photo-1599643478518-a784e5dc4c8f'), itemCount: 24, description: 'Fine chains and heirloom-worthy diamond necklaces.' },
  { id: 'earrings', name: 'Earrings', iconName: 'Circle', image: image('photo-1635767798638-3e25273a8236'), itemCount: 20, description: 'Everyday studs, hoops and luminous drops.' },
  { id: 'bracelets', name: 'Bracelets', iconName: 'Circle', image: image('photo-1617038220319-276d3cfab638'), itemCount: 14, description: 'Elegant bangles and diamond tennis bracelets.' },
  { id: 'bridal', name: 'Bridal', iconName: 'Heart', image: image('photo-1515562141207-7a88fb7ce338'), itemCount: 16, description: 'Pieces designed for a lifetime of celebrations.' },
  { id: 'mens', name: "Men's Jewelry", iconName: 'Crown', image: image('photo-1617038220319-276d3cfab638'), itemCount: 10, description: 'Quietly distinctive gold and diamond essentials.' },
  { id: 'gemstone', name: 'Gemstones', iconName: 'Gem', image: image('photo-1611652022419-a9419f74343d'), itemCount: 12, description: 'Colour, character and rare natural beauty.' }
];

const products: Product[] = [
  { id: 'celeste-solitaire', name: 'Celeste Diamond Solitaire Ring', category: 'Rings', subCategory: 'Diamond Rings', price: 84999, originalPrice: 99999, rating: 5, reviewCount: 124, image: image('photo-1605100804763-247f67b3557e'), gallery: [image('photo-1605100804763-247f67b3557e'), image('photo-1515562141207-7a88fb7ce338')], badge: 'EXCLUSIVE', description: 'A brilliant-cut lab-grown diamond set in polished 18K gold.', isFeatured: true, isEditorialPick: true, inStock: true, tags: ['diamond', 'engagement', '18k gold'] },
  { id: 'aurelia-tennis', name: 'Aurelia Diamond Tennis Bracelet', category: 'Bracelets', subCategory: 'Diamond Bracelets', price: 68999, originalPrice: 75999, rating: 4.9, reviewCount: 83, image: image('photo-1617038220319-276d3cfab638'), badge: 'NEW', description: 'An uninterrupted line of hand-set diamonds in 18K yellow gold.', isEditorialPick: true, inStock: true, tags: ['diamond', 'bracelet', 'gift'] },
  { id: 'seraphine-drop', name: 'Seraphine Pearl Drop Earrings', category: 'Earrings', subCategory: 'Pearl Earrings', price: 18999, rating: 4.9, reviewCount: 61, image: image('photo-1635767798638-3e25273a8236'), badge: 'NEW', description: 'Lustrous freshwater pearls suspended from diamond-set 18K gold.', isEditorialPick: true, inStock: true, tags: ['pearl', 'earrings', 'bridal'] },
  { id: 'devika-choker', name: 'Devika Heritage Diamond Choker', category: 'Bridal', subCategory: 'Bridal Necklaces', price: 164999, originalPrice: 189999, rating: 5, reviewCount: 42, image: image('photo-1599643478518-a784e5dc4c8f'), gallery: [image('photo-1599643478518-a784e5dc4c8f'), image('photo-1515562141207-7a88fb7ce338')], badge: 'EXCLUSIVE', description: 'A sculptural bridal choker of diamonds and intricate 22K goldwork.', isFeatured: true, inStock: true, tags: ['bridal', 'diamond', '22k gold'] },
  { id: 'siena-hoops', name: 'Siena Sculpted Gold Hoops', category: 'Earrings', subCategory: 'Gold Earrings', price: 24999, rating: 4.8, reviewCount: 97, image: image('photo-1535632066927-ab7c9ab60908'), description: 'Modern 18K gold hoops with a softly sculpted silhouette.', isEditorialPick: true, inStock: true, tags: ['gold', 'hoops', 'everyday'] },
  { id: 'orion-chain', name: 'Orion Signet Chain', category: "Men's Jewelry", subCategory: 'Chains', price: 32999, rating: 4.8, reviewCount: 38, image: image('photo-1617038220319-276d3cfab638'), badge: 'NEW', description: 'A substantial 18K gold vermeil curb chain for everyday distinction.', inStock: true, tags: ['men', 'gold', 'chain'] },
  { id: 'mira-pendant', name: 'Mira Emerald Halo Pendant', category: 'Gemstones', subCategory: 'Emerald', price: 52999, originalPrice: 61999, rating: 4.9, reviewCount: 56, image: image('photo-1611652022419-a9419f74343d'), badge: 'LIMITED', description: 'A vivid emerald framed by a fine halo of brilliant diamonds.', isEditorialPick: true, inStock: true, tags: ['emerald', 'pendant', 'diamond'] },
  { id: 'elara-band', name: 'Elara Pavé Eternity Band', category: 'Rings', subCategory: 'Wedding Bands', price: 45999, rating: 4.9, reviewCount: 75, image: image('photo-1515562141207-7a88fb7ce338'), description: 'A delicate circle of pavé-set diamonds, crafted in 18K gold.', inStock: true, tags: ['wedding', 'diamond', 'ring'] },
  { id: 'lumiere-chain', name: 'Lumière Layering Chain', category: 'Necklaces', subCategory: 'Gold Necklaces', price: 21999, rating: 4.7, reviewCount: 112, image: image('photo-1599643478518-a784e5dc4c8f'), badge: 'SALE', description: 'A fine 18K gold chain designed to catch the light, alone or layered.', inStock: true, tags: ['gold', 'necklace', 'everyday'] },
  { id: 'aruna-bangle', name: 'Aruna Textured Gold Bangle', category: 'Bracelets', subCategory: 'Gold Bangles', price: 38999, rating: 4.8, reviewCount: 49, image: image('photo-1617038220319-276d3cfab638'), description: 'A hand-finished 22K gold bangle with a subtle hammered texture.', inStock: true, tags: ['gold', 'bangle', 'festive'] }
];

export const FEATURED_HERO_PRODUCT = products[0];
export const PRODUCTS = products;
export const REVIEWS: Review[] = [
  { id: 'j-review-1', name: 'Ananya Mehra', role: 'Verified Collector', text: 'The craftsmanship is exceptional. My ring arrived beautifully presented and feels truly heirloom-worthy.', rating: 5, avatar: image('photo-1494790108377-be9c29b29330'), date: '2026-07-12' },
  { id: 'j-review-2', name: 'Rhea Kapoor', role: 'Verified Buyer', text: 'The diamond sparkle is incredible in person. The concierge kept me informed from order to delivery.', rating: 5, avatar: image('photo-1534528741775-53994a69daeb'), date: '2026-06-29' }
];
export const VALUE_PROPS: ValueProp[] = [
  { icon: 'ShieldCheck', title: 'BIS Hallmarked Gold', description: 'Purity assured on every gold creation.' },
  { icon: 'Gem', title: 'Certified Diamonds', description: 'Independently certified IGI/GIA stones.' },
  { icon: 'RotateCcw', title: 'Lifetime Exchange', description: 'Made to remain part of your story.' },
  { icon: 'ShieldCheck', title: 'Insured Delivery', description: 'Secure, complimentary shipping across India.' }
];
