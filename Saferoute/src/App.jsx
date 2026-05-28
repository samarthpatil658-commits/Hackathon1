// src/App.jsx

import React from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import "./App.css";


// ═══════════════════════════════════════
// CONTEXTS
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
// PAGES
// ═══════════════════════════════════════

import HomePage from "./pages/home";

import SOSPage from "./pages/sos";

import ContactsPage from "./pages/contacts";

import ReportsPage from "./pages/reports";

import SettingsPage from "./pages/settings";


// ═══════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════

import NavBar from "./components/layout/NavBar";

import SOSButton from "./components/sos/SOSButton";


// ═══════════════════════════════════════
// 404 PAGE
// ═══════════════════════════════════════

function NotFoundPage(){

  return (

    <div style={styles.notFound}>

      <h1>404</h1>

      <p>Page not found</p>

    </div>

  );

}


// ═══════════════════════════════════════
// APP
// ═══════════════════════════════════════

export default function App(){

  return (

    <ThemeProvider>

      <AuthProvider>

        <RouteProvider>

          <SOSProvider>

            <BrowserRouter>

              <div style={styles.app}>


                {/* ROUTES */}

                <Routes>

                  <Route
                    path="/"
                    element={<HomePage />}
                  />

                  <Route
                    path="/sos"
                    element={<SOSPage />}
                  />

                  <Route
                    path="/contacts"
                    element={<ContactsPage />}
                  />

                  <Route
                    path="/reports"
                    element={<ReportsPage />}
                  />

                  <Route
                    path="/settings"
                    element={<SettingsPage />}
                  />

                  <Route
                    path="*"
                    element={<NotFoundPage />}
                  />

                </Routes>


                {/* NAVBAR */}

                <NavBar />


                {/* FLOATING SOS BUTTON */}

                <SOSButton
                  floating={true}
                  size={80}
                />

              </div>

            </BrowserRouter>

          </SOSProvider>

        </RouteProvider>

      </AuthProvider>

    </ThemeProvider>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  app: {

    width:"100%",

    minHeight:"100vh",

    background:"var(--bg-primary)",

    color:"var(--text-primary)",

    overflowX:"hidden",

    position:"relative",

    paddingBottom:"90px"

  },

  notFound: {

    width:"100%",

    height:"100vh",

    display:"flex",

    flexDirection:"column",

    justifyContent:"center",

    alignItems:"center",

    background:"#0b0b10",

    color:"#ffffff",

    gap:"10px"

  }

};