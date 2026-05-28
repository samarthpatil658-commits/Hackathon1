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

     