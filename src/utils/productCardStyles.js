/**
 * Shared product card styling constants
 * Reusable across ShopPage, ProductDetailPage, and other components
 */

export const productCardStyles = {
  // CardContent spacing
  cardContent: {
    flexGrow: 1,
    p: 1.5,
    display: 'flex',
    flexDirection: 'column',
  },

  // Title typography
  title: {
    color: 'white',
    fontWeight: 700,
    fontSize: '0.85rem',
    mb: 0.75,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1,
  },

  // Description typography
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    mb: 1,
    minHeight: '32px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    flexGrow: 1,
    lineHeight: 1.4,
    fontSize: '0.75rem',
  },

  // Description spacer (when no description)
  descriptionSpacer: {
    flexGrow: 1,
    minHeight: '32px',
  },

  // Price typography
  price: {
    color: '#FFD700',
    fontWeight: 900,
    fontSize: '1rem',
  },

  // CardActions spacing
  cardActions: {
    p: 1.5,
    pt: 0,
    gap: 1,
  },

  // Image container aspect ratio
  imageContainer: {
    position: 'relative',
    width: '100%',
    pt: '75%',
    background: 'rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },

  // Image styling
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    p: 2,
  },
};

