import apiClient from './client';

/**
 * Get all services
 * Backend endpoint: GET /api/services/getAll
 * Backend returns: { success: true, message, count, data: [...] }
 * @returns {Promise<Array>} Array of service objects
 */
export async function getServices() {
  try {
    const { data } = await apiClient.get('/api/services/getAll');
    // Backend returns { success: true, message, count, data: [...] }
    if (data?.success && Array.isArray(data.data)) {
      return data.data;
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

/**
 * Get service by ID
 * Backend endpoint: GET /api/services/getByID/:id
 * Backend returns: { success: true, message, data: {...} }
 * @param {number|string} id - Service ID
 * @returns {Promise<Object>} Service object
 */
export async function getServiceById(id) {
  if (id === undefined || id === null) {
    throw new Error('Service id is required');
  }
  try {
    const { data } = await apiClient.get(`/api/services/getByID/${id}`);
    // Backend returns { success: true, message, data: {...} }
    return data?.success ? data.data : data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
}

