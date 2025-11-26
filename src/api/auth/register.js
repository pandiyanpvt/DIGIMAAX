import apiClient from '../client';

const DEFAULT_USER_ROLE_ID = Number(
	import.meta.env?.VITE_DEFAULT_USER_ROLE_ID ?? 2
);

/**
 * User registration
 * Backend endpoint: POST /api/user/register
 * body: { firstName, lastName, email, phoneNumber, password, userRoleId }
 * response: { user }
 */
export async function register({
	firstName,
	lastName,
	email,
	phoneNumber,
	password,
	userRoleId,
}) {
	const resolvedRoleId =
		userRoleId !== undefined && userRoleId !== null
			? Number(userRoleId)
			: DEFAULT_USER_ROLE_ID;

	if (!firstName || !lastName || !email || !phoneNumber || !password) {
		throw new Error(
			'firstName, lastName, email, phoneNumber, and password are required'
		);
	}

	const { data } = await apiClient.post('/api/user/register', {
		firstName,
		lastName,
		email,
		phoneNumber,
		password,
		userRoleId: resolvedRoleId,
	});

	return {
		user: data?.user || null,
		message: data?.message || 'Registered successfully',
	};
}

export default register;


