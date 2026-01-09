import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./AuthContext.jsx"; // Import AuthProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
