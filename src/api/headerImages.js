import apiClient from './client';

/**
 * Fetch header images within an order range.
 * @param {{min?: number, max?: number}} params
 */
export async function getHeaderImages({ min = 1, max = 6 } = {}) {
	const { data } = await apiClient.get('/api/header-images/getByOrder', {
		params: { min, max },
	});

	return {
		message: data?.message || 'Header images retrieved successfully',
		count: data?.count ?? (Array.isArray(data?.headerImages) ? data.headerImages.length : 0),
		images: Array.isArray(data?.headerImages) ? data.headerImages : [],
	};
}

/**
 * Fetch all header images (admin token required).
 */
export async function getAllHeaderImages() {
	const { data } = await apiClient.get('/api/header-images/getAll');
	return {
		message: data?.message || 'Header images retrieved successfully',
		count: data?.count ?? (Array.isArray(data?.headerImages) ? data.headerImages.length : 0),
		images: Array.isArray(data?.headerImages) ? data.headerImages : [],
	};
}

export default getHeaderImages;

