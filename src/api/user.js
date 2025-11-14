import apiClient from './client';

const ALLOWED_UPDATE_FIELDS = [
	'firstName',
	'lastName',
	'email',
	'phoneNumber',
	'password',
	'userRoleId',
];

/**
 * Register a new user
 * Backend endpoint: POST /api/user/register
 * body: { firstName, lastName, email, phoneNumber, password, userRoleId }
 * response: { message, user }
 */
export async function registerUser(payload) {
	const { firstName, lastName, email, phoneNumber, password, userRoleId } = payload;

	if (!firstName || !lastName || !email || !phoneNumber || !password) {
		throw new Error('firstName, lastName, email, phoneNumber, and password are required');
	}

	const { data } = await apiClient.post('/api/user/register', {
		firstName,
		lastName,
		email,
		phoneNumber,
		password,
		userRoleId: userRoleId || 2, // Default to role ID 2 if not provided
	});

	return {
		message: data?.message || 'User registered successfully',
		user: data?.user || null,
	};
}

/**
 * Update user information
 * Backend endpoint: PUT /api/user/update/:id
 * Requires authentication
 * body: { firstName?, lastName?, email?, phoneNumber?, password?, userRoleId? }
 * response: { message, user }
 */
export async function updateUser(id, updates = {}) {
	if (!id) {
		throw new Error('User id is required');
	}

	const payload = {};
	ALLOWED_UPDATE_FIELDS.forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(updates, key)) {
			const value = updates[key];
			if (value !== undefined && value !== null && value !== '') {
				payload[key] = value;
			}
		}
	});

	if (Object.keys(payload).length === 0) {
		throw new Error('At least one valid field is required to update');
	}

	const { data } = await apiClient.put(`/api/user/update/${id}`, payload);
	return {
		message: data?.message || 'User updated successfully',
		user: data?.user || null,
	};
}

/**
 * Delete a user
 * Backend endpoint: DELETE /api/user/delete/:id
 * Requires authentication
 * response: { message }
 */
export async function deleteUser(id) {
	if (!id) {
		throw new Error('User id is required');
	}
	const { data } = await apiClient.delete(`/api/user/delete/${id}`);
	return {
		message: data?.message || 'User deleted successfully',
	};
}

/**
 * Get all users (Admin only)
 * Backend endpoint: GET /api/user/getAll
 * Requires admin authentication
 * response: { message, count, users }
 */
export async function getAllUsers() {
	const { data } = await apiClient.get('/api/user/getAll');
	return {
		message: data?.message || 'Users retrieved successfully',
		count: data?.count || 0,
		users: data?.users || [],
	};
}

/**
 * Get users by user role (Admin only)
 * Backend endpoint: GET /api/user/getByUserRole/:userRoleId
 * Requires admin authentication
 * response: { message, count, users }
 */
export async function getUsersByRole(userRoleId) {
	if (!userRoleId) {
		throw new Error('userRoleId is required');
	}
	const { data } = await apiClient.get(`/api/user/getByUserRole/${userRoleId}`);
	return {
		message: data?.message || 'Users retrieved successfully',
		count: data?.count || 0,
		users: data?.users || [],
	};
}

/**
 * Get user by email (Admin only)
 * Backend endpoint: GET /api/user/getByEmail/:email
 * Requires admin authentication
 * response: { message, user }
 */
export async function getUserByEmail(email) {
	if (!email) {
		throw new Error('Email is required');
	}
	const { data } = await apiClient.get(`/api/user/getByEmail/${encodeURIComponent(email)}`);
	return {
		message: data?.message || 'User retrieved successfully',
		user: data?.user || null,
	};
}

/**
 * Get user by phone number (Admin only)
 * Backend endpoint: GET /api/user/getByPhoneNumber/:phoneNumber
 * Requires admin authentication
 * response: { message, user }
 */
export async function getUserByPhoneNumber(phoneNumber) {
	if (!phoneNumber) {
		throw new Error('Phone number is required');
	}
	const { data } = await apiClient.get(`/api/user/getByPhoneNumber/${encodeURIComponent(phoneNumber)}`);
	return {
		message: data?.message || 'User retrieved successfully',
		user: data?.user || null,
	};
}

/**
 * Get user by ID (Admin only)
 * Backend endpoint: GET /api/user/getByID/:id
 * Requires admin authentication
 * response: { message, user }
 */
export async function getUserById(id) {
	if (!id) {
		throw new Error('User id is required');
	}
	const { data } = await apiClient.get(`/api/user/getByID/${id}`);
	return {
		message: data?.message || 'User retrieved successfully',
		user: data?.user || null,
	};
}

export default {
	registerUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getUsersByRole,
	getUserByEmail,
	getUserByPhoneNumber,
	getUserById,
};
