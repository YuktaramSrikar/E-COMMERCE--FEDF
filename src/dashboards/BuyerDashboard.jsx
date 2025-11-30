import React, { useState, useMemo } from "react";
import { useCart } from "../contexts/CartContext";
import { useToasts } from "../contexts/ToastContext";
import OrderHistory from "../components/OrderHistory";

// Professional color palette
const colors = {
  primary: "#5a3d2b",
  primaryDark: "#4a2d1b",
  primaryLight: "#6b4a3a",
  accent: "#d4a574",
  accentLight: "#f4d19b",
  background: "#f8f9fa",
  surface: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#6c757d",
  border: "#e9ecef",
  success: "#28a745",
  shadow: "rgba(0, 0, 0, 0.08)",
  shadowHover: "rgba(0, 0, 0, 0.12)",
};

const sampleProducts = [
  {
    id: 1,
    name: "Banarasi Handloom Saree",
    category: "Saree",
    region: "Varanasi, India",
    weave: "Banarasi",
    price: "Rs.1085",
    priceNum: 1085,
    image: "src/images/banarasi.jpg",
    description: "Exquisite handwoven Banarasi saree with intricate zari work, perfect for special occasions.",
    inStock: true,
  },
  {
    id: 2,
    name: "Pochampally Ikat Dupatta",
    category: "Dupatta",
    region: "Telangana, India",
    weave: "Ikat",
    price: "Rs.879",
    priceNum: 879,
    image: "src/images/pochampally.jpg",
    description: "Beautiful handwoven Ikat dupatta with traditional geometric patterns from Pochampally.",
    inStock: true,
  },
  {
    id: 3,
    name: "Handwoven Cotton Stole",
    category: "Stole",
    region: "West Bengal, India",
    weave: "Cotton",
    price: "Rs.799",
    priceNum: 799,
    image: "src/images/handwoven.jpg",
    description: "Soft and elegant handwoven cotton stole, perfect for everyday wear.",
    inStock: true,
  },
  {
    id: 4,
    name: "Kanchipuram Silk Saree",
    category: "Saree",
    region: "Tamil Nadu, India",
    weave: "Silk",
    price: "Rs.1250",
    priceNum: 1250,
    image: "src/images/kanchipuram.jpg",
    description: "Luxurious pure silk Kanchipuram saree with traditional temple border designs.",
    inStock: true,
  },
  {
    id: 5,
    name: "Sambhalpuri Handloom Saree",
    category: "Saree",
    region: "Odisha, India",
    weave: "Sambhalpuri",
    price: "Rs.920",
    priceNum: 920,
    image: "src/images/sambhalpuri.jpg",
    description: "Authentic Sambhalpuri handloom saree with unique ikat patterns and vibrant colors.",
    inStock: true,
  },
  {
    id: 6,
    name: "Kashmiri Pashmina Stole",
    category: "Stole",
    region: "Kashmir, India",
    weave: "Pashmina",
    price: "Rs.1899",
    priceNum: 1899,
    image: "src/images/handwoven.jpg",
    description: "Luxurious pure pashmina stole from Kashmir, known for its warmth and softness.",
    inStock: true,
  },
  {
    id: 7,
    name: "Bandhani Cotton Dupatta",
    category: "Dupatta",
    region: "Rajasthan, India",
    weave: "Cotton",
    price: "Rs.750",
    priceNum: 750,
    image: "src/images/pochampally.jpg",
    description: "Vibrant Bandhani tie-dye dupatta with traditional patterns in bright colors.",
    inStock: true,
  },
];

const modalBackdrop = {
  position: "fixed",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9998,
};

const modalStyle = {
  background: colors.surface,
  borderRadius: 16,
  padding: 32,
  width: 800,
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};

