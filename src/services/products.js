import apiClient from '../api/client';

/**
 * Normalize product data from API response to match component expectations
 * @param {Object} product - Product object from API
 * @returns {Object} Normalized product
 */
const normalizeProduct = (product) => {
  if (!product) return null;
  
  // Extract images array - API returns images array for getById, primary_image for getAll
  const imagesArray = Array.isArray(product.images) 
    ? [...product.images].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    : [];
  
  // Extract all image URLs for gallery - handle both object format {image_url: "..."} and direct URLs
  const galleryUrls = imagesArray
    .map(img => {
      // If image is already a string URL, return it
      if (typeof img === 'string' && img.trim() !== '') return img;
      // If image is an object with image_url property, return image_url
      if (img && typeof img === 'object' && img.image_url && typeof img.image_url === 'string') {
        return img.image_url;
      }
      return null;
    })
    .filter(Boolean); // Remove any null/undefined values
  
  // Get primary image:
  // 1. From images array (find is_primary === 1, or first image)
  // 2. From primary_image field (for getAll products response)
  let primaryImageUrl = '';
  
  // Try to get from images array first (getById response)
  if (imagesArray.length > 0) {
    const primaryImageObj = imagesArray.find(img => img.is_primary === 1) || imagesArray[0];
    if (primaryImageObj) {
      primaryImageUrl = typeof primaryImageObj === 'string' 
        ? primaryImageObj 
        : (primaryImageObj.image_url || '');
    }
  }
  
  // Fallback to primary_image field (from getAll products response)
  if (!primaryImageUrl && product.primary_image && typeof product.primary_image === 'string') {
    primaryImageUrl = product.primary_image;
    // If we have primary_image but no gallery, add it to gallery
    if (galleryUrls.length === 0 && primaryImageUrl) {
      galleryUrls.push(primaryImageUrl);
    }
  }
  
  return {
    id: product.id,
    title: product.title || '',
    description: product.description || product.short_desc || '',
    desc: product.short_desc || product.description || '',
    price: parseFloat(product.price) || 0,
    rating: parseFloat(product.rating || product.public_rating) || 0,
    image: primaryImageUrl,
    category: product.category_name || product.category?.name || '',
    category_id: product.category_id,
    category_name: product.category_name || product.category?.name || '',
    inStock: product.in_stock === 1,
    in_stock: product.in_stock,
    stock_quantity: product.stock_quantity,
    badge: product.badge,
    is_featured: product.is_featured === 1,
    gallery: galleryUrls.length > 0 ? galleryUrls : (primaryImageUrl ? [primaryImageUrl] : []),
    images: imagesArray,
    primary_image: product.primary_image || primaryImageUrl,
  };
};

/**
 * Fetch products with optional filters
 * @param {Object} filters - Filter parameters
 * @param {number|string} filters.category - Category ID
 * @param {string} filters.search - Search query (maps to 'search' param)
 * @param {string} filters.name - Name filter (maps to 'name' param)
 * @param {number} filters.min_price - Minimum price
 * @param {number} filters.max_price - Maximum price
 * @param {string} filters.sort - Sort option ('newest', 'popular', 'priceAsc', 'priceDesc', etc.)
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @returns {Promise<{products: Array, pagination: Object}>}
 */
export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.name) params.append('name', filters.name);
  if (filters.min_price !== undefined && filters.min_price !== null) {
    params.append('min_price', filters.min_price);
  }
  if (filters.max_price !== undefined && filters.max_price !== null) {
    params.append('max_price', filters.max_price);
  }
  if (filters.sort) {
    // Map UI sort options to API sort options
    // API accepts: newest, popular, trending (based on image query params)
    // Map price sorting to standard format if needed
    const sortValue = filters.sort === 'priceAsc' ? 'price_asc' 
                   : filters.sort === 'priceDesc' ? 'price_desc'
                   : filters.sort;
    params.append('sort', sortValue);
  }
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const queryString = params.toString();
  const url = queryString ? `/api/products?${queryString}` : '/api/products';
  
  const { data } = await apiClient.get(url);
  
  const productsData = data?.data || {};
  const products = Array.isArray(productsData.products) 
    ? productsData.products.map(normalizeProduct).filter(Boolean)
    : [];
  
  return {
    products,
    pagination: productsData.pagination || {
      current_page: 1,
      total_pages: 1,
      total_items: products.length,
      items_per_page: filters.limit || 12,
    },
  };
}

/**
 * Fetch a single product by ID
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function getProductById(id) {
  if (id === undefined || id === null) {
    throw new Error('Product id is required');
  }
  const { data } = await apiClient.get(`/api/products/${id}`);
  
  if (!data?.success || !data?.data) {
    throw new Error('Product not found');
  }
  
  const normalized = normalizeProduct(data.data);
  
  // Debug: Log normalized product to verify images are extracted
  console.log('Normalized product from getProductById:', {
    id: normalized.id,
    title: normalized.title,
    image: normalized.image,
    gallery: normalized.gallery,
    images: normalized.images,
    rawImages: data.data.images,
  });
  
  return normalized;
}


