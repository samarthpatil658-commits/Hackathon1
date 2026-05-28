// src/App.jsx

import {

  BrowserRouter,

  Routes,

  Route

} from "react-router-dom";


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
// LAYOUT
// ═══════════════════════════════════════

import NavBar
from "./components/layout/NavBar";


// ═══════════════════════════════════════
// PAGES
// ═══════════════════════════════════════

import HomePage
from "./pages/HomePage";

import SOSPage
from "./pages/SOSPage";

import ContactsPage
from "./pages/ContactsPage";

import ReportsPage
from "./pages/ReportsPage";

import FuturePage
from "./pages/FuturePage";

import NotFoundPage
from "./pages/NotFoundPage";


// ═══════════════════════════════════════
// GLOBAL UI
// ═══════════════════════════════════════

import SOSButton
from "./components/sos/SOSButton";

import Toast
from "./components/ui/Toast";


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

                    path="/future"

                    element={<FuturePage />}

                  />

                  <Route

                    path="*"

                    element={<NotFoundPage />}

                  />

                </Routes>


                {/* GLOBAL NAVBAR */}

                <NavBar />


                {/* FLOATING SOS */}

                <SOSButton

                  floating={true}

                  size={82}

                  onTrigger={() => {

                    console.log(

                      "Global SOS Triggered"

                    );

                  }}

                />


                {/* GLOBAL TOAST */}

                <Toast

                  visible={false}

                  message=""

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

    paddingBottom:"90px",

    transition:
      "background var(--animation-speed) ease"

  }

};