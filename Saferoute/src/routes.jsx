// src/routes.jsx

import {

  BrowserRouter,

  Routes,

  Route,

  Navigate

} from "react-router-dom";


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

import LoginPage
from "./pages/LoginPage";

import RegisterPage
from "./pages/RegisterPage";

import NotFoundPage
from "./pages/NotFoundPage";


// ═══════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════

import NavBar
from "./components/layout/NavBar";

import SOSButton
from "./components/sos/SOSButton";


// ═══════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════

import { useAuth }
from "./context/AuthContext";


// ═══════════════════════════════════════
// PROTECTED ROUTE
// ═══════════════════════════════════════

function ProtectedRoute({

  children

}){

  const {

    authenticated,

    loading

  } = useAuth();


  // LOADING

  if(loading){

    return (

      <div style={styles.loadingScreen}>

        <div style={styles.loader} />

      </div>

    );

  }


  // NOT AUTHENTICATED

  if(!authenticated){

    return <Navigate to="/login" />;

  }


  return children;

}


// ═══════════════════════════════════════
// APP ROUTES
// ═══════════════════════════════════════

export default function AppRoutes(){

  return (

    <BrowserRouter>


      <div style={styles.appContainer}>


        {/* ROUTES */}

        <Routes>


          {/* PUBLIC */}

          <Route

            path="/login"

            element={<LoginPage />}

          />

          <Route

            path="/register"

            element={<RegisterPage />}

          />


          {/* PROTECTED */}

          <Route

            path="/"

            element={

              <ProtectedRoute>

                <HomePage />

              </ProtectedRoute>

            }

          />

          <Route

            path="/sos"

            element={

              <ProtectedRoute>

                <SOSPage />

              </ProtectedRoute>

            }

          />

          <Route

            path="/contacts"

            element={

              <ProtectedRoute>

                <ContactsPage />

              </ProtectedRoute>

            }

          />

          <Route

            path="/reports"

            element={

              <ProtectedRoute>

                <ReportsPage />

              </ProtectedRoute>

            }

          />

          <Route

            path="/future"

            element={

              <ProtectedRoute>

                <FuturePage />

              </ProtectedRoute>

            }

          />


          {/* 404 */}

          <Route

            path="*"

            element={<NotFoundPage />}

          />

        </Routes>


        {/* GLOBAL NAVBAR */}

        <NavBar />


        {/* GLOBAL SOS BUTTON */}

        <SOSButton

          floating={true}

          size={84}

          onTrigger={() => {

            console.log(
              "Emergency SOS Triggered"
            );

          }}

        />

      </div>

    </BrowserRouter>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  appContainer: {

    width:"100%",

    minHeight:"100vh",

    background:"var(--bg-primary)",

    position:"relative",

    overflowX:"hidden",

    paddingBottom:"90px"

  },

  loadingScreen: {

    width:"100%",

    height:"100vh",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    background:"#0b0b10"

  },

  loader: {

    width:"60px",

    height:"60px",

    borderRadius:"50%",

    border:"4px solid rgba(255,255,255,0.08)",

    borderTop:"4px solid #00e87a",

    animation:"spin 1s linear infinite"

  }

};