import React, { useState } from "react";
import { useToasts } from "../contexts/ToastContext";
import OrderHistory from "../components/OrderHistory";

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
  width: 600,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
  marginBottom: 12,
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontSize: 14,
  fontWeight: 600,
  color: "#333",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#5a3d2b",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  marginRight: 8,
};

const cancelButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#999",
};

function EditProfileModal({ onClose }) {
  const { show } = useToasts();
  const [profile, setProfile] = useState({
    name: "Artisan Name",
    region: "Varanasi, India",
    story: "I have been weaving handloom textiles for over 20 years, preserving traditional techniques passed down through generations.",
    email: "artisan@example.com",
    phone: "+91 9876543210",
  });

  function handleSave() {
    show("Profile updated successfully!");
    onClose();
  }

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Edit Profile & Story</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, color: "#666" }}>×</button>
        </div>
        <div>
          <label style={labelStyle}>Name</label>
          <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Region</label>
          <input type="text" value={profile.region} onChange={(e) => setProfile({...profile, region: e.target.value})} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Your Story</label>
          <textarea value={profile.story} onChange={(e) => setProfile({...profile, story: e.target.value})} style={{...inputStyle, minHeight: 120, resize: "vertical"}} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button style={cancelButtonStyle} onClick={onClose}>Cancel</button>
          <button style={buttonStyle} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function AddProductModal({ onClose }) {
  const { show } = useToasts();
  const [product, setProduct] = useState({
    name: "",
    category: "Saree",
    price: "",
    region: "",
    weave: "",
    description: "",
    stock: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!product.name || !product.price || !product.region) {
      show("Please fill in all required fields.", { duration: 3000 });
      return;
    }
    show(`Product "${product.name}" submitted for review!`);
    onClose();
  }

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Add New Product</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, color: "#666" }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input type="text" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})} style={inputStyle}>
              <option>Saree</option>
              <option>Dupatta</option>
              <option>Stole</option>
              <option>Home Décor</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Price (Rs.) *</label>
              <input type="number" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Stock Quantity</label>
              <input type="number" value={product.stock} onChange={(e) => setProduct({...product, stock: e.target.value})} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Region *</label>
            <input type="text" value={product.region} onChange={(e) => setProduct({...product, region: e.target.value})} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Weave Type</label>
            <input type="text" value={product.weave} onChange={(e) => setProduct({...product, weave: e.target.value})} style={inputStyle} placeholder="e.g., Banarasi, Ikat, Cotton" />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} style={{...inputStyle, minHeight: 100, resize: "vertical"}} placeholder="Describe your handloom product..." />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" style={cancelButtonStyle} onClick={onClose}>Cancel</button>
            <button type="submit" style={buttonStyle}>Submit for Review</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ArtisanDashboard() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const roleBadgeStyle = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    backgroundColor: "#f4d19b",
    fontSize: 12,
    marginBottom: 10,
  };
  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  };
  const primaryBtnStyle = {
    padding: "6px 12px",
    backgroundColor: "#5a3d2b",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  };
  const outlineBtnStyle = {
    padding: "4px 10px",
    backgroundColor: "transparent",
    color: "#5a3d2b",
    border: "1px solid #5a3d2b",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
  };
  return (
    <div>
      <div style={roleBadgeStyle}>Artisan · Manage handloom products</div>
      <h2>Artisan Workspace</h2>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3>My Story</h3>
          <p>Tell your weaving journey and traditions to buyers worldwide.</p>
          <button style={outlineBtnStyle} onClick={() => setShowEditProfile(true)}>Edit Profile & Story</button>
        </div>
        <div style={cardStyle}>
          <h3>Product Listings</h3>
          <p>Add and manage sarees, dupattas, stoles, and home décor.</p>
          <button style={primaryBtnStyle} onClick={() => setShowAddProduct(true)}>Add New Product</button>
        </div>
        <div style={cardStyle}>
          <h3>Inventory & Orders</h3>
          <p>Update stock and fulfill global orders efficiently.</p>
          <button style={primaryBtnStyle} onClick={() => setShowOrders(true)}>View Orders</button>
        </div>
      </div>
      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} />}
      {showOrders && <OrderHistory onClose={() => setShowOrders(false)} />}
    </div>
  );
}
export default ArtisanDashboard;