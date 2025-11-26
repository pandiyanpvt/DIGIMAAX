import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  addCartItem,
  getCart,
  getCartByUserId,
  removeCartItem as removeCartItemAPI,
  clearCart as clearCartAPI,
  updateCartItem as updateCartItemAPI,
} from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Transform API cart item to UI format
 * @param {Object} apiItem - Cart item from API
 * @returns {Object} - UI format cart item
 */
const transformApiItemToUI = (apiItem) => {
  return {
    id: apiItem.id, // Cart item ID
    product_id: apiItem.product_id,
    title: apiItem.product?.title || '',
    image: apiItem.product?.image || '',
    price: parseFloat(apiItem.price || apiItem.product?.price || 0),
    quantity: apiItem.quantity || 1,
    color: apiItem.color || null,
    size: apiItem.size || null,
    customText: apiItem.custom_text || null,
    customImageUrl: apiItem.custom_image_url || null,
    subtotal: parseFloat(apiItem.subtotal || 0),
  };
};

/**
 * Transform UI cart item to API format for adding to cart
 * @param {Object} itemDetails - UI format cart item
 * @returns {Object} - API format cart item
 */
const transformUIToApiItem = (productId, itemDetails = {}) => {
  const payload = {
    product_id: productId,
    quantity: itemDetails.quantity || 1,
  };

  if (itemDetails.customText || itemDetails.custom_text) {
    payload.custom_text = itemDetails.customText || itemDetails.custom_text;
  }
  if (itemDetails.color) {
    payload.color = itemDetails.color;
  }
  if (itemDetails.size) {
    payload.size = itemDetails.size;
  }
  if (itemDetails.customImageUrl || itemDetails.custom_image_url) {
    payload.custom_image_url = itemDetails.customImageUrl || itemDetails.custom_image_url;
  }

  return payload;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(new Map());
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Fetch cart from API when user is authenticated
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setCartItems(new Map());
      return;
    }

    setCartLoading(true);
    setCartError(null);
    try {
      const result = await getCartByUserId(user.id);
      if (result && result.success && result.data?.items) {
        const itemsMap = new Map();
        result.data.items.forEach((item) => {
          try {
            const uiItem = transformApiItemToUI(item);
            if (uiItem && uiItem.id) {
              itemsMap.set(uiItem.id, uiItem);
            }
          } catch (err) {
            console.error('Error transforming cart item:', err, item);
          }
        });
        setCartItems(itemsMap);
      } else {
        setCartItems(new Map());
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartError(error.message || 'Failed to load cart');
      // Don't crash - just set empty cart
      setCartItems(new Map());
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Load cart when user authenticates
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, itemDetails = {}) => {
    if (!isAuthenticated || !user?.id) {
      setCartError('Please sign in to add items to cart');
      return;
    }

    setCartLoading(true);
    setCartError(null);
    try {
      const payload = transformUIToApiItem(productId, itemDetails);
      const result = await addCartItem(payload);

      if (result.success) {
        // Refresh cart after adding item
        await fetchCart();
        setCartDrawerOpen(true);
      } else {
        setCartError(result.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setCartError(error.message || 'Failed to add item to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!isAuthenticated || !user?.id) {
      setCartError('Please sign in to remove items from cart');
      return;
    }

    setCartLoading(true);
    setCartError(null);
    try {
      const result = await removeCartItemAPI(cartItemId, user.id);

      if (result.success) {
        // Optimistically update UI
        setCartItems((prev) => {
          const newMap = new Map(prev);
          newMap.delete(cartItemId);
          return newMap;
        });
        // Refresh cart to ensure sync
        await fetchCart();
      } else {
        setCartError(result.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setCartError(error.message || 'Failed to remove item from cart');
      // Refresh cart on error
      await fetchCart();
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartQuantity = async (cartItemId, quantity) => {
    if (!isAuthenticated || !user?.id) {
      setCartError('Please sign in to update cart');
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    setCartLoading(true);
    setCartError(null);
    try {
      const result = await updateCartItemAPI(cartItemId, quantity);

      if (result.success) {
        // Optimistically update UI
        setCartItems((prev) => {
          const newMap = new Map(prev);
          const item = newMap.get(cartItemId);
          if (item) {
            newMap.set(cartItemId, { ...item, quantity });
          }
          return newMap;
        });
        // Refresh cart to ensure sync
        await fetchCart();
      } else {
        setCartError(result.message || 'Failed to update cart item');
      }
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      setCartError(error.message || 'Failed to update cart item');
      // Refresh cart on error
      await fetchCart();
    } finally {
      setCartLoading(false);
    }
  };

  const getCartTotalItems = () => {
    return Array.from(cartItems.values()).reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  const getCartTotalPrice = () => {
    return Array.from(cartItems.values()).reduce((sum, item) => {
      const itemPrice = parseFloat(item.price || 0);
      const itemQuantity = parseInt(item.quantity || 0, 10);
      return sum + itemPrice * itemQuantity;
    }, 0);
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user?.id) {
      setCartError('Please sign in to clear cart');
      return;
    }

    setCartLoading(true);
    setCartError(null);
    try {
      const result = await clearCartAPI(user.id);

      if (result.success) {
        setCartItems(new Map());
      } else {
        setCartError(result.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setCartError(error.message || 'Failed to clear cart');
      // Refresh cart on error
      await fetchCart();
    } finally {
      setCartLoading(false);
    }
  };

  const value = {
    cartItems,
    cartDrawerOpen,
    setCartDrawerOpen,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotalItems,
    getCartTotalPrice,
    clearCart,
    cartLoading,
    cartError,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
