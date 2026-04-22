import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Debug: Log app startup
console.log("📱 App startup started - main.tsx loaded");

// Safety check: Ensure root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ CRITICAL: Root element not found! Check index.html for <div id='root'>");
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; background: #09090B; color: #fff;">
      <div style="text-align: center;">
        <h1>Application Error</h1>
        <p>Root element not found. Please refresh the page.</p>
      </div>
    </div>
  `;
} else {
  console.log("✅ Root element found, creating React app");
  try {
    createRoot(rootElement).render(<App />);
    console.log("✅ App rendered successfully");
  } catch (error) {
    console.error("❌ Failed to render app:", error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; background: #09090B; color: #fff;">
        <div style="text-align: center;">
          <h1>Rendering Error</h1>
          <p>Failed to initialize the application.</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">Refresh</button>
        </div>
      </div>
    `;
  }
}
