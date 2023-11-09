import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createRoot } from "react-dom/client";

ReactDOM.createRoot(document.getElementById('branding')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const rootElement = document.getElementById("branding");
const imageSrc = rootElement.dataset.images || null;

if (imageSrc) {
  const root = createRoot(rootElement);
  root.render(<App images={imageSrc} />);
}