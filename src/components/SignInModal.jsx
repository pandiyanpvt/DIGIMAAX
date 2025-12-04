import React, { useMemo, useState, useEffect } from 'react';
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
	Select,
	MenuItem,
	FormControl,
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
import { useTranslation } from '../hooks/useTranslation';
import { countryCodes } from '../utils/countryCodes';

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
	const [selectedCountryCode, setSelectedCountryCode] = useState('+33'); // Default to France
	const { t } = useTranslation();

	// Clear status when modal opens to prevent showing old messages
	useEffect(() => {
		if (signInModalOpen) {
			setStatus({ error: '', success: '' });
			setMode('default');
			setActiveTab(0);
		}
	}, [signInModalOpen]);

	const validators = useMemo(
		() => ({
			email(value) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!value) return t('validation.emailRequired');
				if (!emailRegex.test(value)) return t('validation.emailInvalid');
				return '';
			},
			password(value) {
				if (!value) return t('validation.passwordRequired');
				if (value.length < 6) return t('validation.passwordMinLength');
				if (value.length > 50) return t('validation.passwordMaxLength');
				return '';
			},
			name(value, label) {
				if (!value?.trim()) return `${label} ${t('validation.nameRequired')}`;
				if (value.length < 2) return `${label} ${t('validation.nameMinLength')}`;
				if (value.length > 40) return `${label} ${t('validation.nameMaxLength')}`;
				if (!/^[a-zA-Z\s'-]+$/.test(value)) {
					return `${label} ${t('validation.nameInvalidChars')}`;
				}
				return '';
			},
			phone(value) {
				if (!value) return t('validation.phoneRequired');
				if (!/^[+\d][\d\s\-()]{6,20}$/.test(value)) {
					return t('validation.phoneInvalid');
				}
				return '';
			},
		}),
		[t]
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
		setSelectedCountryCode('+33');
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
				t('errors.signInFailed');
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const handleSignUp = async () => {
		const errors = {
			firstName: validators.name(signUpData.firstName, t('auth.firstName')),
			lastName: validators.name(signUpData.lastName, t('auth.lastName')),
			email: validators.email(signUpData.email),
			phoneNumber: validators.phone(signUpData.phoneNumber),
			password: validators.password(signUpData.password),
			confirmPassword: '',
		};

		if (!signUpData.confirmPassword) {
			errors.confirmPassword = t('validation.confirmPasswordRequired');
		} else if (signUpData.password !== signUpData.confirmPassword) {
			errors.confirmPassword = t('validation.passwordsDoNotMatch');
		}

		const firstError = Object.values(errors).find(Boolean);
		if (firstError) {
			setStatus({ error: firstError, success: '' });
			return;
		}

		setLoading(true);
		setStatus({ error: '', success: '' });
		try {
			// Combine country code with phone number
			const fullPhoneNumber = selectedCountryCode + signUpData.phoneNumber.trim().replace(/^\+/, '');
			
			await registerUser({
				firstName: signUpData.firstName.trim(),
				lastName: signUpData.lastName.trim(),
				email: signUpData.email.trim(),
				password: signUpData.password,
				phoneNumber: fullPhoneNumber,
				userRoleId: DEFAULT_USER_ROLE_ID,
			});

			// Store email and password for later login after verification
			setRegisterEmail(signUpData.email.trim());
			// Switch to email verification mode instead of trying to log in
			setMode('verify-email');
			setStatus({
				error: '',
				success: t('auth.registrationSuccess'),
			});
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				t('errors.signUpFailed');
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyEmail = async () => {
		if (!verifyEmailOtp) {
			setStatus({ error: t('validation.enterOtp'), success: '' });
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

			// Clear all state - modal will be closed by loginUser
			setSignUpData(INITIAL_SIGN_UP);
			setVerifyEmailOtp('');
			setRegisterEmail('');
			setMode('default');
			setStatus({ error: '', success: '' });
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				t('errors.emailVerificationFailed');
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
					t('auth.otpSent'),
			});
		} catch (error) {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				t('errors.requestFailed');
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
		if (!otpData.otp || !otpData.newPassword || !otpData.confirmPassword) {
			setStatus({ error: t('validation.fillAllFields'), success: '' });
			return;
		}

		const passwordError = validators.password(otpData.newPassword);
		if (passwordError) {
			setStatus({ error: passwordError, success: '' });
			return;
		}

		if (otpData.newPassword !== otpData.confirmPassword) {
			setStatus({ error: t('validation.passwordsDoNotMatch'), success: '' });
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
				success: t('auth.passwordResetSuccess'),
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
				t('errors.passwordResetFailed');
			setStatus({ error: message, success: '' });
		} finally {
			setLoading(false);
		}
	};

	const renderSignIn = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<TextField
				fullWidth
				label={t('auth.email')}
				type="email"
				value={signInData.email}
				onChange={(event) =>
					setSignInData((prev) => ({
						...prev,
						email: event.target.value,
					}))
				}
				autoComplete="off"
				InputProps={{
					startAdornment: (
						<EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label={t('auth.password')}
				type={showSignInPassword ? 'text' : 'password'}
				value={signInData.password}
				onChange={(event) =>
					setSignInData((prev) => ({
						...prev,
						password: event.target.value,
					}))
				}
				autoComplete="new-password"
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
				{t('auth.forgotPassword')}
			</Button>
		</Box>
	);

	const renderSignUp = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
				<TextField
					fullWidth
					label={t('auth.firstName')}
					value={signUpData.firstName}
					onChange={(event) =>
						setSignUpData((prev) => ({
							...prev,
							firstName: event.target.value,
						}))
					}
					autoComplete="off"
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
					label={t('auth.lastName')}
					value={signUpData.lastName}
					onChange={(event) =>
						setSignUpData((prev) => ({
							...prev,
							lastName: event.target.value,
						}))
					}
					autoComplete="off"
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
				label={t('auth.email')}
				type="email"
				value={signUpData.email}
				onChange={(event) =>
					setSignUpData((prev) => ({
						...prev,
						email: event.target.value,
					}))
				}
				autoComplete="off"
				InputProps={{
					startAdornment: (
						<EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<Box sx={{ display: 'flex', gap: 1 }}>
				<FormControl sx={{ minWidth: 140, flexShrink: 0 }}>
					<Select
						value={selectedCountryCode}
						onChange={(e) => setSelectedCountryCode(e.target.value)}
						renderValue={(value) => {
							const country = countryCodes.find(c => c.dial_code === value);
							return country ? (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<span style={{ fontSize: '1.1rem' }}>{country.emoji}</span>
									<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
										{country.dial_code}
									</Typography>
								</Box>
							) : value;
						}}
						sx={{
							backgroundColor: 'rgba(255, 255, 255, 0.1)',
							color: 'white',
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: 'rgba(255, 255, 255, 0.3)',
							},
							'&:hover .MuiOutlinedInput-notchedOutline': {
								borderColor: 'rgba(255, 255, 255, 0.5)',
							},
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
								borderColor: '#2196F3',
							},
							'& .MuiSvgIcon-root': {
								color: 'rgba(255, 255, 255, 0.7)',
							},
							'& .MuiSelect-select': {
								display: 'flex',
								alignItems: 'center',
								gap: 0.5,
								py: 1.5,
								minHeight: 'auto',
							},
						}}
						MenuProps={{
							PaperProps: {
								sx: {
									backgroundColor: 'rgba(26, 26, 46, 0.95)',
									backdropFilter: 'blur(20px)',
									border: '1px solid rgba(255, 255, 255, 0.1)',
									maxHeight: 400,
									'& .MuiMenuItem-root': {
										color: 'white',
										'&:hover': {
											backgroundColor: 'rgba(255, 255, 255, 0.1)',
										},
										'&.Mui-selected': {
											backgroundColor: 'rgba(33, 150, 243, 0.3)',
											'&:hover': {
												backgroundColor: 'rgba(33, 150, 243, 0.4)',
											},
										},
									},
								},
							},
						}}
					>
						{countryCodes.map((country) => (
							<MenuItem key={country.code} value={country.dial_code}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
									<span style={{ fontSize: '1.2rem' }}>{country.emoji}</span>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography variant="body2" sx={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
											{country.name}
										</Typography>
									</Box>
									<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
										{country.dial_code}
									</Typography>
								</Box>
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					fullWidth
					label={t('auth.phoneNumber')}
					value={signUpData.phoneNumber}
					onChange={(event) =>
						setSignUpData((prev) => ({
							...prev,
							phoneNumber: event.target.value.replace(/^\+/, ''), // Remove leading + if user types it
						}))
					}
					autoComplete="off"
					InputProps={{
						startAdornment: (
							<PhoneAndroidIcon
								sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }}
							/>
						),
					}}
					placeholder="123456789"
					sx={textFieldSx}
				/>
			</Box>
			<TextField
				fullWidth
				label={t('auth.password')}
				type={showPassword ? 'text' : 'password'}
				value={signUpData.password}
				onChange={(event) =>
					setSignUpData((prev) => ({
						...prev,
						password: event.target.value,
					}))
				}
				autoComplete="new-password"
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
				label={t('auth.confirmPassword')}
				type={showConfirmPassword ? 'text' : 'password'}
				value={signUpData.confirmPassword}
				onChange={(event) =>
					setSignUpData((prev) => ({
						...prev,
						confirmPassword: event.target.value,
					}))
				}
				autoComplete="new-password"
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
				{t('auth.enterEmailForReset')}
			</Typography>
			<TextField
				fullWidth
				label={t('auth.email')}
				type="email"
				value={forgotEmail}
				onChange={(event) => setForgotEmail(event.target.value)}
				autoComplete="off"
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
					{t('auth.back')}
				</Button>
				<Button
					onClick={handleForgotPassword}
					variant="contained"
					fullWidth
					disabled={loading}
					sx={primaryButtonSx}
				>
					{loading ? t('auth.sendingOtp') : t('auth.sendVerificationCode')}
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
				{t('auth.otpSentTo')} <strong>{forgotEmail}</strong> {t('auth.andNewPassword')}
			</Typography>
			<TextField
				fullWidth
				label={t('auth.verificationCode')}
				value={otpData.otp}
				onChange={(event) =>
					setOtpData((prev) => ({ ...prev, otp: event.target.value }))
				}
				placeholder={t('auth.enterOtp')}
				autoComplete="off"
				InputProps={{
					startAdornment: (
						<EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
					),
				}}
				sx={textFieldSx}
			/>
			<TextField
				fullWidth
				label={t('auth.newPassword')}
				type={showNewPassword ? 'text' : 'password'}
				value={otpData.newPassword}
				onChange={(event) =>
					setOtpData((prev) => ({ ...prev, newPassword: event.target.value }))
				}
				autoComplete="new-password"
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
				label={t('auth.confirmNewPassword')}
				type={showConfirmPassword ? 'text' : 'password'}
				value={otpData.confirmPassword}
				onChange={(event) =>
					setOtpData((prev) => ({ ...prev, confirmPassword: event.target.value }))
				}
				autoComplete="new-password"
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
					{t('auth.back')}
				</Button>
				<Button
					onClick={handleResetPassword}
					variant="contained"
					fullWidth
					disabled={loading}
					sx={primaryButtonSx}
				>
					{loading ? t('auth.resettingPassword') : t('auth.resetPassword')}
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
				{t('auth.resendOtp')}
			</Button>
		</Box>
	);

	const renderVerifyEmail = () => (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
			<Typography
				variant="body1"
				sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}
			>
				{t('auth.verificationCodeSent')} <strong>{registerEmail}</strong>. {t('auth.checkEmail')}
			</Typography>
			<TextField
				fullWidth
				label={t('auth.verificationCode')}
				value={verifyEmailOtp}
				onChange={(event) => setVerifyEmailOtp(event.target.value)}
				placeholder={t('auth.enterOtp')}
				autoComplete="off"
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
					{t('auth.backToSignUp')}
				</Button>
				<Button
					onClick={handleVerifyEmail}
					variant="contained"
					fullWidth
					disabled={loading}
					sx={primaryButtonSx}
				>
					{loading ? t('auth.verifying') : t('auth.verifyEmail')}
				</Button>
			</Box>
		</Box>
	);

	const dialogTitle =
		mode === 'forgot'
			? t('auth.forgotPassword').replace('?', '')
			: mode === 'verify-otp'
			? t('auth.resetPassword')
			: activeTab === 0
			? t('auth.welcomeBack')
			: t('auth.createAccount');

	return (
		<Dialog
			open={signInModalOpen}
			onClose={() => {}} // Disable backdrop click to close
			disableEscapeKeyDown={true} // Disable Escape key to close
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
							<Tab label={t('auth.signIn')} />
							<Tab label={t('auth.signUp')} />
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
							? t('auth.pleaseWait')
							: activeTab === 0
							? t('auth.signIn')
							: t('auth.createAccountButton')}
					</Button>
				</DialogActions>
			)}

			<Box sx={{ px: 3, pb: 2 }}>
				<Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
				<Typography
					variant="body2"
					sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}
				>
					{t('auth.termsAgreement')}
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
		'& input:-webkit-autofill': {
			WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important',
			WebkitTextFillColor: 'white !important',
			caretColor: 'white',
		},
		'& input:-webkit-autofill:hover': {
			WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important',
			WebkitTextFillColor: 'white !important',
		},
		'& input:-webkit-autofill:focus': {
			WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important',
			WebkitTextFillColor: 'white !important',
		},
		'& input:-webkit-autofill:active': {
			WebkitBoxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important',
			WebkitTextFillColor: 'white !important',
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
