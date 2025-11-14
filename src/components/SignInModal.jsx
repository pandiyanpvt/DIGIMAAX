import React, { useMemo, useState } from 'react';
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	InputAdornment,
	Tab,
	Tabs,
	TextField,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { verifyEmail, resetPassword } from '../api/auth';

const DEFAULT_USER_ROLE_ID = Number(
	import.meta.env?.VITE_DEFAULT_USER_ROLE_ID ?? 2
);

const INITIAL_SIGN_IN = { email: '', password: '' };
const INITIAL_SIGN_UP = {
	firstName: '',
	lastName: '',
	email: '',
	phoneNumber: '',
	password: '',
	confirmPassword: '',
};

const SignInModal = () => {
	const {
		signInModalOpen,
		closeSignInModal,
		loginUser,
		registerUser,
		requestPasswordReset,
	} = useAuth();

	const [activeTab, setActiveTab] = useState(0);
	const [mode, setMode] = useState('default'); // 'default' | 'forgot' | 'verify-email' | 'reset-password'
	const [signInData, setSignInData] = useState(INITIAL_SIGN_IN);
	const [signUpData, setSignUpData] = useState(INITIAL_SIGN_UP);
	const [forgotEmail, setForgotEmail] = useState('');
	const [verificationData, setVerificationData] = useState({ email: '', otp: '' });
	const [resetPasswordData, setResetPasswordData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState({ error: '', success: '' });
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showSignInPassword, setShowSignInPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const validators = useMemo(
		() => ({
			email(value) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!value) return 'Email is required';
				if (!emailRegex.test(value)) return 'Please enter a valid email address';
				return '';
			},
			password(value) {
				if (!value) return 'Password is required';
				if (value.length < 6) return 'Password must be at least 6 characters';
				if (value.length > 50) return 'Password must be less than 50 characters';
				return '';
			},
			name(value, label) {
				if (!value?.trim()) return `${label} is required`;
				if (value.length < 2) return `${label} must be at least 2 characters`;
				if (value.length > 40) return `${label} must be less than 40 characters`;
				if (!/^[a-zA-Z\s'-]+$/.test(value)) {
					return `${label} contains invalid characters`;
				}
				return '';
			},
			phone(value) {
				if (!value) return 'Phone number is required';
				if (!/^[+\d][\d\s\-()]{6,20}$/.test(value)) {
					return 'Please enter a valid phone number';
				}
				return '';
			},
		}),
		[]
	);

	const handleTabChange = (_, newValue) => {
		setActiveTab(newValue);
		setMode('default');
		setStatus({ error: '', success: '' });
		setShowPassword(false);
		setShowConfirmPassword(false);
		setShowSignInPassword(false);
		setVerificationData({ email: '', otp: '' });
		setResetPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
	};

	const handleClose = () => {
		setMode('default');
		setActiveTab(0);
		setStatus({ error: '', success: '' });
		setSignInData(INITIAL_SIGN_IN);
		setSignUpData(INITIAL_SIGN_UP);
		setForgotEmail('');
		setVerificationData({ email: '', otp: '' });
		setResetPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
		setShowPassword(false);
		setShowConfirmPassword(false);
		setShowSignInPassword(false);
		setShowNewPassword(false);
		closeSignInModal();
	};

	const handleSignIn = async () => {
		const emailError = validators.email(signInData.email);
		const passwordError = validators.password(signInData.password);

		if (emailError || passwordError) {
			setStatus({
				error: emailError || passwordError,
				success: '',
			});
			return;
		}

		setLoading(true);
		setStatus({ error: '', success: '' });
		try {
			await loginUser({
				email: signInData.email.trim(),
				password: signInData.password,
			});
			setSignInData(INITIAL_SIGN_IN);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Unable to sign in. Please try again.';
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const handleSignUp = async () => {
		const errors = {
			firstName: validators.name(signUpData.firstName, 'First name'),
			lastName: validators.name(signUpData.lastName, 'Last name'),
			email: validators.email(signUpData.email),
			phoneNumber: validators.phone(signUpData.phoneNumber),
			password: validators.password(signUpData.password),
			confirmPassword: '',
		};

		if (!signUpData.confirmPassword) {
			errors.confirmPassword = 'Please confirm your password';
		} else if (signUpData.password !== signUpData.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
		}

		const firstError = Object.values(errors).find(Boolean);
		if (firstError) {
			setStatus({ error: firstError, success: '' });
			return;
		}

		setLoading(true);
		setStatus({ error: '', success: '' });
		try {
			const response = await registerUser({
				firstName: signUpData.firstName.trim(),
				lastName: signUpData.lastName.trim(),
				email: signUpData.email.trim(),
				password: signUpData.password,
				phoneNumber: signUpData.phoneNumber.trim(),
				userRoleId: DEFAULT_USER_ROLE_ID,
			});

			// After registration, switch to email verification mode
			setVerificationData({ email: signUpData.email.trim(), otp: '' });
			setMode('verify-email');
			setStatus({
				error: '',
				success: response?.message || 'Registration successful! Please check your email for the verification code.',
			});
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Unable to register. Please try again.';
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const handleForgotPassword = async () => {
		const emailError = validators.email(forgotEmail);
		if (emailError) {
			setStatus({ error: emailError, success: '' });
			return;
		}

		setLoading(true);
		setStatus({ error: '', success: '' });
		try {
			const response = await requestPasswordReset({
				email: forgotEmail.trim(),
			});
			// Switch to reset password mode with OTP
			setResetPasswordData({ email: forgotEmail.trim(), otp: '', newPassword: '', confirmPassword: '' });
			setMode('reset-password');
			setStatus({
				error: '',
				success:
					response?.message ||
					'Password reset OTP sent to your email. Please check your inbox.',
			});
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Sorry, we could not process your request.';
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyEmail = async () => {
		if (!verificationData.otp || verificationData.otp.length !== 6) {
			setStatus({ error: 'Please enter a valid 6-digit OTP', success: '' });
			return;
		}

		setLoading(true);
		setStatus({ error: '', success: '' });
		try {
			await verifyEmail({
				email: verificationData.email,
				otp: verificationData.otp,
			});
			setStatus({
				error: '',
				success: 'Email verified successfully! You can now sign in.',
			});
			// Switch back to sign in after a delay
			setTimeout(() => {
				setMode('default');
				setActiveTab(0);
				setVerificationData({ email: '', otp: '' });
			}, 2000);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Invalid or expired OTP. Please try again.';
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
		const errors = {
			otp: !resetPasswordData.otp || resetPasswordData.otp.length !== 6 ? 'Please enter a valid 6-digit OTP' : '',
			newPassword: validators.password(resetPasswordData.newPassword),
			confirmPassword: '',
		};

		if (!resetPasswordData.confirmPassword) {
			errors.confirmPassword = 'Please confirm your password';
		} else if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
		}

		const firstError = Object.values(errors).find(Boolean);
		if (firstError) {
			setStatus({ error: firstError, success: '' });
			return;
		}

		setLoading(true);
		setStatus({ error: '', success: '' });
		try {
			await resetPassword({
				email: resetPasswordData.email,
				otp: resetPasswordData.otp,
				newPassword: resetPasswordData.newPassword,
			});
			setStatus({
				error: '',
				success: 'Password reset successfully! You can now sign in with your new password.',
			});
			// Switch back to sign in after a delay
			setTimeout(() => {
				setMode('default');
				setActiveTab(0);
				setResetPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
			}, 2000);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Invalid or expired OTP. Please try again.';
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const renderSignIn = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<TextField
				fullWidth
				label="Email"
				type="email"
				value={signInData.email}
				onChange={(event) =>
					setSignInData((prev) => ({
						...prev,
						email: event.target.value,
					}))
				}
				InputProps={{
					startAdornment: (
						<EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label="Password"
				type={showSignInPassword ? 'text' : 'password'}
				value={signInData.password}
				onChange={(event) =>
					setSignInData((prev) => ({
						...prev,
						password: event.target.value,
					}))
				}
				InputProps={{
					startAdornment: (
						<LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowSignInPassword(!showSignInPassword)}
								edge="end"
								sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
							>
								{showSignInPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
				sx={textFieldSx}
			/>
			<Button
				variant="text"
				onClick={() => {
					setMode('forgot');
					setStatus({ error: '', success: '' });
				}}
				sx={{
					alignSelf: 'flex-start',
					color: '#64B5F6',
					'&:hover': {
						backgroundColor: 'rgba(100, 181, 246, 0.1)',
					},
				}}
			>
				Forgot Password?
			</Button>
		</Box>
	);

	const renderSignUp = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
				<TextField
					fullWidth
					label="First Name"
					value={signUpData.firstName}
					onChange={(event) =>
						setSignUpData((prev) => ({
							...prev,
							firstName: event.target.value,
						}))
					}
					InputProps={{
						startAdornment: (
							<PersonIcon
								sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }}
							/>
						),
					}}
					sx={textFieldSx}
				/>
				<TextField
					fullWidth
					label="Last Name"
					value={signUpData.lastName}
					onChange={(event) =>
						setSignUpData((prev) => ({
							...prev,
							lastName: event.target.value,
						}))
					}
					InputProps={{
						startAdornment: (
							<PersonIcon
								sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }}
							/>
						),
					}}
					sx={textFieldSx}
				/>
			</Box>
			<TextField
				fullWidth
				label="Email"
				type="email"
				value={signUpData.email}
				onChange={(event) =>
					setSignUpData((prev) => ({
						...prev,
						email: event.target.value,
					}))
				}
				InputProps={{
					startAdornment: (
						<EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label="Phone Number"
				value={signUpData.phoneNumber}
				onChange={(event) =>
					setSignUpData((prev) => ({
						...prev,
						phoneNumber: event.target.value,
					}))
				}
				InputProps={{
					startAdornment: (
						<PhoneAndroidIcon
							sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }}
						/>
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label="Password"
				type={showPassword ? 'text' : 'password'}
				value={signUpData.password}
				onChange={(event) =>
					setSignUpData((prev) => ({
						...prev,
						password: event.target.value,
					}))
				}
				InputProps={{
					startAdornment: (
						<LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowPassword(!showPassword)}
								edge="end"
								sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label="Confirm Password"
				type={showConfirmPassword ? 'text' : 'password'}
				value={signUpData.confirmPassword}
				onChange={(event) =>
					setSignUpData((prev) => ({
						...prev,
						confirmPassword: event.target.value,
					}))
				}
				InputProps={{
					startAdornment: (
						<LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								edge="end"
								sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
							>
								{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
				sx={textFieldSx}
			/>
		</Box>
	);

	const renderForgotPassword = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
			<Typography
				variant="body1"
				sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}
			>
				Enter your email address and we will send you a verification code.
			</Typography>
			<TextField
				fullWidth
				label="Email"
				type="email"
				value={forgotEmail}
				onChange={(event) => setForgotEmail(event.target.value)}
				InputProps={{
					startAdornment: (
						<EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<Box sx={{ display: 'flex', gap: 2 }}>
				<Button
					onClick={() => {
						setMode('default');
						setStatus({ error: '', success: '' });
						setForgotEmail('');
					}}
					variant="outlined"
					fullWidth
					sx={{
						color: 'white',
						borderColor: 'rgba(255, 255, 255, 0.3)',
						'&:hover': {
							borderColor: 'rgba(255, 255, 255, 0.5)',
							backgroundColor: 'rgba(255, 255, 255, 0.05)',
						},
					}}
				>
					Back
				</Button>
				<Button
					onClick={handleForgotPassword}
					variant="contained"
					fullWidth
					disabled={loading}
					sx={primaryButtonSx}
				>
					{loading ? 'Sending...' : 'Send Verification Code'}
				</Button>
			</Box>
		</Box>
	);

	const renderVerifyEmail = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
			<Typography
				variant="body1"
				sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}
			>
				We sent a verification code to <strong>{verificationData.email}</strong>. Please enter it below.
			</Typography>
			<TextField
				fullWidth
				label="Verification Code (6 digits)"
				value={verificationData.otp}
				onChange={(event) => {
					const value = event.target.value.replace(/\D/g, '').slice(0, 6);
					setVerificationData((prev) => ({ ...prev, otp: value }));
				}}
				inputProps={{ maxLength: 6 }}
				InputProps={{
					startAdornment: (
						<LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<Box sx={{ display: 'flex', gap: 2 }}>
				<Button
					onClick={() => {
						setMode('default');
						setStatus({ error: '', success: '' });
						setVerificationData({ email: '', otp: '' });
					}}
					variant="outlined"
					fullWidth
					sx={{
						color: 'white',
						borderColor: 'rgba(255, 255, 255, 0.3)',
						'&:hover': {
							borderColor: 'rgba(255, 255, 255, 0.5)',
							backgroundColor: 'rgba(255, 255, 255, 0.05)',
						},
					}}
				>
					Back
				</Button>
				<Button
					onClick={handleVerifyEmail}
					variant="contained"
					fullWidth
					disabled={loading || verificationData.otp.length !== 6}
					sx={primaryButtonSx}
				>
					{loading ? 'Verifying...' : 'Verify Email'}
				</Button>
			</Box>
		</Box>
	);

	const renderResetPassword = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
			<Typography
				variant="body1"
				sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}
			>
				Enter the verification code sent to <strong>{resetPasswordData.email}</strong> and your new password.
			</Typography>
			<TextField
				fullWidth
				label="Verification Code (6 digits)"
				value={resetPasswordData.otp}
				onChange={(event) => {
					const value = event.target.value.replace(/\D/g, '').slice(0, 6);
					setResetPasswordData((prev) => ({ ...prev, otp: value }));
				}}
				inputProps={{ maxLength: 6 }}
				InputProps={{
					startAdornment: (
						<LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label="New Password"
				type={showNewPassword ? 'text' : 'password'}
				value={resetPasswordData.newPassword}
				onChange={(event) =>
					setResetPasswordData((prev) => ({
						...prev,
						newPassword: event.target.value,
					}))
				}
				InputProps={{
					startAdornment: (
						<LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowNewPassword(!showNewPassword)}
								edge="end"
								sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
							>
								{showNewPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label="Confirm New Password"
				type={showNewPassword ? 'text' : 'password'}
				value={resetPasswordData.confirmPassword}
				onChange={(event) =>
					setResetPasswordData((prev) => ({
						...prev,
						confirmPassword: event.target.value,
					}))
				}
				InputProps={{
					startAdornment: (
						<LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
				<Button
					onClick={() => {
						setMode('forgot');
						setStatus({ error: '', success: '' });
						setResetPasswordData({ email: resetPasswordData.email, otp: '', newPassword: '', confirmPassword: '' });
					}}
					variant="outlined"
					fullWidth
					sx={{
						color: 'white',
						borderColor: 'rgba(255, 255, 255, 0.3)',
						'&:hover': {
							borderColor: 'rgba(255, 255, 255, 0.5)',
							backgroundColor: 'rgba(255, 255, 255, 0.05)',
						},
					}}
				>
					Back
				</Button>
				<Button
					onClick={handleResetPassword}
					variant="contained"
					fullWidth
					disabled={loading}
					sx={primaryButtonSx}
				>
					{loading ? 'Resetting...' : 'Reset Password'}
				</Button>
			</Box>
		</Box>
	);

	const dialogTitle =
		mode === 'forgot'
			? 'Forgot Password'
			: mode === 'verify-email'
			? 'Verify Your Email'
			: mode === 'reset-password'
			? 'Reset Password'
			: activeTab === 0
			? 'Welcome Back'
			: 'Create Your Account';

	return (
		<Dialog
			open={signInModalOpen}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			sx={{
				'& .MuiBackdrop-root': {
					backdropFilter: 'blur(8px)',
					backgroundColor: 'rgba(0, 0, 0, 0.6)',
				},
				'& .MuiDialog-paper': {
					borderRadius: 4,
					background: 'rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(20px)',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
					color: 'white',
				},
			}}
		>
			<DialogTitle sx={{ pb: 0 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
						{dialogTitle}
					</Typography>
					<IconButton
						onClick={handleClose}
						size="small"
						sx={{
							color: 'white',
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
							},
						}}
					>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent sx={{ px: 3, py: 2 }}>
				{mode === 'default' && (
					<Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }}>
						<Tabs
							value={activeTab}
							onChange={handleTabChange}
							centered
							sx={{
								'& .MuiTab-root': {
									color: 'rgba(255, 255, 255, 0.7)',
									fontWeight: 600,
									textTransform: 'none',
								},
								'& .Mui-selected': {
									color: 'white !important',
								},
								'& .MuiTabs-indicator': {
									backgroundColor: '#2196F3',
									height: 3,
								},
							}}
						>
							<Tab label="Sign In" />
							<Tab label="Sign Up" />
						</Tabs>
					</Box>
				)}

				{status.error && (
					<Alert
						severity="error"
						sx={{
							mb: 2,
							backgroundColor: 'rgba(211, 47, 47, 0.2)',
							color: '#FF6B6B',
							border: '1px solid rgba(211, 47, 47, 0.3)',
							backdropFilter: 'blur(10px)',
							'& .MuiAlert-icon': {
								color: '#FF6B6B',
							},
						}}
					>
						{status.error}
					</Alert>
				)}

				{status.success && (
					<Alert
						severity="success"
						sx={{
							mb: 2,
							backgroundColor: 'rgba(76, 175, 80, 0.2)',
							color: '#A5D6A7',
							border: '1px solid rgba(76, 175, 80, 0.3)',
							backdropFilter: 'blur(10px)',
							'& .MuiAlert-icon': {
								color: '#A5D6A7',
							},
						}}
					>
						{status.success}
					</Alert>
				)}

				{mode === 'forgot'
					? renderForgotPassword()
					: mode === 'verify-email'
					? renderVerifyEmail()
					: mode === 'reset-password'
					? renderResetPassword()
					: activeTab === 0
					? renderSignIn()
					: renderSignUp()}
			</DialogContent>

			{mode === 'default' && (
				<DialogActions sx={{ px: 3, pb: 3 }}>
					<Button
						onClick={activeTab === 0 ? handleSignIn : handleSignUp}
						variant="contained"
						fullWidth
						disabled={loading}
						sx={primaryButtonSx}
					>
						{loading
							? 'Please wait...'
							: activeTab === 0
							? 'Sign In'
							: 'Create Account'}
					</Button>
				</DialogActions>
			)}

			<Box sx={{ px: 3, pb: 2 }}>
				<Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
				<Typography
					variant="body2"
					sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}
				>
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</Typography>
			</Box>
		</Dialog>
	);
};

const textFieldSx = {
	'& .MuiOutlinedInput-root': {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		color: 'white',
		'& fieldset': {
			borderColor: 'rgba(255, 255, 255, 0.3)',
		},
		'&:hover fieldset': {
			borderColor: 'rgba(255, 255, 255, 0.5)',
		},
		'&.Mui-focused fieldset': {
			borderColor: '#2196F3',
		},
	},
	'& .MuiInputLabel-root': {
		color: 'rgba(255, 255, 255, 0.7)',
		'&.Mui-focused': {
			color: '#2196F3',
		},
	},
};

const primaryButtonSx = {
	background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
	color: 'white',
	py: 1.4,
	fontWeight: 'bold',
	borderRadius: 2,
	boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
	textTransform: 'none',
	'&:hover': {
		background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
		boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
	},
	'&:disabled': {
		background: 'rgba(255, 255, 255, 0.1)',
		color: 'rgba(255, 255, 255, 0.5)',
	},
};

export default SignInModal;
