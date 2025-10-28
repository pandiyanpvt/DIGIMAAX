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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleSignInChange = (field) => (event) => {
    setSignInData({ ...signInData, [field]: event.target.value });
    setError('');
  };

  const handleSignUpChange = (field) => (event) => {
    setSignUpData({ ...signUpData, [field]: event.target.value });
    setError('');
  };

  const handleSignIn = async () => {
    if (!signInData.email || !signInData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
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
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpData.firstName || !signUpData.lastName || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful sign up
      signIn({
        id: 1,
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
      });
    } catch (err) {
      setError('Email already exists');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSignInData({ email: '', password: '' });
    setSignUpData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    closeSignInModal();
  };

  return (
    <Dialog
      open={signInModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c2c2c' }}>
            Welcome to Digimaax
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeTab === 0 ? (
          // Sign In Form
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={signInData.email}
              onChange={handleSignInChange('email')}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: '#666' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={signInData.password}
              onChange={handleSignInChange('password')}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: '#666' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
            <Button
              variant="text"
              sx={{ alignSelf: 'flex-start', color: '#1976d2' }}
            >
              Forgot Password?
            </Button>
          </Box>
        ) : (
          // Sign Up Form
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={signUpData.firstName}
                onChange={handleSignUpChange('firstName')}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: '#666' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={signUpData.lastName}
                onChange={handleSignUpChange('lastName')}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: '#666' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
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
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: '#666' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={signUpData.password}
              onChange={handleSignUpChange('password')}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: '#666' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={signUpData.confirmPassword}
              onChange={handleSignUpChange('confirmPassword')}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: '#666' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={activeTab === 0 ? handleSignIn : handleSignUp}
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            py: 1.5,
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Please wait...' : (activeTab === 0 ? 'Sign In' : 'Sign Up')}
        </Button>
      </DialogActions>

      <Box sx={{ px: 3, pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#666' }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </Box>
    </Dialog>
  );
};

export default SignInModal;
