import mugImg from '../assets/products/shop/Customized Mug.jpg';
import clockImg from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImg from '../assets/products/shop/shirt.jpg';
import tshirtImg from '../assets/products/shop/tshit.jpg';

const MOCK_PRODUCTS = [
  { id: 1, title: 'Customized Wall Clock', category: 'Customized Wall Clock', price: 4499, rating: 4.8, image: clockImg, desc: 'Premium custom printed wall clock.', inStock: true, badge: 'Best Seller' },
  { id: 2, title: 'Customized T-Shirt', category: 'Customized T-Shirt', price: 2599, rating: 4.7, image: tshirtImg || shirtImg, desc: 'Soft cotton tee with your design.', inStock: true, badge: 'New' },
  { id: 3, title: 'Customized Mug', category: 'Customized Mug', price: 1499, rating: 4.9, image: mugImg, desc: 'Ceramic mug with photo print.', inStock: true, badge: 'Popular' },
  { id: 4, title: 'Gift Box Set', category: 'Gift Items', price: 5299, rating: 4.6, image: clockImg, desc: 'Curated premium gift set.', inStock: true },
  { id: 5, title: 'Corporate Notebook', category: 'Corporate Items', price: 1999, rating: 4.4, image: shirtImg, desc: 'Brandable notebook for teams.', inStock: true },
  { id: 6, title: 'Branding Sticker Pack', category: 'Branding Items', price: 999, rating: 4.5, image: mugImg, desc: 'Die-cut stickers, assorted.', inStock: true },
  { id: 7, title: 'Photo Frame Premium', category: 'Gift Items', price: 3799, rating: 4.5, image: clockImg, desc: 'Elegant frame for your memories.', inStock: true },
  { id: 8, title: 'Corporate Pen Set', category: 'Corporate Items', price: 2899, rating: 4.3, image: shirtImg, desc: 'Engraved pen gift set.', inStock: true },
  { id: 9, title: 'Logo Sticker Sheet', category: 'Branding Items', price: 1299, rating: 4.6, image: mugImg, desc: 'High-quality vinyl stickers.', inStock: true },
  { id: 10, title: 'Graphic Tee Limited', category: 'Customized T-Shirt', price: 2999, rating: 4.8, image: tshirtImg || shirtImg, desc: 'Limited edition graphic tee.', inStock: true },
  { id: 11, title: 'Modern Wall Clock XL', category: 'Customized Wall Clock', price: 5699, rating: 4.7, image: clockImg, desc: 'Oversized wall clock, modern design.', inStock: true },
  { id: 12, title: 'Color Mug Duo', category: 'Customized Mug', price: 2599, rating: 4.9, image: mugImg, desc: 'Two-tone mugs set.', inStock: true },
];

export async function getProducts() {
  // Simulate a network request
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_PRODUCTS;
}

export async function getProductById(id) {
  await new Promise((r) => setTimeout(r, 300));
  const product = MOCK_PRODUCTS.find(p => String(p.id) === String(id));
  if (!product) throw new Error('Product not found');
  // Attach a simple gallery mock
  return { ...product, gallery: [product.image, product.image, product.image] };
}


