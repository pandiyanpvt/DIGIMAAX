import apiClient, { setAuthToken } from '../client';

/**
 * User login
 * Backend endpoint: POST /api/user/userLogin
 * body: { email, password }
 * response: { token, user }
 */
export async function login({ email, password }) {
	if (!email || !password) {
		throw new Error('email and password are required');
	}

	const { data } = await apiClient.post('/api/user/userLogin', {
		email,
		password,
	});

	if (data?.token) {
		setAuthToken(data.token);
	}

	return {
		token: data?.token || null,
		user: data?.user || null,
		message: data?.message || 'Login successful',
	};
}

/**
 * Admin login (optional)
 * Backend endpoint: POST /api/user/adminLogin
 */
export async function adminLogin({ email, password }) {
	if (!email || !password) {
	throw new Error('email and password are required');
	}
	const { data } = await apiClient.post('/api/user/adminLogin', {
		email,
		password,
	});
	if (data?.token) {
		setAuthToken(data.token);
	}
	return {
		token: data?.token || null,
		user: data?.user || null,
		message: data?.message || 'Admin login successful',
	};
}

export default login;


