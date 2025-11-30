import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useToasts } from "../contexts/ToastContext";

const modalBackdrop = {
  position: "fixed",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  borderRadius: 12,
  padding: 24,
  width: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
};

const formGroupStyle = {
  marginBottom: 16,
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontSize: 14,
  fontWeight: 600,
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const buttonStyle = {
  padding: "12px 24px",
  backgroundColor: "#5a3d2b",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 600,
  width: "100%",
  marginTop: 8,
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#999",
  marginTop: 8,
};

const summaryStyle = {
  background: "#f9f9f9",
  padding: 16,
  borderRadius: 8,
  marginBottom: 20,
  border: "1px solid #e0e0e0",
};

function saveOrderToStorage(order) {
  try {
    const existingOrders = JSON.parse(localStorage.getItem("handloom_orders") || "[]");
    existingOrders.push(order);
    localStorage.setItem("handloom_orders", JSON.stringify(existingOrders));
  } catch (e) {
    console.error("Failed to save order:", e);
  }
}

export default function PaymentGateway({ onClose, onSuccess }) {
  const { cart, clearCart } = useCart();
  const { show } = useToasts();
  
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "upi"
  
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    upiId: "",
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiProcessing, setUpiProcessing] = useState(false);

  // Helper function to parse price
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

  // Helper function to get price from cart item
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
    return 0;
  }

  // Helper function to get quantity from cart item
  function getItemQuantity(item) {
    const qty = item.quantity;
    return (qty && qty > 0 && isFinite(qty)) ? Math.floor(qty) : 1;
  }

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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateUpiId(upiId) {
    // UPI ID format: username@paytm, username@phonepe, username@ybl, username@okaxis, etc.
    const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiPattern.test(upiId);
  }

  function validateForm() {
    const newErrors = {};

    if (paymentMethod === "card") {
      // Card validation
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      if (!formData.cardName || formData.cardName.length < 3) {
        newErrors.cardName = "Please enter cardholder name";
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        newErrors.expiryMonth = "Please select expiry date";
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = "Please enter a valid CVV";
      }
    } else if (paymentMethod === "upi") {
      // UPI validation
      if (!formData.upiId || !validateUpiId(formData.upiId)) {
        newErrors.upiId = "Please enter a valid UPI ID (e.g., username@paytm, username@ybl)";
      }
    }

    // Billing validation
    if (!formData.billingName || formData.billingName.length < 2) {
      newErrors.billingName = "Please enter your name";
    }
    if (!formData.billingEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.billingEmail)) {
      newErrors.billingEmail = "Please enter a valid email";
    }
    if (!formData.billingPhone || formData.billingPhone.length < 10) {
      newErrors.billingPhone = "Please enter a valid phone number";
    }
    if (!formData.billingAddress || formData.billingAddress.length < 5) {
      newErrors.billingAddress = "Please enter your address";
    }
    if (!formData.billingCity) {
      newErrors.billingCity = "Please enter your city";
    }
    if (!formData.billingState) {
      newErrors.billingState = "Please enter your state";
    }
    if (!formData.billingZip || formData.billingZip.length < 5) {
      newErrors.billingZip = "Please enter a valid zip code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function formatCardNumber(value) {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  }

  function handleCardNumberChange(e) {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      show("Please fill in all required fields correctly", { type: "error" });
      return;
    }

    if (paymentMethod === "card") {
      setIsProcessing(true);
      // Simulate card payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsProcessing(false);
    } else if (paymentMethod === "upi") {
      setUpiProcessing(true);
      // Simulate UPI payment processing (show UPI app selection)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUpiProcessing(false);
    }

    // Create order object
    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        priceText: item.priceText,
        quantity: item.quantity,
      })),
      totalItems,
      totalAmount: Math.round(totalPrice), // Ensure integer
      payment: {
        method: paymentMethod === "card" ? "Card" : "UPI",
        ...(paymentMethod === "card" 
          ? { cardLast4: formData.cardNumber.slice(-4) }
          : { upiId: formData.upiId }
        ),
      },
      billing: {
        name: formData.billingName,
        email: formData.billingEmail,
        phone: formData.billingPhone,
        address: formData.billingAddress,
        city: formData.billingCity,
        state: formData.billingState,
        zip: formData.billingZip,
      },
      status: "completed",
    };

    // Save order to localStorage
    saveOrderToStorage(order);

    // Clear cart
    clearCart();

    show(`Payment successful! Order ID: ${order.id}`, { duration: 4000 });
    
    if (onSuccess) {
      onSuccess(order);
    }
    if (onClose) {
      onClose();
    }
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return month.toString().padStart(2, "0");
  });

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Payment Gateway</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 24,
              color: "#666",
              padding: 0,
              width: 30,
              height: 30,
            }}
          >
            ×
          </button>
        </div>

        <div style={summaryStyle}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: 16 }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Items:</span>
            <span>{totalItems}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "#5a3d2b" }}>
            <span>Total Amount:</span>
                <span>Rs. {Math.round(totalPrice).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 16, fontSize: 18, color: "#5a3d2b" }}>Payment Method</h3>
          
          {/* Payment Method Selection */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("card");
                setErrors({});
              }}
              style={{
                flex: 1,
                padding: "14px 20px",
                border: `2px solid ${paymentMethod === "card" ? "#5a3d2b" : "#ddd"}`,
                borderRadius: 8,
                background: paymentMethod === "card" ? "#5a3d2b" : "#fff",
                color: paymentMethod === "card" ? "#fff" : "#333",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              💳 Credit/Debit Card
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("upi");
                setErrors({});
              }}
              style={{
                flex: 1,
                padding: "14px 20px",
                border: `2px solid ${paymentMethod === "upi" ? "#5a3d2b" : "#ddd"}`,
                borderRadius: 8,
                background: paymentMethod === "upi" ? "#5a3d2b" : "#fff",
                color: paymentMethod === "upi" ? "#fff" : "#333",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              📱 UPI
            </button>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === "card" && (
            <>
              <h3 style={{ marginBottom: 16, fontSize: 18, color: "#5a3d2b" }}>Card Details</h3>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  style={{ ...inputStyle, borderColor: errors.cardNumber ? "#e74c3c" : "#ddd" }}
                />
                {errors.cardNumber && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.cardNumber}</span>}
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Cardholder Name *</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{ ...inputStyle, borderColor: errors.cardName ? "#e74c3c" : "#ddd" }}
                />
                {errors.cardName && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.cardName}</span>}
              </div>

              <div style={rowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Expiry Date *</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleChange}
                      style={{ ...inputStyle, flex: 1, borderColor: errors.expiryMonth ? "#e74c3c" : "#ddd" }}
                    >
                      <option value="">Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleChange}
                      style={{ ...inputStyle, flex: 1, borderColor: errors.expiryMonth ? "#e74c3c" : "#ddd" }}
                    >
                      <option value="">Year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.expiryMonth && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.expiryMonth}</span>}
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                    style={{ ...inputStyle, borderColor: errors.cvv ? "#e74c3c" : "#ddd" }}
                  />
                  {errors.cvv && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.cvv}</span>}
                </div>
              </div>
            </>
          )}

          {/* UPI Payment Form */}
          {paymentMethod === "upi" && (
            <>
              <h3 style={{ marginBottom: 16, fontSize: 18, color: "#5a3d2b" }}>UPI Payment</h3>
              
              <div style={{
                padding: 16,
                background: "#f8f9fa",
                borderRadius: 8,
                marginBottom: 20,
                border: "1px solid #e9ecef"
              }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
                  <strong>Supported UPI Apps:</strong>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Paytm", "PhonePe", "Google Pay", "BHIM", "Amazon Pay", "WhatsApp Pay"].map((app) => (
                    <div key={app} style={{
                      padding: "6px 12px",
                      background: "#fff",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#5a3d2b",
                      border: "1px solid #ddd"
                    }}>
                      {app}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Enter Your UPI ID *</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="username@paytm or username@ybl or username@phonepe"
                  style={{ 
                    ...inputStyle, 
                    borderColor: errors.upiId ? "#e74c3c" : "#ddd",
                    textTransform: "lowercase"
                  }}
                  onBlur={(e) => {
                    // Auto-format to lowercase
                    if (e.target.value) {
                      setFormData(prev => ({ ...prev, upiId: e.target.value.toLowerCase() }));
                    }
                  }}
                />
                {errors.upiId && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.upiId}</span>}
                <div style={{ marginTop: 8, fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                  <strong>Examples:</strong> yourname@paytm, yourname@ybl, yourname@phonepe, yourname@okaxis
                </div>
              </div>

              {upiProcessing && (
                <div style={{
                  padding: 24,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 12,
                  marginBottom: 16,
                  textAlign: "center",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📱</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    Opening UPI App...
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>
                    Please complete the payment in your UPI app
                  </div>
                  <div style={{ 
                    marginTop: 16, 
                    padding: "8px 16px", 
                    background: "rgba(255,255,255,0.2)", 
                    borderRadius: 6,
                    fontSize: 12
                  }}>
                    Amount: Rs. {Math.round(totalPrice).toLocaleString('en-IN')}
                  </div>
                </div>
              )}
            </>
          )}

          <h3 style={{ marginTop: 24, marginBottom: 16, fontSize: 18, color: "#5a3d2b" }}>Billing Information</h3>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              name="billingName"
              value={formData.billingName}
              onChange={handleChange}
              placeholder="John Doe"
              style={{ ...inputStyle, borderColor: errors.billingName ? "#e74c3c" : "#ddd" }}
            />
            {errors.billingName && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.billingName}</span>}
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                name="billingEmail"
                value={formData.billingEmail}
                onChange={handleChange}
                placeholder="john@example.com"
                style={{ ...inputStyle, borderColor: errors.billingEmail ? "#e74c3c" : "#ddd" }}
              />
              {errors.billingEmail && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.billingEmail}</span>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Phone *</label>
              <input
                type="tel"
                name="billingPhone"
                value={formData.billingPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                style={{ ...inputStyle, borderColor: errors.billingPhone ? "#e74c3c" : "#ddd" }}
              />
              {errors.billingPhone && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.billingPhone}</span>}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Address *</label>
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              placeholder="Street address"
              style={{ ...inputStyle, borderColor: errors.billingAddress ? "#e74c3c" : "#ddd" }}
            />
            {errors.billingAddress && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.billingAddress}</span>}
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                name="billingCity"
                value={formData.billingCity}
                onChange={handleChange}
                placeholder="City"
                style={{ ...inputStyle, borderColor: errors.billingCity ? "#e74c3c" : "#ddd" }}
              />
              {errors.billingCity && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.billingCity}</span>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>State *</label>
              <input
                type="text"
                name="billingState"
                value={formData.billingState}
                onChange={handleChange}
                placeholder="State"
                style={{ ...inputStyle, borderColor: errors.billingState ? "#e74c3c" : "#ddd" }}
              />
              {errors.billingState && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.billingState}</span>}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Zip Code *</label>
            <input
              type="text"
              name="billingZip"
              value={formData.billingZip}
              onChange={handleChange}
              placeholder="123456"
              maxLength="10"
              style={{ ...inputStyle, borderColor: errors.billingZip ? "#e74c3c" : "#ddd" }}
            />
            {errors.billingZip && <span style={{ color: "#e74c3c", fontSize: 12 }}>{errors.billingZip}</span>}
          </div>

          <div style={{ marginTop: 24, padding: 12, background: "#fff3cd", borderRadius: 6, fontSize: 12, color: "#856404" }}>
            <strong>Note:</strong> This is a demo payment gateway. No actual payment will be processed. All orders are stored locally in your browser.
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={isProcessing || upiProcessing}
          >
            {isProcessing 
              ? "Processing Payment..." 
              : upiProcessing
              ? "Waiting for UPI Payment..."
              : paymentMethod === "upi"
              ? `Pay via UPI - Rs. ${Math.round(totalPrice).toLocaleString('en-IN')}`
              : `Pay Rs. ${Math.round(totalPrice).toLocaleString('en-IN')}`
            }
          </button>
          <button
            type="button"
            onClick={onClose}
            style={cancelButtonStyle}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

