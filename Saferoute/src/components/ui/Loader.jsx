// src/components/ui/Loader.jsx

import { useEffect } from "react";


// ═══════════════════════════════════════
// LOADER COMPONENT
// ═══════════════════════════════════════

export default function Loader({

  fullScreen = false,

  text = "Loading...",

  size = 70,

  color = "#00e87a",

  dark = true

}){


  // ═══════════════════════════════════════
  // INJECT ANIMATIONS
  // ═══════════════════════════════════════

  useEffect(() => {

    const existing =
      document.getElementById(
        "saferoute-loader-style"
      );

    if(existing) return;


    const style =
      document.createElement("style");

    style.id =
      "saferoute-loader-style";

    style.innerHTML = `

      @keyframes saferouteSpin{

        0%{
          transform:rotate(0deg);
        }

        100%{
          transform:rotate(360deg);
        }

      }

      @keyframes saferoutePulse{

        0%{
          transform:scale(0.9);
          opacity:0.7;
        }

        50%{
          transform:scale(1);
          opacity:1;
        }

        100%{
          transform:scale(0.9);
          opacity:0.7;
        }

      }

      @keyframes saferouteGlow{

        0%{
          box-shadow:
            0 0 0 rgba(0,232,122,0.2);
        }

        50%{
          box-shadow:
            0 0 22px rgba(0,232,122,0.5);
        }

        100%{
          box-shadow:
            0 0 0 rgba(0,232,122,0.2);
        }

      }

    `;

    document.head.appendChild(style);

  }, []);


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div

      style={{

        ...styles.wrapper,

        position:
          fullScreen
          ? "fixed"
          : "relative",

        inset:
          fullScreen
          ? 0
          : "unset",

        background:

          fullScreen

          ? dark

            ? "rgba(10,10,15,0.92)"

            : "rgba(255,255,255,0.92)"

          : "transparent"

      }}

    >


      {/* LOADER CONTAINER */}

      <div style={styles.loaderContainer}>


        {/* OUTER RING */}

        <div

          style={{

            ...styles.outerRing,

            width:size,

            height:size,

            borderColor:
              `${color}25`,

            borderTopColor:color

          }}

        />


        {/* INNER RING */}

        <div

          style={{

            ...styles.innerRing,

            width:size - 22,

            height:size - 22,

            borderColor:
              `${color}20`,

            borderBottomColor:color

          }}

        />


        {/* CENTER DOT */}

        <div

          style={{

            ...styles.centerDot,

            background:color

          }}

        />


        {/* PULSE EFFECT */}

        <div

          style={{

            ...styles.pulse,

            width:size + 12,

            height:size + 12,

            borderColor:
              `${color}35`

          }}

        />

      </div>


      {/* TEXT */}

      <div

        style={{

          ...styles.text,

          color:
            dark
            ? "#ffffff"
            : "#13131a"

        }}

      >

        {text}

      </div>

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  wrapper: {

    width:"100%",

    height:"100%",

    zIndex:99999,

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    justifyContent:"center",

    gap:"24px",

    backdropFilter:"blur(12px)"

  },

  loaderContainer: {

    position:"relative",

    display:"flex",

    alignItems:"center",

    justifyContent:"center"

  },

  outerRing: {

    position:"absolute",

    borderRadius:"50%",

    borderStyle:"solid",

    borderWidth:"5px",

    animation:
      "saferouteSpin 1.2s linear infinite"

  },

  innerRing: {

    position:"absolute",

    borderRadius:"50%",

    borderStyle:"solid",

    borderWidth:"4px",

    animation:
      "saferouteSpin 0.9s linear infinite reverse"

  },

  centerDot: {

    width:"16px",

    height:"16px",

    borderRadius:"50%",

    animation:
      "saferouteGlow 1.5s ease-in-out infinite"

  },

  pulse: {

    position:"absolute",

    borderRadius:"50%",

    border:"2px solid",

    animation:
      "saferoutePulse 1.8s ease-in-out infinite"

  },

  text: {

    fontSize:"15px",

    fontWeight:"700",

    letterSpacing:"0.4px",

    textAlign:"center"

  }

};