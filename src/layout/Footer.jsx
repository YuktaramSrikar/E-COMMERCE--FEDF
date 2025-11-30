import React from "react";
function Footer() {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: "10px 20px",
        backgroundColor: "#eee1cf",
        textAlign: "center",
        fontSize: 12,
      }}
    >
      © {new Date().getFullYear()} Handloom Global Marketplace · Celebrating
      artisans and heritage weaves.
    </footer>
  );
}
export default Footer;