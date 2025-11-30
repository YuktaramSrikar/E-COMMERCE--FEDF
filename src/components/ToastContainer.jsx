import React from "react";
import { useToasts } from "../contexts/ToastContext";

const containerStyle = {
  position: "fixed",
  right: 16,
  top: 16,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const toastStyle = {
  background: "rgba(0,0,0,0.85)",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 6,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  maxWidth: 320,
};

export default function ToastContainer() {
  const { toasts, remove } = useToasts();
  return (
    <div style={containerStyle} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} style={toastStyle} onClick={() => remove(t.id)}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
