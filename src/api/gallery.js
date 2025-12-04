import apiClient from './client';

/**
 * Get all gallery items
 * Backend endpoint: GET /api/gallery/getAll
 * Backend returns: { message, count, galleryItems: [...] }
 * @returns {Promise<{items: Array, count: number, message: string}>}
 */
export async function getGalleryItems() {
  try {
    const { data } = await apiClient.get('/api/gallery/getAll');
    // Backend returns { message, count, galleryItems: [...] }
    const items = Array.isArray(data?.galleryItems) ? data.galleryItems : [];
    return {
      items,
      count: data?.count ?? items.length,
      message: data?.message || 'Gallery items retrieved successfully',
    };
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
}

export async function getGalleryItemById(id) {
  if (id === undefined || id === null) {
    throw new Error('Gallery item id is required');
  }
  const { data } = await apiClient.get(`/api/gallery/getByID/${id}`);
  return {
    message: data?.message || 'Gallery item retrieved successfully',
    item: data?.galleryItem || null,
  };
}

export default getGalleryItems;


