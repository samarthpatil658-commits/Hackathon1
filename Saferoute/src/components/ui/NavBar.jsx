// src/components/layout/NavBar.jsx

import { useLocation, useNavigate } from "react-router-dom";


// ═══════════════════════════════════════
// NAVBAR COMPONENT
// ═══════════════════════════════════════

export default function NavBar(){

  const navigate = useNavigate();

  const location = useLocation();


  // ═══════════════════════════════════════
  // NAVIGATION ITEMS
  // ═══════════════════════════════════════

  const navItems = [

    {

      id:"home",

      label:"Map",

      path:"/",

      icon:(active) => (

        <svg

          viewBox="0 0 24 24"

          fill="none"

          stroke="currentColor"

          strokeWidth="2"

          width="22"

          height="22"

          style={{

            color:
              active
              ? "#ff3d6e"
              : "#6e6e80"

          }}

        >

          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>

          <circle cx="12" cy="10" r="3"/>

        </svg>

      )

    },

    {

      id:"sos",

      label:"SOS",

      path:"/sos",

      icon:(active) => (

        <svg

          viewBox="0 0 24 24"

          fill="none"

          stroke="currentColor"

          strokeWidth="2"

          width="22"

          height="22"

          style={{

            color:
              active
              ? "#ff3d6e"
              : "#6e6e80"

          }}

        >

          <circle cx="12" cy="12" r="10"/>

          <path d="M12 8v4"/>

          <circle cx="12" cy="16" r="1"/>

        </svg>

      )

    },

    {

      id:"contacts",

      label:"Contacts",

      path:"/contacts",

      icon:(active) => (

        <svg

          viewBox="0 0 24 24"

          fill="none"

          stroke="currentColor"

          strokeWidth="2"

          width="22"

          height="22"

          style={{

            color:
              active
              ? "#ff3d6e"
              : "#6e6e80"

          }}

        >

          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>

          <circle cx="12" cy="7" r="4"/>

        </svg>

      )

    },

    {

      id:"reports",

      label:"Reports",

      path:"/reports",

      icon:(active) => (

        <svg

          viewBox="0 0 24 24"

          fill="none"

          stroke="currentColor"

          strokeWidth="2"

          width="22"

          height="22"

          style={{

            color:
              active
              ? "#ff3d6e"
              : "#6e6e80"

          }}

        >

          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>

          <line x1="12" y1="9" x2="12" y2="13"/>

          <circle cx="12" cy="17" r="1"/>

        </svg>

      )

    },

    {

      id:"future",

      label:"Roadmap",

      path:"/future",

      icon:(active) => (

        <svg

          viewBox="0 0 24 24"

          fill="none"

          stroke="currentColor"

          strokeWidth="2"

          width="22"

          height="22"

          style={{

            color:
              active
              ? "#ff3d6e"
              : "#6e6e80"

          }}

        >

          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>

        </svg>

      )

    }

  ];


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <nav style={styles.navbar}>


      {

        navItems.map(item => {

          const active =
            location.pathname === item.path;

          return (

            <button

              key={item.id}

              onClick={() =>
                navigate(item.path)
              }

              style={{

                ...styles.navItem,

                color:
                  active
                  ? "#ff3d6e"
                  : "#6e6e80"

              }}

            >


              {/* ICON */}

              <div style={styles.iconWrapper}>

                {item.icon(active)}

              </div>


              {/* LABEL */}

              <span

                style={{

                  ...styles.label,

                  color:
                    active
                    ? "#ff3d6e"
                    : "#7b7b8f"

                }}

              >

                {item.label}

              </span>


              {/* ACTIVE INDICATOR */}

              {

                active && (

                  <div style={styles.activeDot} />

                )

              }

            </button>

          );

        })

      }

    </nav>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  navbar: {

    position:"fixed",

    bottom:0,

    left:0,

    right:0,

    height:"74px",

    background:"rgba(19,19,26,0.96)",

    borderTop:
      "1px solid rgba(255,255,255,0.08)",

    backdropFilter:"blur(18px)",

    display:"flex",

    alignItems:"center",

    justifyContent:"space-around",

    zIndex:9999,

    padding:"0 6px"

  },

  navItem: {

    flex:1,

    height:"100%",

    border:"none",

    background:"transparent",

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    justifyContent:"center",

    gap:"5px",

    position:"relative",

    cursor:"pointer",

    transition:"0.2s"

  },

  iconWrapper: {

    display:"flex",

    alignItems:"center",

    justifyContent:"center"

  },

  label: {

    fontSize:"11px",

    fontWeight:"700",

    letterSpacing:"0.2px"

  },

  activeDot: {

    position:"absolute",

    top:"8px",

    width:"5px",

    height:"5px",

    borderRadius:"50%",

    background:"#ff3d6e",

    boxShadow:
      "0 0 10px rgba(255,61,110,0.8)"

  }

};