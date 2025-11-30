import React, { useState, useEffect } from "react";

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
  width: 800,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
};

const orderCardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  background: "#fafafa",
};

const itemRowStyle = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #eee",
};

export default function OrderHistory({ onClose }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem("handloom_orders") || "[]");
      // Sort by date, newest first
      const sorted = storedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sorted);
    } catch (e) {
      console.error("Failed to load orders:", e);
      setOrders([]);
    }
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Order History</h2>
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

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            <p style={{ fontSize: 18, marginBottom: 8 }}>No orders yet</p>
            <p style={{ fontSize: 14 }}>Your completed orders will appear here</p>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order.id} style={orderCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#5a3d2b", marginBottom: 4 }}>
                      Order ID: {order.id}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {formatDate(order.date)}
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 12px",
                    borderRadius: 12,
                    background: order.status === "completed" ? "#d4edda" : "#fff3cd",
                    color: order.status === "completed" ? "#155724" : "#856404",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    {order.status}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Items:</div>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={itemRowStyle}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {item.priceText} × {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        Rs. {Math.round((Math.round(item.price || 0)) * (Math.floor(item.quantity || 1))).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  borderTop: "1px solid #e0e0e0",
                  marginTop: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Billing Address:</div>
                    <div style={{ fontSize: 12 }}>
                      {order.billing?.name}<br />
                      {order.billing?.address}<br />
                      {order.billing?.city}, {order.billing?.state} {order.billing?.zip}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Total Amount:</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#5a3d2b" }}>
                      Rs. {Math.round(order.totalAmount || 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                      {order.totalItems} item{order.totalItems !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

