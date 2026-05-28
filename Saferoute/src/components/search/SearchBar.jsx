// src/components/search/SearchBar.jsx

import { useState } from "react";

import SourceInput
from "./SourceInput";

import DestinationInput
from "./DestinationInput";


// ═══════════════════════════════════════
// SEARCH BAR
// ═══════════════════════════════════════

export default function SearchBar({

  onRouteSearch,

  loading = false

}){

  const [source, setSource] =
    useState(null);

  const [destination, setDestination] =
    useState(null);

  const [error, setError] =
    useState("");


  // ═══════════════════════════════════════
  // HANDLE SEARCH
  // ═══════════════════════════════════════

  const handleSearch = () => {

    setError("");


    if(!source){

      setError(
        "Please select source location"
      );

      return;
    }


    if(!destination){

      setError(
        "Please select destination"
      );

      return;
    }


    if(onRouteSearch){

      onRouteSearch({

        source,

        destination

      });

    }

  };


  // ═══════════════════════════════════════
  // SWAP LOCATIONS
  // ═══════════════════════════════════════

  const handleSwap = () => {

    if(!source || !destination){

      return;
    }

    const oldSource = source;

    setSource(destination);

    setDestination(oldSource);

  };


  // ═══════════════════════════════════════
  // USE CURRENT LOCATION
  // ═══════════════════════════════════════

  const useCurrentLocation = () => {

    if(!navigator.geolocation){

      setError(
        "Geolocation not supported"
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(

      async(position) => {

        try{

          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;


          const response = await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`

          );

          const data =
            await response.json();


          setSource({

            name:
              data.display_name,

            lat,

            lng

          });

        }catch(err){

          console.error(err);

          setError(
            "Failed to fetch current location"
          );

        }

      },

      () => {

        setError(
          "Location permission denied"
        );

      },

      {

        enableHighAccuracy:true

      }

    );

  };


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.container}>


      {/* HEADER */}

      <div style={styles.header}>


        <div>

          <div style={styles.title}>
            Safe Navigation
          </div>

          <div style={styles.subtitle}>
            Find safer routes in real time
          </div>

        </div>


        {/* CURRENT LOCATION */}

        <button

          style={styles.locationBtn}

          onClick={useCurrentLocation}

        >
          📍
        </button>

      </div>


      {/* INPUT SECTION */}

      <div style={styles.inputsWrapper}>


        {/* SOURCE */}

        <SourceInput

          value={source?.name || ""}

          onSelect={setSource}

        />


        {/* SWAP */}

        <div style={styles.swapContainer}>

          <button

            style={styles.swapBtn}

            onClick={handleSwap}

          >
            ⇅
          </button>

        </div>


        {/* DESTINATION */}

        <DestinationInput

          value={destination?.name || ""}

          onSelect={setDestination}

        />

      </div>


      {/* ROUTE PREVIEW */}

      {(source || destination) && (

        <div style={styles.previewBox}>


          {source && (

            <div style={styles.previewItem}>

              <div
                style={{
                  ...styles.previewDot,
                  background:"#00e87a"
                }}
              />

              <div style={styles.previewText}>

                {source.name}

              </div>

            </div>

          )}


          {destination && (

            <div style={styles.previewItem}>

              <div
                style={{
                  ...styles.previewDot,
                  background:"#ff3d6e"
                }}
              />

              <div style={styles.previewText}>

                {destination.name}

              </div>

            </div>

          )}

        </div>

      )}


      {/* ERROR */}

      {error && (

        <div style={styles.errorBox}>

          ⚠️ {error}

        </div>

      )}


      {/* SEARCH BUTTON */}

      <button

        style={{

          ...styles.searchBtn,

          opacity:loading ? 0.7 : 1

        }}

        onClick={handleSearch}

        disabled={loading}

      >

        {loading

          ? "Calculating Safe Route..."

          : "Find Safe Route"}

      </button>

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  container: {

    position:"absolute",

    top:"18px",

    left:"18px",

    right:"18px",

    zIndex:9999,

    background:"rgba(19,19,26,0.96)",

    border:"1px solid rgba(255,255,255,0.08)",

    borderRadius:"28px",

    padding:"22px",

    backdropFilter:"blur(18px)",

    boxShadow:"0 12px 40px rgba(0,0,0,0.32)",

    display:"flex",

    flexDirection:"column",

    gap:"20px"

  },

  header: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center"

  },

  title: {

    color:"#ffffff",

    fontSize:"22px",

    fontWeight:"800"

  },

  subtitle: {

    marginTop:"6px",

    color:"#8b8b9e",

    fontSize:"13px"

  },

  locationBtn: {

    width:"50px",

    height:"50px",

    borderRadius:"16px",

    border:"none",

    background:"rgba(0,232,122,0.12)",

    color:"#00e87a",

    fontSize:"22px",

    cursor:"pointer"

  },

  inputsWrapper: {

    display:"flex",

    flexDirection:"column",

    gap:"16px"

  },

  swapContainer: {

    display:"flex",

    justifyContent:"center",

    margin:"-4px 0"

  },

  swapBtn: {

    width:"42px",

    height:"42px",

    borderRadius:"50%",

    border:"1px solid rgba(255,255,255,0.08)",

    background:"#1c1c26",

    color:"#ffffff",

    fontSize:"18px",

    cursor:"pointer"

  },

  previewBox: {

    background:"#1c1c26",

    borderRadius:"20px",

    padding:"16px",

    display:"flex",

    flexDirection:"column",

    gap:"14px"

  },

  previewItem: {

    display:"flex",

    alignItems:"center",

    gap:"12px"

  },

  previewDot: {

    width:"12px",

    height:"12px",

    borderRadius:"50%",

    flexShrink:0

  },

  previewText: {

    color:"#d6d6e7",

    fontSize:"13px",

    lineHeight:"1.5",

    overflow:"hidden",

    textOverflow:"ellipsis",

    whiteSpace:"nowrap"

  },

  errorBox: {

    padding:"14px",

    borderRadius:"16px",

    background:"rgba(255,61,110,0.12)",

    color:"#ff3d6e",

    fontSize:"13px",

    fontWeight:"600"

  },

  searchBtn: {

    width:"100%",

    height:"60px",

    border:"none",

    borderRadius:"20px",

    background:"#00e87a",

    color:"#13131a",

    fontSize:"16px",

    fontWeight:"800",

    cursor:"pointer",

    boxShadow:
      "0 10px 24px rgba(0,232,122,0.24)"

  }

};