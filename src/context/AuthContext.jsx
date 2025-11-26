import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	login as loginRequest,
	register as registerRequest,
	forgotPassword as forgotPasswordRequest,
} from '../api/auth';
import { clearAuthToken, setAuthToken } from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

const getInitialAuthState = () => {
	try {
		const stored = localStorage.getItem('auth');
		if (stored) {
			const parsed = JSON.parse(stored);
			return {
				user: parsed.user || null,
				token: parsed.token || null,
			};
		}
	} catch (error) {
		console.error('Failed to parse auth state from storage', error);
	}
	return { user: null, token: null };
};

export const AuthProvider = ({ children }) => {
	const [authState, setAuthState] = useState(() => getInitialAuthState());
	const [signInModalOpen, setSignInModalOpen] = useState(false);
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		// Remove legacy storage key if it exists
		localStorage.removeItem('user');

		if (authState?.token) {
			setAuthToken(authState.token);
		}
		setInitializing(false);
	}, []);

	const persistAuthState = useCallback((nextState) => {
		setAuthState(nextState);

		if (nextState?.token) {
			setAuthToken(nextState.token);
		} else {
			clearAuthToken();
		}

		if (nextState?.user || nextState?.token) {
			localStorage.setItem('auth', JSON.stringify(nextState));
		} else {
			localStorage.removeItem('auth');
		}
	}, []);

	const loginUser = useCallback(
		async ({ email, password }) => {
			const response = await loginRequest({ email, password });
			persistAuthState({
				user: response.user || null,
				token: response.token || null,
			});
			setSignInModalOpen(false);
			return response;
		},
		[persistAuthState]
	);

	const registerUser = useCallback(async (payload) => {
		const response = await registerRequest(payload);
		return response;
	}, []);

	const requestPasswordReset = useCallback(async ({ email }) => {
		const response = await forgotPasswordRequest({ email });
		return response;
	}, []);

	const updateUserSession = useCallback(
		(updates) => {
			if (!updates || typeof updates !== 'object') return;
			setAuthState((prev) => {
				const nextUser = { ...(prev?.user || {}), ...updates };
				const nextState = { ...prev, user: nextUser };
				localStorage.setItem('auth', JSON.stringify(nextState));
				return nextState;
			});
		},
		[]
	);

	const signOut = useCallback(() => {
		persistAuthState({ user: null, token: null });
	}, [persistAuthState]);

	const openSignInModal = useCallback(() => setSignInModalOpen(true), []);
	const closeSignInModal = useCallback(
		() => setSignInModalOpen(false),
		[]
	);

	const value = useMemo(
		() => ({
			user: authState.user,
			token: authState.token,
			isAuthenticated: Boolean(authState.user && authState.token),
			signInModalOpen,
			openSignInModal,
			closeSignInModal,
			loginUser,
			registerUser,
			requestPasswordReset,
			updateUserSession,
			signOut,
			initializing,
		}),
		[
			authState.user,
			authState.token,
			signInModalOpen,
			openSignInModal,
			closeSignInModal,
			loginUser,
			registerUser,
			requestPasswordReset,
			updateUserSession,
			signOut,
			initializing,
		]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