function ProductDetailModal({ product, onClose, onAddToCart }) {
  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: colors.primary, fontSize: 28, fontWeight: 700 }}>Product Details</h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: "pointer", 
              fontSize: 28, 
              color: colors.textSecondary, 
              padding: 0, 
              width: 36, 
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = colors.border;
              e.target.style.color = colors.text;
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = colors.textSecondary;
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ position: "relative" }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ 
                width: "100%", 
                borderRadius: 12, 
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                objectFit: "cover"
              }} 
            />
            {product.inStock && (
              <div style={{
                position: "absolute",
                top: 16,
                right: 16,
                padding: "8px 16px",
                background: colors.success,
                color: "#fff",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(40, 167, 69, 0.3)"
              }}>
                ✓ In Stock
              </div>
            )}
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ 
                padding: "6px 12px", 
                borderRadius: 6, 
                background: colors.accentLight, 
                color: colors.primary, 
                fontSize: 12, 
                fontWeight: 600 
              }}>
                {product.category}
              </span>
            </div>
            <h3 style={{ margin: "0 0 16px 0", color: colors.text, fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
              {product.name}
            </h3>
            <div style={{ fontSize: 36, fontWeight: 700, color: colors.primary, marginBottom: 24 }}>
              {product.price}
            </div>
            <div style={{ marginBottom: 20, padding: 20, background: colors.background, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 12, fontSize: 14 }}>
                <span style={{ fontWeight: 600, color: colors.textSecondary, minWidth: 100 }}>📍 Region:</span>
                <span style={{ color: colors.text }}>{product.region}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 12, fontSize: 14 }}>
                <span style={{ fontWeight: 600, color: colors.textSecondary, minWidth: 100 }}>🧵 Weave:</span>
                <span style={{ color: colors.text }}>{product.weave}</span>
              </div>
            </div>
            <div style={{ marginBottom: 24, padding: 20, background: colors.background, borderRadius: 12 }}>
              <strong style={{ display: "block", marginBottom: 8, color: colors.text, fontSize: 16 }}>Description</strong>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: colors.textSecondary }}>
                {product.description}
              </p>
            </div>
            <button 
              onClick={() => { onAddToCart(product); onClose(); }} 
              style={{ 
                padding: "16px 32px", 
                backgroundColor: colors.primary, 
                color: "#fff", 
                border: "none", 
                borderRadius: 8, 
                cursor: "pointer", 
                fontSize: 16, 
                fontWeight: 600, 
                width: "100%",
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(90, 61, 43, 0.3)"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = colors.primaryDark;
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(90, 61, 43, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = colors.primary;
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(90, 61, 43, 0.3)";
              }}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuyerDashboard() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cart, addToCart } = useCart();
  const { show } = useToasts();

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...sampleProducts];

    // Filter by category
    if (activeFilter !== "All") {
      filtered = filtered.filter(p => p.category === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.region.toLowerCase().includes(query) ||
        p.weave.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [activeFilter, searchQuery, sortBy]);

  function handleAddToCart(product) {
    addToCart(product);
    show(`${product.name} added to cart.`);
  }

  function viewOrders() {
    setShowOrderHistory(true);
  }

  // Professional styling constants
  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const heroSectionStyle = {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    borderRadius: 16,
    padding: "48px 40px",
    marginBottom: 32,
    color: "#fff",
    boxShadow: "0 8px 24px rgba(90, 61, 43, 0.3)",
  };

  const cardStyle = {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: `1px solid ${colors.border}`,
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 24,
  };

  const primaryBtnStyle = {
    padding: "12px 20px",
    backgroundColor: colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.3s ease",
    width: "100%",
    boxShadow: "0 2px 8px rgba(90, 61, 43, 0.2)",
  };

  const outlineBtnStyle = {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: colors.primary,
    border: `2px solid ${colors.primary}`,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.3s ease",
  };

  const productCardStyle = {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: `1px solid ${colors.border}`,
    position: "relative",
  };

  const productImgStyle = {
    width: "100%",
    height: 280,
    objectFit: "cover",
    display: "block",
    background: colors.background,
  };

  const searchInputStyle = {
    width: "100%",
    padding: "14px 20px 14px 48px",
    border: `2px solid ${colors.border}`,
    borderRadius: 12,
    fontSize: 15,
    boxSizing: "border-box",
    transition: "all 0.3s",
    background: colors.surface,
  };

  const selectStyle = {
    padding: "12px 16px",
    border: `2px solid ${colors.border}`,
    borderRadius: 12,
    fontSize: 14,
    backgroundColor: colors.surface,
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.3s",
    minWidth: 200,
  };

  return (
    <div style={{ background: colors.background, minHeight: "100vh", padding: "32px 0" }}>
      {showOrderHistory && <OrderHistory onClose={() => setShowOrderHistory(false)} />}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
      
      <div style={containerStyle}>
        {/* Hero Section */}
        <div style={heroSectionStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, marginBottom: 8, letterSpacing: "0.5px" }}>
                HANDLOOM GLOBAL MARKETPLACE
              </div>
              <h1 style={{ margin: "0 0 12px 0", fontSize: 42, fontWeight: 800, lineHeight: 1.2 }}>
                Discover Authentic Handloom
              </h1>
              <p style={{ margin: 0, fontSize: 18, opacity: 0.95, lineHeight: 1.6 }}>
                Premium handwoven textiles from artisans across India
              </p>
            </div>
            <div style={{ 
              background: "rgba(255,255,255,0.15)", 
              backdropFilter: "blur(10px)",
              padding: "24px 32px", 
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Total Products</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{filteredAndSortedProducts.length}</div>
            </div>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "end" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 20 }}>
                🔍
              </div>
              <input
                type="text"
                placeholder="Search by name, region, or weave type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.accentLight}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                style={selectStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${colors.accentLight}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border;
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="default">🔄 Default</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="name">🔤 Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 20, fontWeight: 700, color: colors.text }}>
            Shop by Category
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {["All", "Saree", "Dupatta", "Stole", "Home Decor"].map((category) => {
              const isActive = activeFilter === category || (category === "All" && activeFilter === "All");
              const categoryIcons = {
                "All": "✨",
                "Saree": "👗",
                "Dupatta": "🧣",
                "Stole": "🎀",
                "Home Decor": "🏠"
              };
              return (
                <button
                  key={category}
                  style={{
                    ...outlineBtnStyle,
                    backgroundColor: isActive ? colors.primary : "transparent",
                    color: isActive ? "#fff" : colors.primary,
                    fontWeight: isActive ? "700" : "600",
                    padding: "10px 20px",
                    borderColor: isActive ? colors.primary : colors.primary,
                    boxShadow: isActive ? `0 4px 12px ${colors.primary}40` : "none",
                  }}
                  onClick={() => setActiveFilter(category === "All" ? "All" : category)}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = colors.accentLight;
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {categoryIcons[category]} {category === "All" ? "All Products" : category + "s"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div style={cardStyle}>
            <div style={{ textAlign: "center", padding: "80px 20px", color: colors.textSecondary }}>
              <div style={{ fontSize: 64, marginBottom: 24 }}>🔍</div>
              <h3 style={{ marginBottom: 12, color: colors.text, fontSize: 24, fontWeight: 700 }}>
                No products found
              </h3>
              <p style={{ marginBottom: 24, fontSize: 16 }}>
                Try adjusting your search or filter criteria
              </p>
              <button
                style={{
                  ...primaryBtnStyle,
                  width: "auto",
                  padding: "12px 32px",
                }}
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All");
                  setSortBy("default");
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = colors.primaryDark;
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = colors.primary;
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.text }}>
                {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 ? "s" : ""} Available
              </h3>
            </div>
            <div style={gridStyle}>
              {filteredAndSortedProducts.map((p) => (
                <div
                  key={p.id}
                  style={productCardStyle}
                  onClick={() => setSelectedProduct(p)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={p.image} alt={p.name} style={productImgStyle} />
                    {p.inStock && (
                      <div style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        padding: "6px 12px",
                        background: colors.success,
                        color: "#fff",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        boxShadow: "0 2px 8px rgba(40, 167, 69, 0.4)",
                        letterSpacing: "0.5px"
                      }}>
                        ✓ IN STOCK
                      </div>
                    )}
                    <div style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 40,
                      height: 40,
                      background: "rgba(255,255,255,0.95)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      transition: "all 0.3s",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(p);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.background = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                    }}
                    title="Quick View"
                    >
                      <span style={{ fontSize: 18 }}>👁️</span>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ 
                        padding: "4px 10px", 
                        borderRadius: 6, 
                        background: colors.accentLight, 
                        color: colors.primary, 
                        fontSize: 11, 
                        fontWeight: 700,
                        letterSpacing: "0.5px"
                      }}>
                        {p.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 style={{ 
                      margin: "0 0 12px 0", 
                      fontSize: 18, 
                      fontWeight: 700,
                      color: colors.text, 
                      lineHeight: 1.4,
                      minHeight: 50,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {p.name}
                    </h3>
                    <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
                      <div style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>📍</span>
                        <span>{p.region}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span>🧵</span>
                        <span>{p.weave}</span>
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: 24, 
                      fontWeight: 800, 
                      color: colors.primary, 
                      marginBottom: 16,
                      fontFamily: "system-ui, -apple-system, sans-serif"
                    }}>
                      {p.price}
                    </div>
                    <button
                      style={{
                        ...primaryBtnStyle,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = colors.primaryDark;
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(90, 61, 43, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = colors.primary;
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 8px rgba(90, 61, 43, 0.2)";
                      }}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Orders Section */}
        <div style={{
          ...cardStyle,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          color: "#fff",
          marginTop: 32,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 24, fontWeight: 700 }}>
                📦 Orders & Feedback
              </h3>
              <p style={{ margin: 0, fontSize: 16, opacity: 0.95 }}>
                Track your orders and support artisans with reviews
              </p>
            </div>
            <button
              style={{
                padding: "14px 32px",
                backgroundColor: "#fff",
                color: colors.primary,
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 700,
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
              onClick={viewOrders}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
            >
              View My Orders →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BuyerDashboard;