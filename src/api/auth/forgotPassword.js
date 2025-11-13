import apiClient from '../client';

/**
 * Forgot password - placeholder integration.
 * NOTE: Backend endpoint not found. Expected:
 *   POST /api/user/forgotPassword  -> { email }
 *   or /api/user/requestPasswordReset
 * When backend endpoint is available, this function will work as is by path update.
 */
export async function forgotPassword({ email }) {
	if (!email) {
		throw new Error('email is required');
	}

	// Update the path below once the backend route exists
	const endpoint = '/api/user/forgotPassword';

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


