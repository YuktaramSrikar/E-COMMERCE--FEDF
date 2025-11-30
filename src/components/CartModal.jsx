import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useToasts } from "../contexts/ToastContext";
import PaymentGateway from "./PaymentGateway";

const modalBackdrop = {
  position: "fixed",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9998,
};

const modalStyle = {
  background: "#fff",
  borderRadius: 8,
  padding: 20,
  width: 520,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
};

const itemStyle = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #eee",
};

function parsePriceToNumber(priceText) {
  if (priceText == null || priceText === "") return 0;
  const cleaned = String(priceText).replace(/[^0-9.,]/g, "").replace(/,/g, "");
  const n = parseFloat(cleaned);
  // Return as integer (no decimals for INR prices)
  if (Number.isFinite(n) && n >= 0) {
    return Math.round(n);
  }
  return 0;
}

export default function CartModal({ onClose }) {
  const { cart, clearCart, removeItemById, updateQuantity } = useCart();
  const { show } = useToasts();
  const [showPayment, setShowPayment] = useState(false);

  // Helper function to get price from cart item - simplified and reliable
  function getItemPrice(item) {
    // First priority: use numeric price if it's valid (ensure it's an integer)
    if (typeof item.price === 'number' && item.price > 0 && isFinite(item.price)) {
      return Math.round(item.price); // Ensure integer
    }
    // Second priority: check for priceNum (in case it was stored)
    if (typeof item.priceNum === 'number' && item.priceNum > 0 && isFinite(item.priceNum)) {
      return Math.round(item.priceNum);
    }
    // Third priority: parse from priceText
    if (item.priceText) {
      const parsed = parsePriceToNumber(item.priceText);
      if (parsed > 0) {
        return parsed;
      }
    }
    // Fourth priority: parse from price if it's a string
    if (typeof item.price === 'string') {
      const parsed = parsePriceToNumber(item.price);
      if (parsed > 0) {
        return parsed;
      }
    }
    // If all else fails, return 0
    return 0;
  }

  // Helper function to get quantity from cart item
  function getItemQuantity(item) {
    const qty = item.quantity;
    return (qty && qty > 0 && isFinite(qty)) ? Math.floor(qty) : 1;
  }

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => {
    return sum + getItemQuantity(item);
  }, 0);
  
  // Calculate total price - ensure we're getting correct prices
  const totalPrice = cart.reduce((sum, item) => {
    const itemPrice = getItemPrice(item);
    const quantity = getItemQuantity(item);
    // Ensure both are integers before multiplication
    const roundedPrice = Math.round(itemPrice);
    const roundedQuantity = Math.floor(quantity);
    const itemTotal = roundedPrice * roundedQuantity;
    // Return integer sum
    return Math.round(sum + itemTotal);
  }, 0);

  function handleCheckout() {
    if (cart.length === 0) {
      show("Your cart is empty.", { type: "error" });
      return;
    }
    if (totalPrice <= 0) {
      show("Invalid cart total. Please refresh and try again.", { type: "error" });
      return;
    }
    setShowPayment(true);
  }

  function handlePaymentSuccess(order) {
    show(`Payment successful! Order ID: ${order.id}`, { duration: 4000 });
    onClose && onClose();
  }

  function handlePaymentClose() {
    setShowPayment(false);
  }

  if (showPayment) {
    return <PaymentGateway onClose={handlePaymentClose} onSuccess={handlePaymentSuccess} />;
  }

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: "#5a3d2b" }}>Your Cart</h3>
          <button 
            onClick={onClose} 
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: "pointer",
              fontSize: 20,
              color: "#666",
              padding: "4px 8px"
            }}
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: 16, color: "#666" }}>Your cart is empty.</p>
            <p style={{ fontSize: 14, color: "#999" }}>Add items from the product catalog to get started.</p>
          </div>
        ) : (
          <div>
            {cart.map((it) => {
              const quantity = getItemQuantity(it);
              const itemPrice = getItemPrice(it);
              // Ensure both are integers before multiplication
              const roundedPrice = Math.round(itemPrice);
              const roundedQuantity = Math.floor(quantity);
              const itemTotal = roundedPrice * roundedQuantity;
              
              return (
                <div key={it.id} style={itemStyle}>
                  <img
                    src={it.image}
                    alt={it.name}
                    style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 4 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#000", marginBottom: 4 }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {it.priceText || `Rs.${itemPrice}`} {quantity > 1 && `× ${quantity}`}
                    </div>
                    {itemTotal > 0 && (
                      <div style={{ fontSize: 12, color: "#5a3d2b", fontWeight: 600, marginTop: 2 }}>
                        Subtotal: Rs.{Math.round(itemTotal).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button
                        onClick={() => updateQuantity(it.id, quantity - 1)}
                        style={{ 
                          padding: "6px 10px", 
                          borderRadius: 4,
                          border: "1px solid #ddd",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: "bold"
                        }}
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <div style={{ 
                        minWidth: 40, 
                        textAlign: "center", 
                        color: "#000",
                        fontWeight: 600,
                        fontSize: 14
                      }}>
                        {quantity}
                      </div>
                      <button
                        onClick={() => updateQuantity(it.id, quantity + 1)}
                        style={{ 
                          padding: "6px 10px", 
                          borderRadius: 4,
                          border: "1px solid #ddd",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: "bold"
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <button 
                        onClick={() => {
                          removeItemById(it.id);
                          show(`${it.name} removed from cart`);
                        }} 
                        style={{ 
                          padding: "6px 12px", 
                          borderRadius: 4,
                          border: "1px solid #e74c3c",
                          background: "#fff",
                          color: "#e74c3c",
                          cursor: "pointer",
                          fontSize: 12
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: 20, padding: "16px", background: "#f9f9f9", borderRadius: 6, borderTop: "2px solid #5a3d2b" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14, color: "#666" }}>
                <span>Total Items:</span>
                <span style={{ fontWeight: 600, color: "#000" }}>{totalItems}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, color: "#5a3d2b", paddingTop: 8, borderTop: "1px solid #ddd" }}>
                <span>Total Amount:</span>
                <span>Rs. {Math.round(totalPrice).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear your cart?")) {
                    clearCart();
                    show("Cart cleared");
                  }
                }} 
                style={{ 
                  padding: "10px 16px", 
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: "#fff",
                  color: "#666",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Clear Cart
              </button>
              <button 
                onClick={handleCheckout} 
                style={{ 
                  padding: "10px 24px", 
                  background: "#5a3d2b", 
                  color: "#fff", 
                  borderRadius: 6, 
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16
                }}
                disabled={totalPrice <= 0}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
