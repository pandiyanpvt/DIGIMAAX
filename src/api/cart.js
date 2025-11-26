import apiClient from './client';

/**
 * Add item to cart
 * @param {Object} itemData - Cart item data
 * @param {number} itemData.product_id - Product ID
 * @param {number} itemData.quantity - Quantity
 * @param {string} [itemData.custom_text] - Custom text
 * @param {string} [itemData.color] - Color
 * @param {string} [itemData.size] - Size
 * @param {string} [itemData.custom_image_url] - Custom image URL
 * @returns {Promise<{success: boolean, message: string, data: {cart_total: number}}>}
 */
export async function addCartItem(itemData) {
  const payload = {
    product_id: itemData.product_id,
    quantity: itemData.quantity || 1,
  };

  // Add optional customization fields
  if (itemData.custom_text) {
    payload.custom_text = itemData.custom_text;
  }
  if (itemData.color) {
    payload.color = itemData.color;
  }
  if (itemData.size) {
    payload.size = itemData.size;
  }
  if (itemData.custom_image_url) {
    payload.custom_image_url = itemData.custom_image_url;
  }

  const { data } = await apiClient.post('/api/cart/items', payload);
  return {
    success: data?.success ?? true,
    message: data?.message || 'Item added to cart',
    data: data?.data || {},
  };
}

/**
 * Get all cart items
 * @returns {Promise<{success: boolean, data: {user_id: number, items: Array, subtotal: number}}>}
 */
export async function getCart() {
  const { data } = await apiClient.get('/api/cart');
  return {
    success: data?.success ?? true,
    data: data?.data || {
      user_id: null,
      items: [],
      subtotal: 0,
    },
  };
}

/**
 * Get cart by user ID
 * @param {number|string} userId - User ID
 * @returns {Promise<{success: boolean, data: {user_id: number, items: Array, subtotal: number}}>}
 */
export async function getCartByUserId(userId) {
  if (userId === undefined || userId === null) {
    throw new Error('User id is required');
  }
  const { data } = await apiClient.get(`/api/cart/user/${userId}`);
  return {
    success: data?.success ?? true,
    data: data?.data || {
      user_id: userId,
      items: [],
      subtotal: 0,
    },
  };
}

/**
 * Remove item from cart
 * @param {number|string} itemId - Cart item ID
 * @param {number|string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function removeCartItem(itemId, userId) {
  if (itemId === undefined || itemId === null) {
    throw new Error('Item id is required');
  }
  if (userId === undefined || userId === null) {
    throw new Error('User id is required');
  }

  const { data } = await apiClient.delete(`/api/cart/items/${itemId}`, {
    data: { user_id: userId },
  });
  return {
    success: data?.success ?? true,
    message: data?.message || 'Item removed from cart',
  };
}

/**
 * Clear cart
 * @param {number|string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function clearCart(userId) {
  if (userId === undefined || userId === null) {
    throw new Error('User id is required');
  }

  const { data } = await apiClient.delete('/api/cart', {
    data: { user_id: userId },
  });
  return {
    success: data?.success ?? true,
    message: data?.message || 'Cart cleared',
  };
}

/**
 * Update cart item quantity
 * @param {number|string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function updateCartItem(itemId, quantity) {
  if (itemId === undefined || itemId === null) {
    throw new Error('Item id is required');
  }
  if (quantity === undefined || quantity === null || quantity < 1) {
    throw new Error('Valid quantity is required');
  }

  const { data } = await apiClient.put(`/api/cart/items/${itemId}`, {
    quantity,
  });
  return {
    success: data?.success ?? true,
    message: data?.message || 'Cart item updated',
  };
}

