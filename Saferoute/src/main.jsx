// src/main.jsx

import React from "react";

import ReactDOM from "react-dom/client";

import {

  BrowserRouter

} from "react-router-dom";


// ═══════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════

import "./index.css";

import "./App.css";


// ═══════════════════════════════════════
// APP
// ═══════════════════════════════════════

import App from "./App";


// ═══════════════════════════════════════
// CONTEXT PROVIDERS
// ═══════════════════════════════════════

import {

  ThemeProvider

} from "./context/ThemeContext";

import {

  AuthProvider

} from "./context/AuthContext";

import {

  RouteProvider

} from "./context/RouteContext";

import {

  SOSProvider

} from "./context/SOSContext";


// ═══════════════════════════════════════
// ROOT RENDER
// ═══════════════════════════════════════

ReactDOM.createRoot(

  document.getElementById("root")

).render(

  <React.StrictMode>

    <BrowserRouter>

      <ThemeProvider>

        <AuthProvider>

          <RouteProvider>

            <SOSProvider>

              <App />

            </SOSProvider>

          </RouteProvider>

        </AuthProvider>

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>

);