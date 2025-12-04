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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  InputAdornment,
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
  Delete,
  Warning,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { updateUser as updateUserRequest, deleteUser as deleteUserRequest } from '../api/user';
import { forgotPassword, resetPassword } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUserSession, signOut, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  // Redirect to home if user is not authenticated (e.g., after sign out)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!user) return;

    const payload = {};
    if (profileData.firstName !== user.firstName) {
      payload.firstName = profileData.firstName;
    }
    if (profileData.lastName !== user.lastName) {
      payload.lastName = profileData.lastName;
    }
    if (profileData.email !== user.email) {
      payload.email = profileData.email;
    }
    if (profileData.phoneNumber !== (user.phoneNumber || '')) {
      payload.phoneNumber = profileData.phoneNumber;
    }

    if (Object.keys(payload).length === 0) {
      setSuccessMessage(t('profile.noChanges'));
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditMode(false);
      return;
    }

    try {
      const response = await updateUserRequest(user.id, payload);
      const updatedUser = response.user || {};

      setProfileData((prev) => ({
        ...prev,
        firstName: updatedUser.firstName ?? prev.firstName,
        lastName: updatedUser.lastName ?? prev.lastName,
        email: updatedUser.email ?? prev.email,
        phoneNumber: updatedUser.phoneNumber ?? prev.phoneNumber,
      }));

      updateUserSession({
        ...profileData,
        ...updatedUser,
        phoneNumber: updatedUser.phoneNumber ?? profileData.phoneNumber,
      });

      setEditMode(false);
      setSuccessMessage(response.message || t('profile.profileUpdated'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || t('profile.failedToUpdate');
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
    setEditMode(false);
  };

  const handleRequestOtp = async () => {
    if (!user?.email) {
      setErrorMessage(language === 'fr' ? 'E-mail introuvable. Veuillez contacter le support.' : 'Email not found. Please contact support.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      setSendingOtp(true);
      setErrorMessage('');
      setSuccessMessage('');
      await forgotPassword({ email: user.email });
      setOtpSent(true);
      setSuccessMessage(t('auth.otpSent'));
      setTimeout(() => setSuccessMessage(''), 8000);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || (language === 'fr' ? 'Échec de l\'envoi du code. Veuillez réessayer.' : 'Failed to send OTP. Please try again.');
      
      // Check if error is due to unverified email
      if (err?.response?.status === 403 || errorMessage.includes('not verified') || errorMessage.includes('verify')) {
        setErrorMessage(
          language === 'fr' 
            ? 'Votre adresse e-mail n\'est pas vérifiée. Veuillez d\'abord vérifier votre e-mail avant de réinitialiser votre mot de passe. Vérifiez votre boîte de réception pour l\'e-mail de vérification ou contactez le support.'
            : 'Your email address is not verified. Please verify your email first before resetting your password. Check your inbox for the verification email or contact support.'
        );
      } else {
        setErrorMessage(errorMessage);
      }
      
      setOtpSent(false); // Don't show OTP input if request failed
      setTimeout(() => setErrorMessage(''), 8000);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSavePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setErrorMessage(language === 'fr' ? 'Veuillez remplir tous les champs de mot de passe' : 'Please fill in all password fields');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!otpSent || !passwordData.otp) {
      setErrorMessage(t('profile.enterOtpFirst'));
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage(t('profile.passwordsDoNotMatch'));
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage(t('profile.passwordMinLength'));
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      setResettingPassword(true);
      setErrorMessage('');
      await resetPassword({
        email: user.email,
        otp: passwordData.otp,
        newPassword: passwordData.newPassword,
      });

      setEditPasswordMode(false);
      setOtpSent(false);
      setPasswordData({
        newPassword: '',
        confirmPassword: '',
        otp: '',
      });
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setSuccessMessage(t('profile.passwordChanged'));
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || t('profile.failedToChangePassword');
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setResettingPassword(false);
    }
  };

  const handleCancelPasswordEdit = () => {
    setPasswordData({
      newPassword: '',
      confirmPassword: '',
      otp: '',
    });
    setOtpSent(false);
    setEditPasswordMode(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setErrorMessage(t('profile.deleteConfirm'));
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      setDeletingAccount(true);
      setErrorMessage('');
      await deleteUserRequest(user.id);
      
      setDeleteDialogOpen(false);
      setSuccessMessage(t('profile.accountDeleted'));
      setTimeout(() => {
        signOut();
        navigate('/');
      }, 2000);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || t('profile.failedToDelete');
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 8000);
    } finally {
      setDeletingAccount(false);
    }
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

  // Hide page content if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

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
                      {t('profile.activeMember')}
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
                      {t('profile.emailVerified')}
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
                {t('profile.edit')} {t('profile.title')}
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
                {language === 'fr' ? 'Enregistrer Tous les Changements' : 'Save All Changes'}
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
                {t('common.cancel')}
              </Button>
            </Box>
          )}

          <Grid container spacing={3}>
            {/* Basic Information Card */}
            <Grid size={{ xs: 12, md: 6 }}>
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
                    {t('profile.personalInformation')}
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label={t('auth.firstName')}
                      value={profileData.firstName}
                      onChange={handleProfileChange('firstName')}
                      disabled={!editMode}
                      placeholder={editMode ? (language === 'fr' ? 'Entrez votre prénom' : 'Enter your first name') : ''}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />

                    <TextField
                      fullWidth
                      label={t('auth.lastName')}
                      value={profileData.lastName}
                      onChange={handleProfileChange('lastName')}
                      disabled={!editMode}
                      placeholder={editMode ? (language === 'fr' ? 'Entrez votre nom' : 'Enter your last name') : ''}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />

                    <TextField
                      fullWidth
                      label={t('auth.email')}
                      value={profileData.email}
                      onChange={handleProfileChange('email')}
                      disabled={!editMode}
                      type="email"
                      placeholder={editMode ? (language === 'fr' ? 'votre.email@exemple.com' : 'your.email@example.com') : ''}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />

                    <TextField
                      fullWidth
                      label={t('auth.phoneNumber')}
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange('phoneNumber')}
                      disabled={!editMode}
                      placeholder={editMode ? (language === 'fr' ? '+33 6 12 34 56 78' : '+1 (555) 000-0000') : (language === 'fr' ? 'Non fourni' : 'Not provided')}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                      }}
                      sx={textFieldStyle(editMode)}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Change Password Card */}
            <Grid size={{ xs: 12, md: 6 }}>
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
                    {t('profile.changePassword')}
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                  {editPasswordMode ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      {!otpSent ? (
                        <>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            {language === 'fr' 
                              ? `Pour changer votre mot de passe, nous enverrons un code de vérification à votre e-mail :` 
                              : `To change your password, we'll send a verification code to your email:`} <strong>{user?.email}</strong>
                          </Typography>
                          {errorMessage && (errorMessage.includes('not verified') || errorMessage.includes('verify')) && (
                            <Alert severity="warning" sx={{ mb: 2, backgroundColor: 'rgba(255, 152, 0, 0.1)', border: '1px solid rgba(255, 152, 0, 0.3)' }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                {language === 'fr' 
                                  ? 'Votre adresse e-mail doit d\'abord être vérifiée. Veuillez vérifier votre boîte de réception pour l\'e-mail de vérification, ou contactez le support si vous avez besoin d\'aide.'
                                  : 'Your email address needs to be verified first. Please check your inbox for the verification email, or contact support if you need help.'}
                              </Typography>
                            </Alert>
                          )}
                          <Button
                            onClick={handleRequestOtp}
                            variant="contained"
                            disabled={sendingOtp}
                            fullWidth
                            sx={{
                              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                              color: 'white',
                              fontWeight: 'bold',
                              py: 1.2,
                              borderRadius: 2,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                              },
                            }}
                          >
                            {sendingOtp ? t('auth.sendingOtp') : t('auth.sendVerificationCode')}
                          </Button>
                        </>
                      ) : (
                        <>
                          <TextField
                            fullWidth
                            label={t('auth.verificationCode')}
                            value={passwordData.otp}
                            onChange={handlePasswordChange('otp')}
                            placeholder={t('auth.enterOtp')}
                            InputProps={{
                              startAdornment: <Email sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                            }}
                            sx={textFieldStyle(true)}
                          />

                          <TextField
                            fullWidth
                            label={t('auth.newPassword')}
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange('newPassword')}
                            InputProps={{
                              startAdornment: <Lock sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
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
                            sx={textFieldStyle(true)}
                          />

                          <TextField
                            fullWidth
                            label={t('auth.confirmNewPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange('confirmPassword')}
                            InputProps={{
                              startAdornment: <Lock sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
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
                            sx={textFieldStyle(true)}
                          />

                          <Button
                            onClick={handleRequestOtp}
                            variant="outlined"
                            size="small"
                            sx={{
                              color: '#2196F3',
                              borderColor: 'rgba(33, 150, 243, 0.5)',
                              '&:hover': {
                                borderColor: '#2196F3',
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                              },
                            }}
                          >
                            {t('auth.resendOtp')}
                          </Button>
                        </>
                      )}

                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        {otpSent && (
                          <Button
                            onClick={handleSavePassword}
                            variant="contained"
                            disabled={resettingPassword}
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
                            {resettingPassword ? t('auth.resettingPassword') : t('auth.resetPassword')}
                          </Button>
                        )}
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
                          {t('common.cancel')}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Lock sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
                        {language === 'fr' ? 'Gardez votre compte sécurisé' : 'Keep your account secure'}
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
                        {t('profile.changePassword')}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </motion.div>
      </Container>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deletingAccount && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, rgba(16,6,36,0.95), rgba(7,2,18,0.98))',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ color: '#FF6B6B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning sx={{ fontSize: 28 }} />
          {t('profile.deleteAccount')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
            {t('profile.deleteAccountWarning')}
          </DialogContentText>
          
          <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <strong>{language === 'fr' ? 'Avertissement :' : 'Warning:'}</strong> {language === 'fr' 
                ? 'Si vous avez des commandes actives (en attente, en traitement ou expédiées), vous devez les terminer ou les annuler avant de supprimer votre compte.'
                : 'If you have active orders (pending, processing, or shipped), you must complete or cancel them before deleting your account.'}
            </Typography>
          </Alert>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
            {language === 'fr' 
              ? `Pour confirmer, veuillez taper` 
              : `To confirm, please type`} <strong style={{ color: '#FF6B6B' }}>DELETE</strong> {language === 'fr' ? 'dans la case ci-dessous :' : 'in the box below:'}
          </Typography>

          <TextField
            fullWidth
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder={t('profile.deleteConfirmPlaceholder')}
            disabled={deletingAccount}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 107, 107, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 107, 107, 0.7)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6B6B',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteConfirmText('');
            }}
            disabled={deletingAccount}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={deletingAccount || deleteConfirmText !== 'DELETE'}
            variant="contained"
            startIcon={deletingAccount ? null : <Delete />}
            sx={{
              backgroundColor: '#FF6B6B',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#FF5252',
              },
              '&:disabled': {
                backgroundColor: 'rgba(255, 107, 107, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {deletingAccount ? t('profile.deletingAccount') : t('profile.deleteAccountPermanently')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
