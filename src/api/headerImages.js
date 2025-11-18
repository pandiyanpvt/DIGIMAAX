import apiClient from './client';

const normalizeImagesResponse = (data = {}, fallbackMessage = 'Header images retrieved successfully') => {
	const images = Array.isArray(data.headerImages) ? data.headerImages : [];
	return {
		message: data?.message || fallbackMessage,
		count: data?.count ?? images.length,
		images,
	};
};

/**
 * Fetch header images within an order range.
 * @param {{min?: number, max?: number}} params
 */
export async function getHeaderImagesByOrderRange({ min = 1, max = 6 } = {}) {
	const { data } = await apiClient.get('/api/header-images/getByOrder', {
		params: { min, max },
	});
	return normalizeImagesResponse(data);
}

/**
 * Fetch all header images (admin token required).
 */
export async function getAllHeaderImages() {
	const { data } = await apiClient.get('/api/header-images/getAll');
	return normalizeImagesResponse(data);
}

/**
 * Fetch a single header image by id.
 * @param {number|string} id
 */
export async function getHeaderImageById(id) {
	if (id === undefined || id === null) {
		throw new Error('Header image id is required');
	}
	const { data } = await apiClient.get(`/api/header-images/getByID/${id}`);
	return {
		message: data?.message || 'Header image retrieved successfully',
		image: data?.headerImage || null,
	};
}

/**
 * Fetch header images matching a specific order number.
 * @param {number|string} orderNo
 */
export async function getHeaderImagesByOrderNo(orderNo) {
	if (orderNo === undefined || orderNo === null) {
		throw new Error('Order number is required');
	}
	const { data } = await apiClient.get(`/api/header-images/getByOrderNo/${orderNo}`);
	return normalizeImagesResponse(data);
}

export default getHeaderImagesByOrderRange;

