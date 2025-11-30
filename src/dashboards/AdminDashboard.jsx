import React, { useState } from "react";
import { useToasts } from "../contexts/ToastContext";

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

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
  background: "#fafafa",
};

function PendingApprovalsModal({ onClose }) {
  const { show } = useToasts();
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", region: "Varanasi", status: "pending", submittedDate: "2024-01-15" },
    { id: 2, name: "Priya Sharma", email: "priya@example.com", region: "Kanchipuram", status: "pending", submittedDate: "2024-01-14" },
    { id: 3, name: "Amit Patel", email: "amit@example.com", region: "Sambhalpur", status: "pending", submittedDate: "2024-01-13" },
  ]);

  function handleApprove(id) {
    setPendingApprovals(pendingApprovals.filter(a => a.id !== id));
    show(`Artisan ${pendingApprovals.find(a => a.id === id)?.name} approved successfully.`);
  }

  function handleReject(id) {
    setPendingApprovals(pendingApprovals.filter(a => a.id !== id));
    show(`Artisan ${pendingApprovals.find(a => a.id === id)?.name} rejected.`);
  }

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Pending Artisan Approvals</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, color: "#666" }}>×</button>
        </div>
        {pendingApprovals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            <p>No pending approvals</p>
          </div>
        ) : (
          pendingApprovals.map((approval) => (
            <div key={approval.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{approval.name}</div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{approval.email}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Region: {approval.region}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Submitted: {approval.submittedDate}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleApprove(approval.id)} style={{ padding: "6px 12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Approve</button>
                  <button onClick={() => handleReject(approval.id)} style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Reject</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ReviewListingsModal({ onClose }) {
  const { show } = useToasts();
  const [listings, setListings] = useState([
    { id: 1, name: "Banarasi Silk Saree", artisan: "Rajesh Kumar", price: "Rs. 2500", status: "pending", submittedDate: "2024-01-15" },
    { id: 2, name: "Kanchipuram Cotton Saree", artisan: "Priya Sharma", price: "Rs. 1800", status: "pending", submittedDate: "2024-01-14" },
    { id: 3, name: "Handwoven Stole", artisan: "Amit Patel", price: "Rs. 1200", status: "pending", submittedDate: "2024-01-13" },
  ]);

  function handleApprove(id) {
    setListings(listings.filter(l => l.id !== id));
    show(`Product ${listings.find(l => l.id === id)?.name} approved.`);
  }

  function handleReject(id) {
    setListings(listings.filter(l => l.id !== id));
    show(`Product ${listings.find(l => l.id === id)?.name} rejected.`);
  }

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Product Listings Review</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, color: "#666" }}>×</button>
        </div>
        {listings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            <p>No pending listings to review</p>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{listing.name}</div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Artisan: {listing.artisan}</div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Price: {listing.price}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Submitted: {listing.submittedDate}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleApprove(listing.id)} style={{ padding: "6px 12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Approve</button>
                  <button onClick={() => handleReject(listing.id)} style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Reject</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AnalyticsModal({ onClose }) {
  const [analytics] = useState({
    totalSales: "Rs. 2,45,000",
    totalOrders: 156,
    topRegions: ["Varanasi", "Kanchipuram", "Sambhalpur"],
    topArtisans: ["Rajesh Kumar", "Priya Sharma", "Amit Patel"],
    monthlyGrowth: "+12%",
  });

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Platform Analytics & Reports</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, color: "#666" }}>×</button>
        </div>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Sales Overview</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Total Sales</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#5a3d2b" }}>{analytics.totalSales}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Total Orders</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#5a3d2b" }}>{analytics.totalOrders}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Monthly Growth</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#28a745" }}>{analytics.monthlyGrowth}</div>
          </div>
        </div>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Top Performing Regions</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {analytics.topRegions.map((region, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>{idx + 1}. {region}</li>
            ))}
          </ul>
        </div>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Top Performing Artisans</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {analytics.topArtisans.map((artisan, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>{idx + 1}. {artisan}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [showPendingApprovals, setShowPendingApprovals] = useState(false);
  const [showReviewListings, setShowReviewListings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

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
  return (
    <div>
      <div style={roleBadgeStyle}>Admin · Oversee platform operations</div>
      <h2>Admin Control Panel</h2>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3>User & Role Management</h3>
          <p>Approve artisans and manage roles for all users.</p>
          <button style={primaryBtnStyle} onClick={() => setShowPendingApprovals(true)}>View Pending Approvals</button>
        </div>
        <div style={cardStyle}>
          <h3>Content & Catalog Review</h3>
          <p>Verify handloom authenticity and approve product listings.</p>
          <button style={primaryBtnStyle} onClick={() => setShowReviewListings(true)}>Review Listings</button>
        </div>
        <div style={cardStyle}>
          <h3>Analytics & Reports</h3>
          <p>Monitor sales, regions, and top-performing artisans.</p>
          <button style={primaryBtnStyle} onClick={() => setShowAnalytics(true)}>View Analytics</button>
        </div>
      </div>
      {showPendingApprovals && <PendingApprovalsModal onClose={() => setShowPendingApprovals(false)} />}
      {showReviewListings && <ReviewListingsModal onClose={() => setShowReviewListings(false)} />}
      {showAnalytics && <AnalyticsModal onClose={() => setShowAnalytics(false)} />}
    </div>
  );
}
export default AdminDashboard;