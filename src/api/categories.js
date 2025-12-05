import apiClient from './client';

/**
 * Get all categories
 * Backend endpoint: GET /api/categories
 * Backend returns: { success: true, data: [...] }
 * @returns {Promise<Array>} Array of category objects
 */
export async function getCategories() {
  try {
    const { data } = await apiClient.get('/api/categories');
    // Backend returns { success: true, data: [...] }
    if (data?.success && Array.isArray(data.data)) {
      return data.data;
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get category by ID
 * Backend endpoint: GET /api/categories/:id
 * Backend returns: { success: true, data: {...} }
 * @param {number|string} id - Category ID
 * @returns {Promise<Object>} Category object
 */
export async function getCategoryById(id) {
  if (id === undefined || id === null) {
    throw new Error('Category id is required');
  }
  try {
    const { data } = await apiClient.get(`/api/categories/${id}`);
    // Backend returns { success: true, data: {...} }
    return data?.success ? data.data : data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

