import apiClient from '../client';

/**
 * Forgot password
 * Backend endpoint: POST /api/user/forgot-password
 * body: { email }
 * response: { message }
 */
export async function forgotPassword({ email }) {
	if (!email) {
		throw new Error('email is required');
	}

	// Backend endpoint: POST /api/user/forgot-password
	const endpoint = '/api/user/forgot-password';

	try {
		const { data } = await apiClient.post(endpoint, { email });
		return {
			message: data?.message || 'If the email exists, a reset link was sent.',
		};
	} catch (err) {
		// Surface a friendly message even if backend missing
		const message =
			err?.response?.data?.message ||
			'Forgot password is not available yet. Please contact support.';
		throw new Error(message);
	}
}

export default forgotPassword;


