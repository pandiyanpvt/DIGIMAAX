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
import { resetPassword, verifyEmail } from '../api/auth';

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
	const [mode, setMode] = useState('default'); // 'default' | 'forgot' | 'verify-otp' | 'verify-email'
	const [signInData, setSignInData] = useState(INITIAL_SIGN_IN);
	const [signUpData, setSignUpData] = useState(INITIAL_SIGN_UP);
	const [forgotEmail, setForgotEmail] = useState('');
	const [otpData, setOtpData] = useState({ otp: '', newPassword: '', confirmPassword: '' });
	const [verifyEmailOtp, setVerifyEmailOtp] = useState('');
	const [registerEmail, setRegisterEmail] = useState('');
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
	};

	const handleClose = () => {
		setMode('default');
		setActiveTab(0);
		setStatus({ error: '', success: '' });
		setSignInData(INITIAL_SIGN_IN);
		setSignUpData(INITIAL_SIGN_UP);
		setForgotEmail('');
		setOtpData({ otp: '', newPassword: '', confirmPassword: '' });
		setVerifyEmailOtp('');
		setRegisterEmail('');
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
			await registerUser({
				firstName: signUpData.firstName.trim(),
				lastName: signUpData.lastName.trim(),
				email: signUpData.email.trim(),
				password: signUpData.password,
				phoneNumber: signUpData.phoneNumber.trim(),
				userRoleId: DEFAULT_USER_ROLE_ID,
			});

			// Store email and password for later login after verification
			setRegisterEmail(signUpData.email.trim());
			// Switch to email verification mode instead of trying to log in
			setMode('verify-email');
			setStatus({
				error: '',
				success: 'Registration successful! Please check your email for the verification code.',
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

	const handleVerifyEmail = async () => {
		if (!verifyEmailOtp) {
			setStatus({ error: 'Please enter the verification code', success: '' });
			return;
		}

		setLoading(true);
		setStatus({ error: '', success: '' });
		try {
			await verifyEmail({
				email: registerEmail,
				otp: verifyEmailOtp,
			});

			// After email verification, log the user in
			await loginUser({
				email: registerEmail,
				password: signUpData.password,
			});

			setSignUpData(INITIAL_SIGN_UP);
			setVerifyEmailOtp('');
			setRegisterEmail('');
			setMode('default');
			setStatus({
				error: '',
				success: 'Email verified successfully! You are now logged in.',
			});
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to verify email. Please check your OTP and try again.';
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
			// Switch to OTP verification mode after successful OTP send
			setMode('verify-otp');
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

	const handleResetPassword = async () => {
		if (!otpData.otp || !otpData.newPassword || !otpData.confirmPassword) {
			setStatus({ error: 'Please fill in all fields', success: '' });
			return;
		}

		const passwordError = validators.password(otpData.newPassword);
		if (passwordError) {
			setStatus({ error: passwordError, success: '' });
			return;
		}

		if (otpData.newPassword !== otpData.confirmPassword) {
			setStatus({ error: 'Passwords do not match', success: '' });
			return;
		}

		setLoading(true);
		setStatus({ error: '', success: '' });
		try {
			await resetPassword({
				email: forgotEmail.trim(),
				otp: otpData.otp,
				newPassword: otpData.newPassword,
			});
			setStatus({
				error: '',
				success: 'Password reset successfully! You can now sign in with your new password.',
			});
			// Reset form and go back to sign in
			setTimeout(() => {
				setMode('default');
				setOtpData({ otp: '', newPassword: '', confirmPassword: '' });
				setForgotEmail('');
				setStatus({ error: '', success: '' });
			}, 2000);
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Failed to reset password. Please check your OTP and try again.';
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
					{loading ? 'Sending OTP...' : 'Send Verification Code'}
				</Button>
			</Box>
		</Box>
	);

	const renderVerifyOtp = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
			<Typography
				variant="body1"
				sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}
			>
				Enter the verification code sent to <strong>{forgotEmail}</strong> and your new password.
			</Typography>
			<TextField
				fullWidth
				label="Verification Code (OTP)"
				value={otpData.otp}
				onChange={(event) =>
					setOtpData((prev) => ({ ...prev, otp: event.target.value }))
				}
				placeholder="Enter 6-digit code"
				InputProps={{
					startAdornment: (
						<EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label="New Password"
				type={showNewPassword ? 'text' : 'password'}
				value={otpData.newPassword}
				onChange={(event) =>
					setOtpData((prev) => ({ ...prev, newPassword: event.target.value }))
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
				type={showConfirmPassword ? 'text' : 'password'}
				value={otpData.confirmPassword}
				onChange={(event) =>
					setOtpData((prev) => ({ ...prev, confirmPassword: event.target.value }))
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
			<Box sx={{ display: 'flex', gap: 2 }}>
				<Button
					onClick={() => {
						setMode('forgot');
						setOtpData({ otp: '', newPassword: '', confirmPassword: '' });
						setStatus({ error: '', success: '' });
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
					{loading ? 'Resetting Password...' : 'Reset Password'}
				</Button>
			</Box>
			<Button
				onClick={handleForgotPassword}
				variant="text"
				size="small"
				disabled={loading}
				sx={{
					color: '#64B5F6',
					'&:hover': {
						backgroundColor: 'rgba(100, 181, 246, 0.1)',
					},
				}}
			>
				Resend OTP
			</Button>
		</Box>
	);

	const renderVerifyEmail = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
			<Typography
				variant="body1"
				sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}
			>
				We've sent a verification code to <strong>{registerEmail}</strong>. Please check your email and enter the code below.
			</Typography>
			<TextField
				fullWidth
				label="Verification Code (OTP)"
				value={verifyEmailOtp}
				onChange={(event) => setVerifyEmailOtp(event.target.value)}
				placeholder="Enter 6-digit code"
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
						setVerifyEmailOtp('');
						setRegisterEmail('');
						setStatus({ error: '', success: '' });
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
					Back to Sign Up
				</Button>
				<Button
					onClick={handleVerifyEmail}
					variant="contained"
					fullWidth
					disabled={loading}
					sx={primaryButtonSx}
				>
					{loading ? 'Verifying...' : 'Verify Email'}
				</Button>
			</Box>
		</Box>
	);

	const dialogTitle =
		mode === 'forgot'
			? 'Forgot Password'
			: mode === 'verify-otp'
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
					: mode === 'verify-otp'
					? renderVerifyOtp()
					: mode === 'verify-email'
					? renderVerifyEmail()
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
