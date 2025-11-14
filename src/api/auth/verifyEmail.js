import apiClient from '../client';

/**
 * Verify email with OTP
 * Backend endpoint: POST /api/user/verify-email
 * body: { email, otp }
 * response: { message }
 */
export async function verifyEmail({ email, otp }) {
	if (!email || !otp) {
		throw new Error('Email and OTP are required');
	}

	const { data } = await apiClient.post('/api/user/verify-email', {
		email,
		otp,
	});

	return {
		message: data?.message || 'Email verified successfully',
	};
}

export default verifyEmail;

