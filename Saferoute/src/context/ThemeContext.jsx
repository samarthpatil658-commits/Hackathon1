// src/context/ThemeContext.jsx

import {

  createContext,

  useContext,

  useEffect,

  useMemo,

  useState

} from "react";


// ═══════════════════════════════════════
// THEME CONTEXT
// ═══════════════════════════════════════

const ThemeContext =
  createContext(null);


// ═══════════════════════════════════════
// THEME PROVIDER
// ═══════════════════════════════════════

export function ThemeProvider({

  children

}){

  const [theme, setTheme] =
    useState("dark");

  const [accentColor, setAccentColor] =
    useState("#00e87a");

  const [glassEffect, setGlassEffect] =
    useState(true);

  const [animations, setAnimations] =
    useState(true);


  // ═══════════════════════════════════════
  // LOAD SAVED THEME
  // ═══════════════════════════════════════

  useEffect(() => {

    try{

      const savedTheme =

        localStorage.getItem(
          "saferoute-theme"
        );

      const savedAccent =

        localStorage.getItem(
          "saferoute-accent"
        );

      const savedGlass =

        localStorage.getItem(
          "saferoute-glass"
        );

      const savedAnimations =

        localStorage.getItem(
          "saferoute-animations"
        );


      if(savedTheme){

        setTheme(savedTheme);

      }

      if(savedAccent){

        setAccentColor(savedAccent);

      }

      if(savedGlass){

        setGlassEffect(
          JSON.parse(savedGlass)
        );

      }

      if(savedAnimations){

        setAnimations(
          JSON.parse(savedAnimations)
        );

      }

    }catch(err){

      console.error(err);

    }

  }, []);


  // ═══════════════════════════════════════
  // APPLY CSS VARIABLES
  // ═══════════════════════════════════════

  useEffect(() => {

    const root =
      document.documentElement;


    // DARK MODE

    if(theme === "dark"){

      root.style.setProperty(

        "--bg-primary",

        "#0b0b10"

      );

      root.style.setProperty(

        "--bg-secondary",

        "#13131a"

      );

      root.style.setProperty(

        "--bg-card",

        "#1c1c26"

      );

      root.style.setProperty(

        "--text-primary",

        "#ffffff"

      );

      root.style.setProperty(

        "--text-secondary",

        "#8b8b9e"

      );

    }

    // LIGHT MODE

    else{

      root.style.setProperty(

        "--bg-primary",

        "#f4f7fb"

      );

      root.style.setProperty(

        "--bg-secondary",

        "#ffffff"

      );

      root.style.setProperty(

        "--bg-card",

        "#edf1f7"

      );

      root.style.setProperty(

        "--text-primary",

        "#13131a"

      );

      root.style.setProperty(

        "--text-secondary",

        "#5d6472"

      );

    }


    // ACCENT

    root.style.setProperty(

      "--accent-color",

      accentColor

    );


    // GLASS EFFECT

    root.style.setProperty(

      "--glass-blur",

      glassEffect
        ? "18px"
        : "0px"

    );


    // ANIMATION SPEED

    root.style.setProperty(

      "--animation-speed",

      animations
        ? "0.25s"
        : "0s"

    );


    // BODY

    document.body.style.background =
      "var(--bg-primary)";

    document.body.style.color =
      "var(--text-primary)";

    document.body.style.transition =
      "background 0.3s ease";


  }, [

    theme,

    accentColor,

    glassEffect,

    animations

  ]);


  // ═══════════════════════════════════════
  // TOGGLE THEME
  // ═══════════════════════════════════════

  const toggleTheme = () => {

    const nextTheme =

      theme === "dark"
      ? "light"
      : "dark";


    setTheme(nextTheme);


    localStorage.setItem(

      "saferoute-theme",

      nextTheme

    );

  };


  // ═══════════════════════════════════════
  // CHANGE ACCENT COLOR
  // ═══════════════════════════════════════

  const updateAccentColor = (

    color

  ) => {

    setAccentColor(color);

    localStorage.setItem(

      "saferoute-accent",

      color

    );

  };


  // ═══════════════════════════════════════
  // TOGGLE GLASS EFFECT
  // ═══════════════════════════════════════

  const toggleGlassEffect = () => {

    const nextValue =
      !glassEffect;

    setGlassEffect(nextValue);

    localStorage.setItem(

      "saferoute-glass",

      JSON.stringify(nextValue)

    );

  };


  // ═══════════════════════════════════════
  // TOGGLE ANIMATIONS
  // ═══════════════════════════════════════

  const toggleAnimations = () => {

    const nextValue =
      !animations;

    setAnimations(nextValue);

    localStorage.setItem(

      "saferoute-animations",

      JSON.stringify(nextValue)

    );

  };


  // ═══════════════════════════════════════
  // PRESET COLORS
  // ═══════════════════════════════════════

  const presetColors = [

    "#00e87a",

    "#ff3d6e",

    "#4d9fff",

    "#ffb830",

    "#9b59b6",

    "#ff6b00"

  ];


  // ═══════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════

  const value = useMemo(() => ({

    theme,

    accentColor,

    glassEffect,

    animations,

    presetColors,

    toggleTheme,

    updateAccentColor,

    toggleGlassEffect,

    toggleAnimations

  }),

  [

    theme,

    accentColor,

    glassEffect,

    animations

  ]);


  // ═══════════════════════════════════════
  // PROVIDER
  // ═══════════════════════════════════════

  return (

    <ThemeContext.Provider value={value}>

      {children}

    </ThemeContext.Provider>

  );

}


// ═══════════════════════════════════════
// USE THEME HOOK
// ═══════════════════════════════════════

export function useTheme(){

  const context =
    useContext(ThemeContext);

  if(!context){

    throw new Error(

      "useTheme must be used inside ThemeProvider"

    );

  }

  return context;

}