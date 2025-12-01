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

	// Backend route: /api/user/forgot-password
	const endpoint = '/api/user/forgot-password';

	try {
		const { data } = await apiClient.post(endpoint, { email });
		return {
			message: data?.message || 'If the email exists, a reset link was sent.',
		};
	} catch (err) {
		// Preserve the original error with status code and message
		const errorMessage = err?.response?.data?.message || err?.message || 'Failed to send OTP. Please try again.';
		const error = new Error(errorMessage);
		error.response = err?.response; // Preserve response for status code checking
		throw error;
	}
}

export default forgotPassword;


