import React, { useState } from "react";
import { ROLES } from "../roles";
import { useCart } from "../contexts/CartContext";
import CartModal from "../components/CartModal";

function Header({ currentRole, onRoleChange }) {
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const headerStyle = {
    backgroundColor: "#5a3d2b",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0, fontSize: 20 }}>Handloom Global Marketplace</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ marginRight: 8 }}>Role:</span>
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value)}
          style={{ padding: "4px 8px", borderRadius: 4, border: "none" }}
        >
          <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
          <option value={ROLES.ARTISAN}>{ROLES.ARTISAN}</option>
          <option value={ROLES.BUYER}>{ROLES.BUYER}</option>
          <option value={ROLES.MARKETER}>{ROLES.MARKETER}</option>
        </select>
        <>
        <button
          aria-label="View cart"
          title="View cart"
          style={{
            marginLeft: 8,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            padding: "6px 8px",
            borderRadius: 6,
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => setCartOpen(true)}
        >
          Cart
          {cart.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "#ff5a5f",
                color: "#fff",
                borderRadius: 99,
                padding: "2px 6px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {cart.length}
            </span>
          )}
        </button>
        </>
        {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
      </div>
    </header>
  );
}
export default Header;