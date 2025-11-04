import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(new Map());
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const addToCart = (itemId, itemDetails = {}) => {
    setCartItems(prev => {
      const newMap = new Map(prev);
      const currentQuantity = newMap.get(itemId)?.quantity || 0;
      const requestedQuantity = itemDetails.quantity || 1;
      newMap.set(itemId, {
        ...itemDetails,
        quantity: currentQuantity + requestedQuantity,
        id: itemId,
      });
      return newMap;
    });
    setCartDrawerOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prev => {
        const newMap = new Map(prev);
        const item = newMap.get(itemId);
        if (item) {
          newMap.set(itemId, { ...item, quantity });
        }
        return newMap;
      });
    }
  };

  const getCartTotalItems = () => {
    return Array.from(cartItems.values()).reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotalPrice = () => {
    return Array.from(cartItems.values()).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems(new Map());
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
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
