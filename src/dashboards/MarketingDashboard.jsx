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

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
  background: "#fafafa",
};

function CreateCampaignModal({ onClose }) {
  const { show } = useToasts();
  const [campaign, setCampaign] = useState({
    name: "",
    type: "Festive",
    targetAudience: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!campaign.name || !campaign.startDate || !campaign.endDate) {
      show("Please fill in all required fields.", { duration: 3000 });
      return;
    }
    show(`Campaign "${campaign.name}" created successfully!`);
    onClose();
  }

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Create Marketing Campaign</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, color: "#666" }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Campaign Name *</label>
            <input type="text" value={campaign.name} onChange={(e) => setCampaign({...campaign, name: e.target.value})} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Campaign Type</label>
            <select value={campaign.type} onChange={(e) => setCampaign({...campaign, type: e.target.value})} style={inputStyle}>
              <option>Festive</option>
              <option>Sustainable</option>
              <option>Regional Showcase</option>
              <option>New Collection</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Target Audience</label>
            <input type="text" value={campaign.targetAudience} onChange={(e) => setCampaign({...campaign, targetAudience: e.target.value})} style={inputStyle} placeholder="e.g., Global buyers, Indian diaspora" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Start Date *</label>
              <input type="date" value={campaign.startDate} onChange={(e) => setCampaign({...campaign, startDate: e.target.value})} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>End Date *</label>
              <input type="date" value={campaign.endDate} onChange={(e) => setCampaign({...campaign, endDate: e.target.value})} style={inputStyle} required />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Budget (Rs.)</label>
            <input type="number" value={campaign.budget} onChange={(e) => setCampaign({...campaign, budget: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={campaign.description} onChange={(e) => setCampaign({...campaign, description: e.target.value})} style={{...inputStyle, minHeight: 100, resize: "vertical"}} placeholder="Campaign details and objectives..." />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" style={cancelButtonStyle} onClick={onClose}>Cancel</button>
            <button type="submit" style={buttonStyle}>Create Campaign</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ManageChannelsModal({ onClose }) {
  const { show } = useToasts();
  const [channels, setChannels] = useState([
    { id: 1, name: "Facebook", enabled: true, status: "Active" },
    { id: 2, name: "Instagram", enabled: true, status: "Active" },
    { id: 3, name: "Twitter", enabled: false, status: "Inactive" },
    { id: 4, name: "Email Newsletter", enabled: true, status: "Active" },
  ]);

  function toggleChannel(id) {
    setChannels(channels.map(ch => ch.id === id ? {...ch, enabled: !ch.enabled, status: ch.enabled ? "Inactive" : "Active"} : ch));
    const channel = channels.find(ch => ch.id === id);
    show(`${channel.name} ${channel.enabled ? "disabled" : "enabled"}.`);
  }

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Manage Marketing Channels</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, color: "#666" }}>×</button>
        </div>
        <div>
          {channels.map((channel) => (
            <div key={channel.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{channel.name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Status: <span style={{ color: channel.enabled ? "#28a745" : "#dc3545" }}>{channel.status}</span></div>
                </div>
                <button onClick={() => toggleChannel(channel.id)} style={{ padding: "6px 12px", backgroundColor: channel.enabled ? "#dc3545" : "#28a745", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  {channel.enabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: 16, background: "#f9f9f9", borderRadius: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Add New Channel</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="Channel name" style={{...inputStyle, marginBottom: 0, flex: 1}} />
            <button style={buttonStyle}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignMetricsModal({ onClose }) {
  const [metrics] = useState({
    totalCampaigns: 8,
    activeCampaigns: 3,
    totalReach: "2.5M",
    totalClicks: "45,230",
    conversionRate: "3.2%",
    topCampaign: "Festive Handloom Collection 2024",
    topMarket: "United States",
    roi: "+18%",
  });

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "#5a3d2b" }}>Campaign Performance Metrics</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, color: "#666" }}>×</button>
        </div>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Overview</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Total Campaigns</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#5a3d2b" }}>{metrics.totalCampaigns}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Active Campaigns</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#5a3d2b" }}>{metrics.activeCampaigns}</div>
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Reach & Engagement</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Total Reach</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#5a3d2b" }}>{metrics.totalReach}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Total Clicks</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#5a3d2b" }}>{metrics.totalClicks}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Conversion Rate</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#28a745" }}>{metrics.conversionRate}</div>
          </div>
        </div>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Top Performers</h3>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Top Campaign</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{metrics.topCampaign}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Top Market</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{metrics.topMarket}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>ROI</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#28a745" }}>{metrics.roi}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingDashboard() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showManageChannels, setShowManageChannels] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

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
      <div style={roleBadgeStyle}>
        Marketing Specialist · Promote handloom globally
      </div>
      <h2>Marketing Command Center</h2>
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3>Campaigns</h3>
          <p>Create global campaigns for festive and sustainable weaves.</p>
          <button style={primaryBtnStyle} onClick={() => setShowCreateCampaign(true)}>Create Campaign</button>
        </div>
        <div style={cardStyle}>
          <h3>Social & Email Outreach</h3>
          <p>Share collections on social platforms and newsletters.</p>
          <button style={outlineBtnStyle} onClick={() => setShowManageChannels(true)}>Manage Channels</button>
        </div>
        <div style={cardStyle}>
          <h3>Performance Analytics</h3>
          <p>Track clicks, conversions, and top markets.</p>
          <button style={primaryBtnStyle} onClick={() => setShowMetrics(true)}>View Campaign Metrics</button>
        </div>
      </div>
      {showCreateCampaign && <CreateCampaignModal onClose={() => setShowCreateCampaign(false)} />}
      {showManageChannels && <ManageChannelsModal onClose={() => setShowManageChannels(false)} />}
      {showMetrics && <CampaignMetricsModal onClose={() => setShowMetrics(false)} />}
    </div>
  );
}
export default MarketingDashboard;