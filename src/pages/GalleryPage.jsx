import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { getGalleryItems } from '../api/gallery';

const GalleryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchGallery = async () => {
      setLoading(true);
      setError('');
      try {
        const { items } = await getGalleryItems();
        if (isMounted) {
          setGalleryItems(
            items
              .filter((item) => Number(item?.is_active) === 1 && item?.img_url)
              .sort((a, b) => (b.id || 0) - (a.id || 0))
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || 'Failed to load gallery items. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => galleryItems, [galleryItems]);
  const hasItems = filteredItems.length > 0;
  const placeholderCount = isMobile ? 6 : 10;

  const handleImageClick = (item) => {
    if (!item?.img_url) return;
    const index = filteredItems.findIndex((i) => i.id === item.id);
    setSelectedImage({ ...item, index });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleNext = () => {
    if (!selectedImage || selectedImage.index === undefined) return;
    const nextIndex = (selectedImage.index + 1) % filteredItems.length;
    const nextItem = filteredItems[nextIndex];
    setSelectedImage({ ...nextItem, index: nextIndex });
  };

  const handlePrevious = () => {
    if (!selectedImage || selectedImage.index === undefined) return;
    const prevIndex = selectedImage.index === 0 ? filteredItems.length - 1 : selectedImage.index - 1;
    const prevItem = filteredItems[prevIndex];
    setSelectedImage({ ...prevItem, index: prevIndex });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #4B11A9 0%, #29085D 100%)',
        pt: { xs: 8, md: 10 },
        pb: 8,
      }}
    >
      <Container maxWidth={false} sx={{ px: 0 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6, px: { xs: 2, md: 4 } }}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
                mb: 2,
              }}
            >
              Our Gallery
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontFamily: 'sans-serif',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Explore our portfolio of creative projects and innovative solutions
            </Typography>
          </Box>
        </motion.div>

        {/* Category Filter removed */}

        {/* Gallery Grid - Uniform Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: { xs: 1, sm: 1.5, md: 2 },
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            {loading &&
              Array.from({ length: placeholderCount }).map((_, index) => (
                <Skeleton
                  key={`placeholder-${index}`}
                  variant="rounded"
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 1.2',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                  }}
                />
              ))}
            {!loading &&
              hasItems &&
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card
                    sx={{
                      background: 'transparent',
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.4s ease',
                      border: 'none',
                      boxShadow: '0 18px 45px rgba(9, 4, 31, 0.35)',
                      position: 'relative',
                    }}
                    onClick={() => handleImageClick(item)}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        px: 0,
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={item.img_url}
                        alt={item.name}
                        loading="lazy"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s ease',
                          filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.35))',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </Box>
                  </Card>
                </motion.div>
              ))}
            {!loading && !hasItems && (
              <Alert
                severity="info"
                sx={{
                  gridColumn: '1 / -1',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                }}
              >
                No gallery items available right now. Please check back soon.
              </Alert>
            )}
            {!!error && !loading && (
              <Alert
                severity="error"
                sx={{
                  gridColumn: '1 / -1',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  color: 'white',
                }}
              >
                {error}
              </Alert>
            )}
          </Box>
        </motion.div>

        {/* Image Modal with Glass Effect - Full Screen */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={false}
          fullWidth
          fullScreen
          PaperProps={{
            sx: {
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              margin: 0,
              borderRadius: 0,
              background: 'rgba(75, 17, 169, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: 'none',
              boxShadow: 'none',
              overflow: 'hidden',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            },
          }}
          slotProps={{
            backdrop: {
              sx: {
                background: 'rgba(41, 8, 93, 0.7)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              },
            },
          }}
        >
          <DialogContent 
            sx={{ 
              p: 0, 
              position: 'relative', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Navigation Buttons */}
            {filteredItems.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 10,
                    width: { xs: 40, md: 48 },
                    height: { xs: 40, md: 48 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-50%) scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 10,
                    width: { xs: 40, md: 48 },
                    height: { xs: 40, md: 48 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-50%) scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </>
            )}

            {selectedImage && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  height: '100%',
                  maxHeight: '95vh',
                  overflow: 'hidden',
                }}
              >
                {/* Image Container - Fits Viewport */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    p: { xs: 2, md: 3 },
                    width: '100%',
                    minHeight: 0,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={selectedImage.img_url}
                    alt={selectedImage.name}
                    sx={{
                      maxWidth: 'calc(100vw - 120px)',
                      maxHeight: 'calc(100vh - 200px)',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: 2,
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                      display: 'block',
                    }}
                  />
                </Box>

                {/* Image Info with Glass Effect */}
                <Box
                  sx={{
                    width: '100%',
                    flexShrink: 0,
                    p: { xs: 2, md: 3 },
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      mb: 1,
                      fontFamily: 'sans-serif',
                      textAlign: 'center',
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                    }}
                  >
                    {selectedImage.name}
                  </Typography>
                  {selectedImage.description && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        mb: 1,
                        fontFamily: 'sans-serif',
                        textAlign: 'center',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}
                    >
                      {selectedImage.description}
                    </Typography>
                  )}
                  {filteredItems.length > 1 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        display: 'block',
                        textAlign: 'center',
                        mt: 1,
                        fontFamily: 'sans-serif',
                      }}
                    >
                      {selectedImage.index !== undefined ? selectedImage.index + 1 : 1} / {filteredItems.length}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default GalleryPage;
