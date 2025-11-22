import apiClient from './client';

export async function getCategories() {
  const { data } = await apiClient.get('/api/categories');
  return {
    success: data?.success ?? true,
    data: Array.isArray(data?.data) ? data.data : [],
  };
}

export async function getCategoryById(id) {
  if (id === undefined || id === null) {
    throw new Error('Category id is required');
  }
  const { data } = await apiClient.get(`/api/categories/${id}`);
  return {
    success: data?.success ?? true,
    data: data?.data || null,
  };
}

