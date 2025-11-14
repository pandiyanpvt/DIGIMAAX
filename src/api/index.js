// Auth API exports
export * from './auth';

// User API exports
export {
	registerUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getUsersByRole,
	getUserByEmail,
	getUserByPhoneNumber,
	getUserById,
} from './user';

// Re-export client for convenience
export { default as apiClient, setAuthToken, clearAuthToken } from './client';

