// src/components/ui/BottomSheet.jsx

import { useEffect, useRef, useState } from "react";


// ═══════════════════════════════════════
// BOTTOM SHEET COMPONENT
// ═══════════════════════════════════════

export default function BottomSheet({

  isOpen,

  onClose,

  title = "Bottom Sheet",

  height = "70vh",

  children,

  showHandle = true,

  closeOnBackdrop = true

}){

  const [dragging, setDragging] =
    useState(false);

  const [translateY, setTranslateY] =
    useState(0);

  const startYRef = useRef(0);

  const currentYRef = useRef(0);

  const sheetRef = useRef(null);


  // ═══════════════════════════════════════
  // HANDLE TOUCH START
  // ═══════════════════════════════════════

  const handleTouchStart = (e) => {

    setDragging(true);

    startYRef.current =
      e.touches[0].clientY;

  };


  // ═══════════════════════════════════════
  // HANDLE TOUCH MOVE
  // ═══════════════════════════════════════

  const handleTouchMove = (e) => {

    if(!dragging) return;

    currentYRef.current =
      e.touches[0].clientY;

    const delta =

      currentYRef.current -
      startYRef.current;


    // ONLY DRAG DOWN

    if(delta > 0){

      setTranslateY(delta);

    }

  };


  // ═══════════════════════════════════════
  // HANDLE TOUCH END
  // ═══════════════════════════════════════

  const handleTouchEnd = () => {

    setDragging(false);


    // CLOSE IF DRAGGED ENOUGH

    if(translateY > 140){

      onClose();

    }else{

      setTranslateY(0);

    }

  };


  // ═══════════════════════════════════════
  // ESC CLOSE
  // ═══════════════════════════════════════

  useEffect(() => {

    const handleKeyDown = (e) => {

      if(e.key === "Escape"){

        onClose();

      }

    };

    document.addEventListener(

      "keydown",

      handleKeyDown

    );

    return () => {

      document.removeEventListener(

        "keydown",

        handleKeyDown

      );

    };

  }, [onClose]);


  // ═══════════════════════════════════════
  // PREVENT BODY SCROLL
  // ═══════════════════════════════════════

  useEffect(() => {

    if(isOpen){

      document.body.style.overflow =
        "hidden";

    }else{

      document.body.style.overflow =
        "auto";

    }

    return () => {

      document.body.style.overflow =
        "auto";

    };

  }, [isOpen]);


  // ═══════════════════════════════════════
  // CLOSE IF NOT OPEN
  // ═══════════════════════════════════════

  if(!isOpen){

    return null;

  }


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div
      style={styles.overlay}
      onClick={() => {

        if(closeOnBackdrop){

          onClose();

        }

      }}
    >


      {/* SHEET */}

      <div

        ref={sheetRef}

        style={{

          ...styles.sheet,

          height,

          transform:
            `translateY(${translateY}px)`,

          transition:
            dragging
            ? "none"
            : "transform 0.25s ease"

        }}

        onClick={(e) =>
          e.stopPropagation()
        }

        onTouchStart={handleTouchStart}

        onTouchMove={handleTouchMove}

        onTouchEnd={handleTouchEnd}

      >


        {/* HANDLE */}

        {

          showHandle && (

            <div style={styles.handleWrapper}>

              <div style={styles.handle} />

            </div>

          )

        }


        {/* HEADER */}

        <div style={styles.header}>


          <div style={styles.title}>
            {title}
          </div>


          <button
            style={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>

        </div>


        {/* CONTENT */}

        <div style={styles.content}>

          {children}

        </div>

      </div>

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  overlay: {

    position:"fixed",

    inset:0,

    background:"rgba(0,0,0,0.58)",

    backdropFilter:"blur(10px)",

    zIndex:99999,

    display:"flex",

    alignItems:"flex-end",

    justifyContent:"center"

  },

  sheet: {

    width:"100%",

    maxWidth:"600px",

    background:"#13131a",

    borderTopLeftRadius:"30px",

    borderTopRightRadius:"30px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    display:"flex",

    flexDirection:"column",

    overflow:"hidden",

    boxShadow:
      "0 -10px 40px rgba(0,0,0,0.45)",

    animation:
      "bottomSheetSlideUp 0.25s ease"

  },

  handleWrapper: {

    width:"100%",

    display:"flex",

    justifyContent:"center",

    paddingTop:"12px",

    paddingBottom:"8px"

  },

  handle: {

    width:"56px",

    height:"6px",

    borderRadius:"999px",

    background:"rgba(255,255,255,0.18)"

  },

  header: {

    display:"flex",

    alignItems:"center",

    justifyContent:"space-between",

    padding:"18px 22px",

    borderBottom:
      "1px solid rgba(255,255,255,0.06)"

  },

  title: {

    color:"#ffffff",

    fontSize:"18px",

    fontWeight:"800"

  },

  closeBtn: {

    width:"38px",

    height:"38px",

    borderRadius:"12px",

    border:"none",

    background:"#1c1c26",

    color:"#8b8b9e",

    fontSize:"16px",

    cursor:"pointer"

  },

  content: {

    flex:1,

    overflowY:"auto",

    padding:"20px"

  }

};


// ═══════════════════════════════════════
// GLOBAL ANIMATION
// ═══════════════════════════════════════

if(typeof document !== "undefined"){

  const existing =
    document.getElementById(
      "bottom-sheet-animation"
    );

  if(!existing){

    const style =
      document.createElement("style");

    style.id =
      "bottom-sheet-animation";

    style.innerHTML = `

      @keyframes bottomSheetSlideUp{

        0%{

          transform:translateY(100%);

          opacity:0;

        }

        100%{

          transform:translateY(0);

          opacity:1;

        }

      }

    `;

    document.head.appendChild(style);

  }

}