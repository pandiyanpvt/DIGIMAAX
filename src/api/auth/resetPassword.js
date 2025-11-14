import apiClient from '../client';

/**
 * Reset password with OTP
 * Backend endpoint: POST /api/user/reset-password
 * body: { email, otp, newPassword }
 * response: { message }
 */
export async function resetPassword({ email, otp, newPassword }) {
	if (!email || !otp || !newPassword) {
		throw new Error('Email, OTP, and new password are required');
	}

	if (newPassword.length < 6) {
		throw new Error('Password must be at least 6 characters');
	}

	const { data } = await apiClient.post('/api/user/reset-password', {
		email,
		otp,
		newPassword,
	});

	return {
		message: data?.message || 'Password reset successfully',
	};
}

export default resetPassword;

