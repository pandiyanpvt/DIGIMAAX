import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Lock,
  Email,
  Person,
  Verified,
  Phone,
  Cake,
  Wc,
  Home,
  LocationCity,
  Public,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, signIn } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleProfileChange = (field) => (event) => {
    setProfileData({ ...profileData, [field]: event.target.value });
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData({ ...passwordData, [field]: event.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      signIn({
        ...user,
        ...profileData,
      });
      
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || '',
        bio: user.bio || '',
      });
    }
    setEditMode(false);
  };

  const handleSavePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setErrorMessage('Please fill in all password fields');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to change password');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleCancelPasswordEdit = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setEditPasswordMode(false);
  };

  const textFieldStyle = (isEditable) => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: isEditable ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
      color: 'white',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
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
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 12,
        pb: 8,
        background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success/Error Messages */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Profile Header Card */}
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              p: 4,
              mb: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
                }}
              >
                {getInitials(user?.firstName, user?.lastName)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Verified sx={{ color: '#2196F3', fontSize: 28 }} />
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  {user?.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      background: 'rgba(33, 150, 243, 0.2)',
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#64B5F6', fontWeight: 600 }}>
                      Active Member
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      background: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#81C784', fontWeight: 600 }}>
                      Email Verified
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Edit Controls */}
          {!editMode ? (
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Button
                onClick={() => setEditMode(true)}
                variant="contained"
                startIcon={<Edit />}
                sx={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(33, 150, 243, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'right', mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={handleSaveProfile}
                variant="contained"
                startIcon={<Save />}
                sx={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5DBF61 0%, #4CAF50 100%)',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.6)',
                  },
                }}
              >
                Save All Changes
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outlined"
                startIcon={<Cancel />}
                sx={{
                  color: '#FF6B6B',
                  borderColor: '#FF6B6B',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#FF8888',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          )}

          <Grid container spacing={3}>
            {/* Basic Information Card */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    Basic Information
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileData.firstName}
                      onChange={handleProfileChange('firstName')}
                      disabled={!editMode}
                      placeholder={editMode ? "Enter your first name" : ""}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />

                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileData.lastName}
                      onChange={handleProfileChange('lastName')}
                      disabled={!editMode}
                      placeholder={editMode ? "Enter your last name" : ""}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />

                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.email}
                      onChange={handleProfileChange('email')}
                      disabled={!editMode}
                      type="email"
                      placeholder={editMode ? "your.email@example.com" : ""}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />

                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={handleProfileChange('phone')}
                      disabled={!editMode}
                      placeholder={editMode ? "+1 (555) 000-0000" : "Not provided"}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Personal Details Card */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    Personal Details
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={handleProfileChange('dateOfBirth')}
                      disabled={!editMode}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <Cake sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                        placeholder: !profileData.dateOfBirth && !editMode ? "Not provided" : ""
                      }}
                      sx={textFieldStyle(editMode)}
                    />

                    <FormControl fullWidth disabled={!editMode}>
                      <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Gender</InputLabel>
                      <Select
                        value={profileData.gender}
                        onChange={handleProfileChange('gender')}
                        label="Gender"
                        displayEmpty
                        startAdornment={<Wc sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />}
                        sx={{
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2196F3',
                          },
                          '& .MuiSvgIcon-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Select gender</em>
                        </MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Bio / About Me"
                      value={profileData.bio}
                      onChange={handleProfileChange('bio')}
                      disabled={!editMode}
                      multiline
                      rows={4}
                      placeholder={editMode ? "Tell us about yourself, your interests, hobbies..." : !profileData.bio ? "No bio added yet" : ""}
                      InputProps={{
                        startAdornment: <Info sx={{ mr: 1, mt: 1, color: 'rgba(255, 255, 255, 0.5)', alignSelf: 'flex-start' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Address Information Card */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    Address Information
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={profileData.address}
                        onChange={handleProfileChange('address')}
                        disabled={!editMode}
                        placeholder={editMode ? "123 Main Street, Apt 4B" : !profileData.address ? "No address added" : ""}
                        InputProps={{
                          startAdornment: <Home sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                        }}
                        sx={textFieldStyle(editMode)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={profileData.city}
                        onChange={handleProfileChange('city')}
                        disabled={!editMode}
                        placeholder={editMode ? "New York" : !profileData.city ? "Not provided" : ""}
                        InputProps={{
                          startAdornment: <LocationCity sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                        }}
                        sx={textFieldStyle(editMode)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="State/Province"
                        value={profileData.state}
                        onChange={handleProfileChange('state')}
                        disabled={!editMode}
                        placeholder={editMode ? "NY" : !profileData.state ? "Not set" : ""}
                        sx={textFieldStyle(editMode)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="ZIP Code"
                        value={profileData.zipCode}
                        onChange={handleProfileChange('zipCode')}
                        disabled={!editMode}
                        placeholder={editMode ? "10001" : !profileData.zipCode ? "Not set" : ""}
                        sx={textFieldStyle(editMode)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={profileData.country}
                        onChange={handleProfileChange('country')}
                        disabled={!editMode}
                        placeholder={editMode ? "United States" : !profileData.country ? "Not provided" : ""}
                        InputProps={{
                          startAdornment: <Public sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                        }}
                        sx={textFieldStyle(editMode)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Change Password Card */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    Change Password
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  {editPasswordMode ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange('currentPassword')}
                        InputProps={{
                          startAdornment: <Lock sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                        }}
                        sx={textFieldStyle(true)}
                      />

                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange('newPassword')}
                        InputProps={{
                          startAdornment: <Lock sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                        }}
                        sx={textFieldStyle(true)}
                      />

                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange('confirmPassword')}
                        InputProps={{
                          startAdornment: <Lock sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                        }}
                        sx={textFieldStyle(true)}
                      />

                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Button
                          onClick={handleSavePassword}
                          variant="contained"
                          fullWidth
                          sx={{
                            background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                            color: 'white',
                            fontWeight: 'bold',
                            py: 1.2,
                            borderRadius: 2,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5DBF61 0%, #4CAF50 100%)',
                            },
                          }}
                        >
                          Save Password
                        </Button>
                        <Button
                          onClick={handleCancelPasswordEdit}
                          variant="outlined"
                          fullWidth
                          sx={{
                            color: '#FF6B6B',
                            borderColor: '#FF6B6B',
                            fontWeight: 'bold',
                            py: 1.2,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: '#FF8888',
                              backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Lock sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
                        Keep your account secure
                      </Typography>
                      <Button
                        onClick={() => setEditPasswordMode(true)}
                        variant="outlined"
                        startIcon={<Edit />}
                        sx={{
                          color: '#2196F3',
                          borderColor: 'rgba(33, 150, 243, 0.5)',
                          fontWeight: 600,
                          px: 3,
                          '&:hover': {
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                          },
                        }}
                      >
                        Change Password
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Account Statistics */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    Account Statistics
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(33, 150, 243, 0.1)',
                          border: '1px solid rgba(33, 150, 243, 0.2)',
                        }}
                      >
                        <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 'bold', mb: 0.5 }}>
                          0
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Total Orders
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(76, 175, 80, 0.1)',
                          border: '1px solid rgba(76, 175, 80, 0.2)',
                        }}
                      >
                        <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 0.5 }}>
                          0
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Completed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(255, 152, 0, 0.1)',
                          border: '1px solid rgba(255, 152, 0, 0.2)',
                        }}
                      >
                        <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold', mb: 0.5 }}>
                          0
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Pending
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(156, 39, 176, 0.1)',
                          border: '1px solid rgba(156, 39, 176, 0.2)',
                        }}
                      >
                        <Typography variant="h5" sx={{ color: '#9C27B0', fontWeight: 'bold', mb: 0.5 }}>
                          New
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Member Status
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProfilePage;
