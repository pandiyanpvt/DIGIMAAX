import apiClient from '../client';

/**
 * Reset password with OTP
 * POST /api/user/reset-password
 * Body: { email, otp, newPassword }
 */
export async function resetPassword({ email, otp, newPassword }) {
	if (!email || !otp || !newPassword) {
		throw new Error('Email, OTP, and new password are required');
	}

	if (newPassword.length < 6) {
		throw new Error('Password must be at least 6 characters');
	}

	const endpoint = '/api/user/reset-password';

	try {
		const { data } = await apiClient.post(endpoint, { email, otp, newPassword });
		return {
			message: data?.message || 'Password reset successfully',
		};
	} catch (err) {
		const message =
			err?.response?.data?.message ||
			'Failed to reset password. Please check your OTP and try again.';
		throw new Error(message);
	}
}

export default resetPassword;

