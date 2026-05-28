// src/components/ui/Toast.jsx

import { useEffect, useState } from "react";


// ═══════════════════════════════════════
// TOAST COMPONENT
// ═══════════════════════════════════════

export default function Toast({

  message = "",

  type = "info",

  duration = 3000,

  visible = false,

  onClose

}){

  const [show, setShow] =
    useState(visible);


  // ═══════════════════════════════════════
  // AUTO CLOSE
  // ═══════════════════════════════════════

  useEffect(() => {

    setShow(visible);

    if(visible){

      const timer = setTimeout(() => {

        setShow(false);

        if(onClose){

          onClose();

        }

      }, duration);

      return () => clearTimeout(timer);

    }

  }, [visible, duration, onClose]);


  // ═══════════════════════════════════════
  // TOAST COLORS
  // ═══════════════════════════════════════

  const toastStyles = {

    success:{

      background:
        "rgba(0,232,122,0.15)",

      border:
        "1px solid rgba(0,232,122,0.3)",

      color:"#00e87a",

      icon:"✅"

    },

    error:{

      background:
        "rgba(255,61,110,0.15)",

      border:
        "1px solid rgba(255,61,110,0.3)",

      color:"#ff3d6e",

      icon:"⚠️"

    },

    warning:{

      background:
        "rgba(255,184,48,0.15)",

      border:
        "1px solid rgba(255,184,48,0.3)",

      color:"#ffb830",

      icon:"🚨"

    },

    info:{

      background:
        "rgba(77,159,255,0.15)",

      border:
        "1px solid rgba(77,159,255,0.3)",

      color:"#4d9fff",

      icon:"ℹ️"

    }

  };


  const currentStyle =
    toastStyles[type] ||
    toastStyles.info;


  // ═══════════════════════════════════════
  // ANIMATIONS
  // ═══════════════════════════════════════

  useEffect(() => {

    const existing =
      document.getElementById(
        "toast-animation-style"
      );

    if(existing) return;


    const style =
      document.createElement("style");

    style.id =
      "toast-animation-style";

    style.innerHTML = `

      @keyframes toastSlideUp{

        0%{

          transform:
            translateX(-50%)
            translateY(50px);

          opacity:0;

        }

        100%{

          transform:
            translateX(-50%)
            translateY(0);

          opacity:1;

        }

      }

      @keyframes toastFadeOut{

        0%{

          opacity:1;

        }

        100%{

          opacity:0;

        }

      }

    `;

    document.head.appendChild(style);

  }, []);


  // ═══════════════════════════════════════
  // HIDE
  // ═══════════════════════════════════════

  if(!show) return null;


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div

      style={{

        ...styles.toast,

        background:
          currentStyle.background,

        border:
          currentStyle.border,

        color:
          currentStyle.color

      }}

    >


      {/* ICON */}

      <div style={styles.icon}>

        {currentStyle.icon}

      </div>


      {/* MESSAGE */}

      <div style={styles.message}>

        {message}

      </div>


      {/* CLOSE */}

      <button

        style={styles.closeBtn}

        onClick={() => {

          setShow(false);

          if(onClose){

            onClose();

          }

        }}

      >

        ✕

      </button>

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  toast: {

    position:"fixed",

    bottom:"100px",

    left:"50%",

    transform:"translateX(-50%)",

    minWidth:"280px",

    maxWidth:"90vw",

    padding:"14px 16px",

    borderRadius:"18px",

    display:"flex",

    alignItems:"center",

    gap:"12px",

    backdropFilter:"blur(14px)",

    zIndex:99999,

    animation:
      "toastSlideUp 0.3s ease",

    boxShadow:
      "0 10px 28px rgba(0,0,0,0.35)"

  },

  icon: {

    fontSize:"18px",

    flexShrink:0

  },

  message: {

    flex:1,

    fontSize:"14px",

    fontWeight:"600",

    lineHeight:"1.4"

  },

  closeBtn: {

    border:"none",

    background:"transparent",

    color:"inherit",

    fontSize:"14px",

    cursor:"pointer",

    opacity:0.7,

    flexShrink:0

  }

};