import apiClient from './client';

const ALLOWED_UPDATE_FIELDS = [
	'firstName',
	'lastName',
	'email',
	'phoneNumber',
	'password',
	'userRoleId',
];

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

export async function deleteUser(id) {
	if (!id) {
		throw new Error('User id is required');
	}
	const { data } = await apiClient.delete(`/api/user/delete/${id}`);
	return {
		message: data?.message || 'User deleted successfully',
	};
}

export default updateUser;

