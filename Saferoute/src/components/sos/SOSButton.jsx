// src/components/sos/SOSButton.jsx

import { useEffect, useRef, useState } from "react";


// ═══════════════════════════════════════
// SOS BUTTON COMPONENT
// ═══════════════════════════════════════

export default function SOSButton({

  onTrigger,

  size = 90,

  holdDuration = 3000,

  floating = true,

  emergencyMode = false

}){

  const [holding, setHolding] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [activated, setActivated] =
    useState(false);

  const intervalRef = useRef(null);

  const timeoutRef = useRef(null);


  // ═══════════════════════════════════════
  // START HOLD
  // ═══════════════════════════════════════

  const startHold = () => {

    if(activated) return;

    setHolding(true);

    setProgress(0);


    const startTime = Date.now();


    intervalRef.current = setInterval(() => {

      const elapsed =
        Date.now() - startTime;

      const percentage =
        Math.min(

          (elapsed / holdDuration) * 100,

          100

        );

      setProgress(percentage);

    }, 20);


    timeoutRef.current = setTimeout(() => {

      activateSOS();

    }, holdDuration);

  };


  // ═══════════════════════════════════════
  // CANCEL HOLD
  // ═══════════════════════════════════════

  const cancelHold = () => {

    if(activated) return;

    setHolding(false);

    setProgress(0);

    clearInterval(intervalRef.current);

    clearTimeout(timeoutRef.current);

  };


  // ═══════════════════════════════════════
  // ACTIVATE SOS
  // ═══════════════════════════════════════

  const activateSOS = () => {

    clearInterval(intervalRef.current);

    clearTimeout(timeoutRef.current);

    setActivated(true);

    setHolding(false);

    setProgress(100);


    // VIBRATION

    if(navigator.vibrate){

      navigator.vibrate([300,100,300,100,500]);

    }


    // CALLBACK

    if(onTrigger){

      onTrigger();

    }


    // RESET AFTER ANIMATION

    setTimeout(() => {

      setActivated(false);

      setProgress(0);

    }, 5000);

  };


  // ═══════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════

  useEffect(() => {

    return () => {

      clearInterval(intervalRef.current);

      clearTimeout(timeoutRef.current);

    };

  }, []);


  // ═══════════════════════════════════════
  // BUTTON SIZE
  // ═══════════════════════════════════════

  const buttonSize = `${size}px`;

  const innerSize = `${size - 16}px`;


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div

      style={{

        ...styles.wrapper,

        position:

          floating
          ? "fixed"
          : "relative"

      }}

    >


      {/* PULSE RINGS */}

      {(holding || activated || emergencyMode) && (

        <>

          <div
            style={{
              ...styles.pulseRing,
              width:buttonSize,
              height:buttonSize
            }}
          />

          <div
            style={{
              ...styles.pulseRing2,
              width:buttonSize,
              height:buttonSize
            }}
          />

        </>

      )}


      {/* PROGRESS RING */}

      <svg

        style={styles.progressSvg}

        width={size + 20}

        height={size + 20}

      >

        <circle

          cx={(size + 20) / 2}

          cy={(size + 20) / 2}

          r={(size - 6) / 2}

          fill="none"

          stroke="rgba(255,255,255,0.08)"

          strokeWidth="6"

        />

        <circle

          cx={(size + 20) / 2}

          cy={(size + 20) / 2}

          r={(size - 6) / 2}

          fill="none"

          stroke="#ff3d6e"

          strokeWidth="6"

          strokeLinecap="round"

          strokeDasharray={
            2 * Math.PI * ((size - 6) / 2)
          }

          strokeDashoffset={

            2 * Math.PI * ((size - 6) / 2)

            *

            (1 - progress / 100)

          }

          style={{

            transition:
              "stroke-dashoffset 0.02s linear"

          }}

          transform={`
            rotate(-90
            ${(size + 20) / 2}
            ${(size + 20) / 2})
          `}

        />

      </svg>


      {/* MAIN BUTTON */}

      <button

        onMouseDown={startHold}

        onMouseUp={cancelHold}

        onMouseLeave={cancelHold}

        onTouchStart={startHold}

        onTouchEnd={cancelHold}

        style={{

          ...styles.button,

          width:buttonSize,

          height:buttonSize,

          background:

            activated

            ? "#ff003c"

            : holding

              ? "#ff174f"

              : "#ff3d6e",

          transform:

            holding

            ? "scale(1.06)"

            : "scale(1)"

        }}

      >


        {/* INNER BUTTON */}

        <div

          style={{

            ...styles.innerButton,

            width:innerSize,

            height:innerSize

          }}

        >


          {/* ICON */}

          <div style={styles.icon}>

            🚨

          </div>


          {/* TEXT */}

          <div style={styles.text}>

            {

              activated

              ? "ALERT"

              : holding

                ? "HOLD"

                : "SOS"

            }

          </div>

        </div>

      </button>


      {/* LABEL */}

      <div style={styles.label}>

        {

          activated

          ? "Emergency Alert Sent"

          : "Hold for Emergency SOS"

        }

      </div>

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  wrapper: {

    bottom:"28px",

    right:"24px",

    zIndex:99999,

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    gap:"14px"

  },

  button: {

    position:"relative",

    border:"none",

    borderRadius:"50%",

    display:"flex",

    alignItems:"center",

    justifyContent:"center",

    cursor:"pointer",

    transition:"0.2s",

    boxShadow:
      "0 12px 32px rgba(255,61,110,0.45)",

    overflow:"hidden"

  },

  innerButton: {

    borderRadius:"50%",

    background:
      "linear-gradient(145deg,#ff5b85,#ff174f)",

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    justifyContent:"center",

    color:"#ffffff",

    boxShadow:
      "inset 0 2px 10px rgba(255,255,255,0.18)"

  },

  icon: {

    fontSize:"26px",

    marginBottom:"2px"

  },

  text: {

    fontSize:"14px",

    fontWeight:"800",

    letterSpacing:"1px"

  },

  label: {

    color:"#ffffff",

    fontSize:"13px",

    fontWeight:"600",

    background:"rgba(19,19,26,0.92)",

    padding:"10px 16px",

    borderRadius:"999px",

    backdropFilter:"blur(10px)",

    border:"1px solid rgba(255,255,255,0.06)"

  },

  progressSvg: {

    position:"absolute",

    top:"50%",

    left:"50%",

    transform:"translate(-50%,-50%)",

    pointerEvents:"none"

  },

  pulseRing: {

    position:"absolute",

    borderRadius:"50%",

    border:"2px solid rgba(255,61,110,0.4)",

    animation:"pulseSOS 1.6s infinite"

  },

  pulseRing2: {

    position:"absolute",

    borderRadius:"50%",

    border:"2px solid rgba(255,61,110,0.22)",

    animation:"pulseSOS2 2s infinite"

  }

};


// ═══════════════════════════════════════
// GLOBAL ANIMATIONS
// ═══════════════════════════════════════

if(typeof document !== "undefined"){

  const existing =
    document.getElementById(
      "sos-button-animation"
    );

  if(!existing){

    const style =
      document.createElement("style");

    style.id =
      "sos-button-animation";

    style.innerHTML = `

      @keyframes pulseSOS{

        0%{

          transform:scale(1);

          opacity:1;

        }

        100%{

          transform:scale(1.8);

          opacity:0;

        }

      }

      @keyframes pulseSOS2{

        0%{

          transform:scale(1);

          opacity:0.7;

        }

        100%{

          transform:scale(2.2);

          opacity:0;

        }

      }

    `;

    document.head.appendChild(style);

  }

}