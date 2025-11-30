import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "handloom_cart_v1";

function parsePriceToNumber(priceText) {
  if (priceText == null || priceText === "") return 0;
  // Remove all non-digit, non-dot, non-comma characters
  const cleaned = String(priceText).replace(/[^0-9.,]/g, "").replace(/,/g, "");
  const n = parseFloat(cleaned);
  // Return the number as an integer if it's valid and finite, otherwise 0
  // Ensure we're not dividing by 1000 - prices should be in full INR
  if (Number.isFinite(n) && n >= 0) {
    // Return as integer (no decimals for INR prices)
    return Math.round(n);
  }
  return 0;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      // Fix old cart items that don't have numeric prices
      return parsed.map((item) => {
        // Try to get price from numeric field first
        let price = 0;
        if (typeof item.price === 'number' && item.price > 0 && isFinite(item.price)) {
          price = Math.round(item.price); // Ensure integer
        } else if (item.priceText) {
          // Parse from priceText
          price = parsePriceToNumber(item.priceText);
        } else if (typeof item.price === 'string') {
          // Parse from price string
          price = parsePriceToNumber(item.price);
        }
        
        // Ensure quantity is valid
        const quantity = (item.quantity && item.quantity > 0 && isFinite(item.quantity)) 
          ? Math.floor(item.quantity) 
          : 1;
        
        return {
          ...item,
          price: price, // Always store as integer
          quantity: quantity,
        };
      });
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }, [cart]);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((it) => it.id === product.id);
      // Prefer priceNum if available, otherwise parse from price string
      let priceNumber = 0;
      if (typeof product.priceNum === 'number' && product.priceNum > 0 && isFinite(product.priceNum)) {
        priceNumber = Math.round(product.priceNum);
      } else if (typeof product.price === 'number' && product.price > 0 && isFinite(product.price)) {
        priceNumber = Math.round(product.price);
      } else {
        priceNumber = parsePriceToNumber(product.price || product.priceText || "0");
      }
      
      if (existing) {
        // Update existing item with current price from product and increment quantity
        return current.map((it) =>
          it.id === product.id 
            ? { 
                ...it, 
                quantity: (it.quantity || 1) + 1, 
                price: priceNumber, // Integer price
                priceText: product.price || product.priceText || `Rs.${priceNumber}` // Update priceText to match current product price
              } 
            : it
        );
      }
      // Create new item with price from product
      const newItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: priceNumber, // Integer price
        priceText: product.price || product.priceText || `Rs.${priceNumber}`,
        quantity: 1,
      };
      return [...current, newItem];
    });
  }

  function updateQuantity(id, quantity) {
    setCart((c) =>
      c.map((it) => {
        if (it.id === id) {
          // Ensure quantity is at least 1 and is a valid integer
          const newQuantity = Math.max(1, Math.floor(quantity || 1));
          return { ...it, quantity: newQuantity };
        }
        return it;
      })
    );
  }

  function removeItemById(id) {
    setCart((c) => c.filter((it) => it.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItemById, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
