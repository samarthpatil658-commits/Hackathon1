// src/components/search/DestinationInput.jsx

import { useEffect, useRef, useState } from "react";

import AutocompleteList
from "./AutocompleteList";


// ═══════════════════════════════════════
// DESTINATION INPUT
// ═══════════════════════════════════════

export default function DestinationInput({

  value = "",

  onSelect,

  placeholder = "Enter destination",

  autoFocus = false

}){

  const [query, setQuery] =
    useState(value);

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showResults, setShowResults] =
    useState(false);

  const debounceRef = useRef(null);

  const containerRef = useRef(null);


  // ═══════════════════════════════════════
  // SEARCH LOCATION
  // ═══════════════════════════════════════

  const searchLocation = async(searchText) => {

    if(searchText.length < 3){

      setResults([]);

      setShowResults(false);

      return;
    }

    try{

      setLoading(true);

      setError("");

      const response = await fetch(

        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=6`

      );

      const data = await response.json();

      setResults(data);

      setShowResults(true);

    }catch(err){

      console.error(err);

      setError(
        "Failed to fetch locations"
      );

    }finally{

      setLoading(false);

    }

  };


  // ═══════════════════════════════════════
  // HANDLE INPUT
  // ═══════════════════════════════════════

  const handleInput = (e) => {

    const text = e.target.value;

    setQuery(text);


    clearTimeout(debounceRef.current);


    debounceRef.current = setTimeout(() => {

      searchLocation(text);

    }, 400);

  };


  // ═══════════════════════════════════════
  // HANDLE SELECT
  // ═══════════════════════════════════════

  const handleSelect = (location) => {

    setQuery(location.display_name);

    setShowResults(false);


    const selectedLocation = {

      name:location.display_name,

      lat:parseFloat(location.lat),

      lng:parseFloat(location.lon)

    };


    if(onSelect){

      onSelect(selectedLocation);

    }

  };


  // ═══════════════════════════════════════
  // CLOSE RESULTS
  // ═══════════════════════════════════════

  const handleClose = () => {

    setShowResults(false);

  };


  // ═══════════════════════════════════════
  // OUTSIDE CLICK
  // ═══════════════════════════════════════

  useEffect(() => {

    const handleOutsideClick = (e) => {

      if(

        containerRef.current &&

        !containerRef.current.contains(e.target)

      ){

        setShowResults(false);

      }

    };

    document.addEventListener(

      "mousedown",

      handleOutsideClick

    );

    return () => {

      document.removeEventListener(

        "mousedown",

        handleOutsideClick

      );

    };

  }, []);


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div
      ref={containerRef}
      style={styles.container}
    >


      {/* LABEL */}

      <div style={styles.label}>
        Destination
      </div>


      {/* INPUT WRAPPER */}

      <div style={styles.inputWrapper}>


        {/* DESTINATION ICON */}

        <div style={styles.iconWrapper}>
          🎯
        </div>


        {/* INPUT */}

        <input

          type="text"

          value={query}

          autoFocus={autoFocus}

          placeholder={placeholder}

          onChange={handleInput}

          onFocus={() => {

            if(results.length > 0){

              setShowResults(true);

            }

          }}

          style={styles.input}

        />


        {/* CLEAR BUTTON */}

        {query.length > 0 && (

          <button

            style={styles.clearBtn}

            onClick={() => {

              setQuery("");

              setResults([]);

              setShowResults(false);

            }}

          >
            ✕
          </button>

        )}

      </div>


      {/* AUTOCOMPLETE */}

      <AutocompleteList

        visible={showResults}

        loading={loading}

        error={error}

        results={results}

        query={query}

        onSelect={handleSelect}

        onClose={handleClose}

      />

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  container: {

    position:"relative",

    width:"100%"

  },

  label: {

    color:"#ffffff",

    fontSize:"13px",

    fontWeight:"700",

    marginBottom:"10px",

    paddingLeft:"4px"

  },

  inputWrapper: {

    width:"100%",

    height:"62px",

    background:"rgba(19,19,26,0.96)",

    border:"1px solid rgba(255,255,255,0.08)",

    borderRadius:"20px",

    display:"flex",

    alignItems:"center",

    padding:"0 16px",

    gap:"14px",

    backdropFilter:"blur(14px)",

    boxShadow:"0 8px 24px rgba(0,0,0,0.22)"

  },

  iconWrapper: {

    width:"42px",

    height:"42px",

    borderRadius:"14px",

    background:"rgba(255,61,110,0.12)",

    display:"flex",

    alignItems:"center",

    justifyContent:"center",

    fontSize:"20px",

    flexShrink:0

  },

  input: {

    flex:1,

    height:"100%",

    border:"none",

    outline:"none",

    background:"transparent",

    color:"#ffffff",

    fontSize:"15px",

    fontWeight:"500"

  },

  clearBtn: {

    width:"34px",

    height:"34px",

    borderRadius:"50%",

    border:"none",

    background:"rgba(255,255,255,0.06)",

    color:"#8b8b9e",

    cursor:"pointer",

    fontSize:"14px",

    flexShrink:0

  }

};