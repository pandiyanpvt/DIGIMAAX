import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  Alert,
  Tab,
  Tabs,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../context/AuthContext';

const SignInModal = () => {
  const { signInModalOpen, closeSignInModal, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    signIn: { email: '', password: '' },
    signUp: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });
  
  // OTP and Forgot Password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState(''); // 'signup' or 'forgot'
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Timer effect for OTP resend
  React.useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((time) => time - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password.length > 50) {
      return 'Password must be less than 50 characters';
    }
    return '';
  };

  const validateName = (name, fieldName) => {
    if (!name || name.trim() === '') {
      return `${fieldName} is required`;
    }
    if (name.length < 2) {
      return `${fieldName} must be at least 2 characters`;
    }
    if (name.length > 30) {
      return `${fieldName} must be less than 30 characters`;
    }
    if (!/^[a-zA-Z\s-']+$/.test(name)) {
      return `${fieldName} contains invalid characters`;
    }
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setFieldErrors({
      signIn: { email: '', password: '' },
      signUp: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    });
  };

  const handleSignInChange = (field) => (event) => {
    const value = event.target.value;
    setSignInData({ ...signInData, [field]: value });
    setError('');
    
    // Clear field error when user starts typing
    setFieldErrors({
      ...fieldErrors,
      signIn: { ...fieldErrors.signIn, [field]: '' },
    });
  };

  const handleSignUpChange = (field) => (event) => {
    const value = event.target.value;
    setSignUpData({ ...signUpData, [field]: value });
    setError('');
    
    // Clear field error when user starts typing
    setFieldErrors({
      ...fieldErrors,
      signUp: { ...fieldErrors.signUp, [field]: '' },
    });
  };

  const validateSignInForm = () => {
    const errors = {
      email: validateEmail(signInData.email),
      password: validatePassword(signInData.password),
    };

    setFieldErrors({
      ...fieldErrors,
      signIn: errors,
    });

    return !errors.email && !errors.password;
  };

  const validateSignUpForm = () => {
    const errors = {
      firstName: validateName(signUpData.firstName, 'First name'),
      lastName: validateName(signUpData.lastName, 'Last name'),
      email: validateEmail(signUpData.email),
      password: validatePassword(signUpData.password),
      confirmPassword: validateConfirmPassword(signUpData.password, signUpData.confirmPassword),
    };

    setFieldErrors({
      ...fieldErrors,
      signUp: errors,
    });

    return !errors.firstName && !errors.lastName && !errors.email && !errors.password && !errors.confirmPassword;
  };

  const handleSignIn = async () => {
    // Validate form
    if (!validateSignInForm()) {
      setError('Please fix the errors below');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful sign in
      signIn({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: signInData.email,
      });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    // Validate form
    if (!validateSignUpForm()) {
      setError('Please fix the errors below');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show OTP verification screen
      setOtpPurpose('signup');
      setShowOtpVerification(true);
      setOtpSent(true);
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (email, purpose) => {
    setLoading(true);
    setError('');
    setOtpError('');
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`OTP sent to ${email} for ${purpose}`);
      setOtpSent(true);
      setResendTimer(60);
      setShowOtpVerification(true);
      setOtpPurpose(purpose);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setOtpError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setOtpError('');
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock OTP verification (in real app, verify with backend)
      if (otpValue === '123456') {
        if (otpPurpose === 'signup') {
          // Complete signup - Sign in the user
          signIn({
            id: 1,
            firstName: signUpData.firstName.trim(),
            lastName: signUpData.lastName.trim(),
            email: signUpData.email.trim(),
          });
          // Close modal and reset states
          setShowOtpVerification(false);
          resetAllStates();
        } else if (otpPurpose === 'forgot') {
          // Show reset password form for forgot password flow
          setShowOtpVerification(false);
          setShowResetPassword(true);
        }
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    const email = otpPurpose === 'signup' ? signUpData.email : forgotPasswordEmail;
    setOtp(['', '', '', '', '', '']);
    await handleSendOtp(email, otpPurpose);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setActiveTab(-1);
  };

  const handleForgotPasswordSubmit = async () => {
    const emailError = validateEmail(forgotPasswordEmail);
    if (emailError) {
      setError(emailError);
      return;
    }

    await handleSendOtp(forgotPasswordEmail, 'forgot');
    setShowForgotPassword(false);
  };

  const handleResetPassword = async () => {
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const confirmError = validateConfirmPassword(newPassword, confirmNewPassword);
    if (confirmError) {
      setError(confirmError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset successful
      setError('');
      setShowResetPassword(false);
      setShowForgotPassword(false);
      setShowOtpVerification(false);
      setActiveTab(0);
      resetAllStates();
      alert('Password reset successful! Please sign in with your new password.');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAllStates = () => {
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setOtpSent(false);
    setForgotPasswordEmail('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowForgotPassword(false);
    setShowOtpVerification(false);
    setShowResetPassword(false);
    setResendTimer(0);
  };

  const handleClose = () => {
    setError('');
    setSignInData({ email: '', password: '' });
    setSignUpData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    setFieldErrors({
      signIn: { email: '', password: '' },
      signUp: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    });
    setActiveTab(0);
    resetAllStates();
    closeSignInModal();
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
    setShowOtpVerification(false);
    setShowResetPassword(false);
    setActiveTab(0);
    setError('');
    resetAllStates();
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            {showOtpVerification 
              ? 'Verify OTP' 
              : showForgotPassword 
              ? 'Forgot Password' 
              : showResetPassword
              ? 'Reset Password'
              : 'Welcome to Digimaax'}
          </Typography>
          <IconButton 
            onClick={handleClose} 
            size="small"
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* Tabs - only show when not in special screens */}
        {!showForgotPassword && !showOtpVerification && !showResetPassword && (
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              centered
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
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

        {error && (
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
            {error}
          </Alert>
        )}

        {/* OTP Verification Screen */}
        {showOtpVerification && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>
              We've sent a 6-digit verification code to
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#2196F3', fontWeight: 600 }}>
              {otpPurpose === 'signup' ? signUpData.email : forgotPasswordEmail}
            </Typography>

            {/* Development Note */}
            <Alert 
              severity="info" 
              sx={{ 
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                color: '#64B5F6',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                backdropFilter: 'blur(10px)',
                '& .MuiAlert-icon': {
                  color: '#64B5F6',
                },
              }}
            >
              <Typography variant="body2">
                For testing: Use OTP <strong>123456</strong>
              </Typography>
            </Alert>

            {/* OTP Input Boxes */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '24px', fontWeight: 'bold' },
                  }}
                  sx={{
                    width: '50px',
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
                  }}
                />
              ))}
            </Box>

            {otpError && (
              <Typography variant="body2" sx={{ textAlign: 'center', color: '#FF6B6B' }}>
                {otpError}
              </Typography>
            )}

            <Box sx={{ textAlign: 'center' }}>
              {resendTimer > 0 ? (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Resend OTP in {resendTimer}s
                </Typography>
              ) : (
                <Button
                  onClick={handleResendOtp}
                  variant="text"
                  sx={{ color: '#64B5F6' }}
                >
                  Resend OTP
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={handleBackToSignIn}
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
                onClick={handleVerifyOtp}
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
                  },
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Forgot Password Screen */}
        {showForgotPassword && !showOtpVerification && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>
              Enter your email address and we'll send you a verification code
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{
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
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={handleBackToSignIn}
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
                onClick={handleForgotPasswordSubmit}
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
                  },
                }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Reset Password Screen */}
        {showResetPassword && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>
              Create a new password for your account
            </Typography>

            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{
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
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{
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
              }}
            />

            <Button
              onClick={handleResetPassword}
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                color: 'white',
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
                },
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Box>
        )}

        {/* Sign In/Sign Up Forms - only show when not in special screens */}
        {!showForgotPassword && !showOtpVerification && !showResetPassword && activeTab === 0 ? (
          // Sign In Form
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={signInData.email}
              onChange={handleSignInChange('email')}
              error={!!fieldErrors.signIn.email}
              helperText={fieldErrors.signIn.email}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{
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
                  '&.Mui-error fieldset': {
                    borderColor: '#FF6B6B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#2196F3',
                  },
                  '&.Mui-error': {
                    color: '#FF6B6B',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#FF6B6B',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  margin: 0,
                  paddingLeft: 1,
                  paddingTop: 0.5,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={signInData.password}
              onChange={handleSignInChange('password')}
              error={!!fieldErrors.signIn.password}
              helperText={fieldErrors.signIn.password}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{
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
                  '&.Mui-error fieldset': {
                    borderColor: '#FF6B6B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#2196F3',
                  },
                  '&.Mui-error': {
                    color: '#FF6B6B',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#FF6B6B',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  margin: 0,
                  paddingLeft: 1,
                  paddingTop: 0.5,
                },
              }}
            />
            <Button
              onClick={handleForgotPassword}
              variant="text"
              sx={{ 
                alignSelf: 'flex-start', 
                color: '#64B5F6',
                '&:hover': {
                  backgroundColor: 'rgba(100, 181, 246, 0.1)',
                }
              }}
            >
              Forgot Password?
            </Button>
          </Box>
        ) : !showForgotPassword && !showOtpVerification && !showResetPassword && activeTab === 1 ? (
          // Sign Up Form
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={signUpData.firstName}
                onChange={handleSignUpChange('firstName')}
                error={!!fieldErrors.signUp.firstName}
                helperText={fieldErrors.signUp.firstName}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
                }}
                sx={{
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
                    '&.Mui-error fieldset': {
                      borderColor: '#FF6B6B',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#2196F3',
                    },
                    '&.Mui-error': {
                      color: '#FF6B6B',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#FF6B6B',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    margin: 0,
                    paddingLeft: 1,
                    paddingTop: 0.5,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={signUpData.lastName}
                onChange={handleSignUpChange('lastName')}
                error={!!fieldErrors.signUp.lastName}
                helperText={fieldErrors.signUp.lastName}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
                }}
                sx={{
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
                    '&.Mui-error fieldset': {
                      borderColor: '#FF6B6B',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#2196F3',
                    },
                    '&.Mui-error': {
                      color: '#FF6B6B',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#FF6B6B',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    margin: 0,
                    paddingLeft: 1,
                    paddingTop: 0.5,
                  },
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={signUpData.email}
              onChange={handleSignUpChange('email')}
              error={!!fieldErrors.signUp.email}
              helperText={fieldErrors.signUp.email}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{
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
                  '&.Mui-error fieldset': {
                    borderColor: '#FF6B6B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#2196F3',
                  },
                  '&.Mui-error': {
                    color: '#FF6B6B',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#FF6B6B',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  margin: 0,
                  paddingLeft: 1,
                  paddingTop: 0.5,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={signUpData.password}
              onChange={handleSignUpChange('password')}
              error={!!fieldErrors.signUp.password}
              helperText={fieldErrors.signUp.password}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{
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
                  '&.Mui-error fieldset': {
                    borderColor: '#FF6B6B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#2196F3',
                  },
                  '&.Mui-error': {
                    color: '#FF6B6B',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#FF6B6B',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  margin: 0,
                  paddingLeft: 1,
                  paddingTop: 0.5,
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={signUpData.confirmPassword}
              onChange={handleSignUpChange('confirmPassword')}
              error={!!fieldErrors.signUp.confirmPassword}
              helperText={fieldErrors.signUp.confirmPassword}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
              }}
              sx={{
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
                  '&.Mui-error fieldset': {
                    borderColor: '#FF6B6B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#2196F3',
                  },
                  '&.Mui-error': {
                    color: '#FF6B6B',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#FF6B6B',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  margin: 0,
                  paddingLeft: 1,
                  paddingTop: 0.5,
                },
              }}
            />
          </Box>
        ) : null}
      </DialogContent>

      {/* Dialog Actions - only show for normal sign in/sign up */}
      {!showForgotPassword && !showOtpVerification && !showResetPassword && (
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={activeTab === 0 ? handleSignIn : handleSignUp}
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              color: 'white',
            py: 1.5,
            fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
          }}
        >
          {loading ? 'Please wait...' : (activeTab === 0 ? 'Sign In' : 'Sign Up')}
        </Button>
      </DialogActions>
      )}

      <Box sx={{ px: 3, pb: 2 }}>
        <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </Box>
    </Dialog>
  );
};

export default SignInModal;
