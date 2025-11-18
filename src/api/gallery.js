import apiClient from './client';

const normalizeGalleryResponse = (data = {}, fallbackMessage = 'Gallery items retrieved successfully') => {
  const items = Array.isArray(data.galleryItems) ? data.galleryItems : [];
  return {
    message: data?.message || fallbackMessage,
    count: data?.count ?? items.length,
    items,
  };
};

export async function getGalleryItems() {
  const { data } = await apiClient.get('/api/gallery/getAll');
  return normalizeGalleryResponse(data);
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


