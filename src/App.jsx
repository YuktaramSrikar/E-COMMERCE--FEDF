import React, { useState } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import AdminDashboard from "./dashboards/AdminDashboard";
import ArtisanDashboard from "./dashboards/ArtisanDashboard";
import BuyerDashboard from "./dashboards/BuyerDashboard";
import MarketingDashboard from "./dashboards/MarketingDashboard";
import { ROLES } from "./roles";
function App() {
  const [role, setRole] = useState(ROLES.BUYER);
  let dashboard = null;
  if (role === ROLES.ADMIN) dashboard = <AdminDashboard />;
  else if (role === ROLES.ARTISAN) dashboard = <ArtisanDashboard />;
  else if (role === ROLES.BUYER) dashboard = <BuyerDashboard />;
  else if (role === ROLES.MARKETER) dashboard = <MarketingDashboard />;
  return (
    <>
      <Header currentRole={role} onRoleChange={setRole} />
      <main style={{ padding: 0, minHeight: "calc(100vh - 200px)" }}>
        {dashboard}
      </main>
      <Footer />
    </>
  );
}
export default App;