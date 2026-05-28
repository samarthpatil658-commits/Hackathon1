// src/pages/HomePage.jsx

import { useEffect, useState } from "react";

import MapView
from "../components/map/MapView";

import SearchBar
from "../components/future/SearchBar";

import RiskIndicator
from "../components/reports/RiskIndicator";

import Loader
from "../components/ui/Loader";

import Toast
from "../components/ui/Toast";

import { useRoute }
from "../context/RouteContext";

import { useSOS }
from "../context/SOSContext";


// ═══════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════

export default function HomePage(){

  const {

    routeData,

    dangerZones,

    loading,

    error,

    riskScore,

    safeRouteAvailable,

    fetchSafeRoute

  } = useRoute();


  const {

    currentLocation,

    startLiveTracking,

    stopLiveTracking

  } = useSOS();


  const [toast, setToast] =
    useState({

      visible:false,

      message:"",

      type:"info"

    });


  const [trackingEnabled, setTrackingEnabled] =
    useState(false);


  // ═══════════════════════════════════════
  // START GPS TRACKING
  // ═══════════════════════════════════════

  useEffect(() => {

    startLiveTracking();

    setTrackingEnabled(true);

    return () => {

      stopLiveTracking();

    };

  }, []);


  // ═══════════════════════════════════════
  // HANDLE ROUTE SEARCH
  // ═══════════════════════════════════════

  const handleRouteSearch =
    async({

      source,

      destination

    }) => {

      const result =

        await fetchSafeRoute({

          source,

          destination

        });


      if(result.success){

        if(!safeRouteAvailable){

          setToast({

            visible:true,

            type:"warning",

            message:
              "No completely safe route found. Showing safest available route."

          });

        }else{

          setToast({

            visible:true,

            type:"success",

            message:
              "Safe route calculated successfully."

          });

        }

      }else{

        setToast({

          visible:true,

          type:"error",

          message:
            result.message ||

            "Failed to fetch route"

        });

      }

    };


  // ═══════════════════════════════════════
  // TOGGLE LIVE TRACKING
  // ═══════════════════════════════════════

  const toggleTracking = () => {

    if(trackingEnabled){

      stopLiveTracking();

      setTrackingEnabled(false);

      setToast({

        visible:true,

        type:"warning",

        message:
          "Live tracking disabled"

      });

    }else{

      startLiveTracking();

      setTrackingEnabled(true);

      setToast({

        visible:true,

        type:"success",

        message:
          "Live tracking enabled"

      });

    }

  };


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.page}>


      {/* MAP */}

      <div style={styles.mapWrapper}>


        <MapView

          currentLocation={currentLocation}

          routeData={routeData}

          dangerZones={dangerZones}

        />


        {/* SEARCH */}

        <SearchBar

          onRouteSearch={
            handleRouteSearch
          }

          loading={loading}

        />


        {/* TRACKING BUTTON */}

        <button

          style={{

            ...styles.trackingBtn,

            background:

              trackingEnabled

              ? "#00e87a"

              : "#1c1c26",

            color:

              trackingEnabled

              ? "#13131a"

              : "#ffffff"

          }}

          onClick={toggleTracking}

        >

          {

            trackingEnabled

            ? "📡 Tracking ON"

            : "📡 Tracking OFF"

          }

        </button>


        {/* RISK INDICATOR */}

        {

          routeData && (

            <div style={styles.riskWrapper}>

              <RiskIndicator

                riskLevel={riskScore}

                safeRoute={
                  safeRouteAvailable
                }

              />

            </div>

          )

        }


        {/* ROUTE INFO */}

        {

          routeData && (

            <div style={styles.routeInfo}>


              <div style={styles.routeCard}>


                <div style={styles.routeTitle}>
                  Route Details
                </div>


                <div style={styles.routeMeta}>


                  <div style={styles.metaItem}>

                    🛣️
                    {" "}

                    {

                      (
                        routeData.distance / 1000
                      ).toFixed(1)

                    }

                    km

                  </div>


                  <div style={styles.metaItem}>

                    ⏱️
                    {" "}

                    {

                      Math.ceil(

                        routeData.duration / 60

                      )

                    }

                    mins

                  </div>

                </div>

              </div>

            </div>

          )

        }


        {/* LOADER */}

        {

          loading && (

            <div style={styles.loaderOverlay}>

              <Loader

                text="Calculating safest route..."

                fullScreen={false}

                size={68}

              />

            </div>

          )

        }

      </div>


      {/* TOAST */}

      <Toast

        visible={toast.visible}

        type={toast.type}

        message={toast.message}

        onClose={() =>

          setToast(prev => ({

            ...prev,

            visible:false

          }))

        }

      />

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  page: {

    width:"100%",

    minHeight:"100vh",

    background:"#0b0b10"

  },

  mapWrapper: {

    position:"relative",

    width:"100%",

    height:"100vh",

    overflow:"hidden"

  },

  trackingBtn: {

    position:"absolute",

    top:"220px",

    right:"18px",

    zIndex:9999,

    height:"50px",

    padding:"0 18px",

    borderRadius:"18px",

    border:"1px solid rgba(255,255,255,0.08)",

    fontSize:"13px",

    fontWeight:"800",

    cursor:"pointer",

    backdropFilter:"blur(12px)",

    boxShadow:
      "0 10px 24px rgba(0,0,0,0.25)"

  },

  riskWrapper: {

    position:"absolute",

    bottom:"120px",

    left:"18px",

    right:"18px",

    zIndex:9999

  },

  routeInfo: {

    position:"absolute",

    bottom:"210px",

    left:"18px",

    right:"18px",

    zIndex:9999

  },

  routeCard: {

    background:"rgba(19,19,26,0.94)",

    borderRadius:"22px",

    padding:"18px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    backdropFilter:"blur(16px)"

  },

  routeTitle: {

    color:"#ffffff",

    fontSize:"15px",

    fontWeight:"700"

  },

  routeMeta: {

    display:"flex",

    gap:"14px",

    marginTop:"14px",

    flexWrap:"wrap"

  },

  metaItem: {

    background:"#1f1f2b",

    padding:"10px 14px",

    borderRadius:"14px",

    color:"#d6d6e7",

    fontSize:"13px",

    fontWeight:"600"

  },

  loaderOverlay: {

    position:"absolute",

    inset:0,

    background:"rgba(0,0,0,0.35)",

    zIndex:99999,

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    backdropFilter:"blur(6px)"

  }

};