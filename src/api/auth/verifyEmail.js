import apiClient from '../client';

/**
 * Verify email with OTP
 * POST /api/user/verify-email
 * Body: { email, otp }
 */
export async function verifyEmail({ email, otp }) {
	if (!email || !otp) {
		throw new Error('Email and OTP are required');
	}

	const endpoint = '/api/user/verify-email';

	try {
		const { data } = await apiClient.post(endpoint, { email, otp });
		return {
			message: data?.message || 'Email verified successfully',
		};
	} catch (err) {
		const message =
			err?.response?.data?.message ||
			'Failed to verify email. Please check your OTP and try again.';
		throw new Error(message);
	}
}

export default verifyEmail;

