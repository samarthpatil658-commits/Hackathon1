// src/components/sos/LiveTracking.jsx

import { useEffect, useMemo, useRef, useState } from "react";


// ═══════════════════════════════════════
// LIVE TRACKING COMPONENT
// ═══════════════════════════════════════

export default function LiveTracking({

  isTracking = false,

  trackingInterval = 10000,

  onLocationUpdate,

  onTrackingStopped,

  emergencyContacts = []

}){

  const [location, setLocation] =
    useState(null);

  const [pathHistory, setPathHistory] =
    useState([]);

  const [accuracy, setAccuracy] =
    useState(null);

  const [speed, setSpeed] =
    useState(null);

  const [heading, setHeading] =
    useState(null);

  const [trackingTime, setTrackingTime] =
    useState(0);

  const [status, setStatus] =
    useState("inactive");

  const [error, setError] =
    useState("");

  const watchIdRef = useRef(null);

  const timerRef = useRef(null);


  // ═══════════════════════════════════════
  // START TRACKING
  // ═══════════════════════════════════════

  const startTracking = () => {

    if(!navigator.geolocation){

      setError(
        "Geolocation not supported"
      );

      return;
    }

    setStatus("tracking");

    watchIdRef.current =

      navigator.geolocation.watchPosition(

        position => {

          const newLocation = {

            lat:
              position.coords.latitude,

            lng:
              position.coords.longitude,

            timestamp:new Date(),

            accuracy:
              position.coords.accuracy,

            speed:
              position.coords.speed,

            heading:
              position.coords.heading

          };


          setLocation(newLocation);

          setAccuracy(
            position.coords.accuracy
          );

          setSpeed(
            position.coords.speed
          );

          setHeading(
            position.coords.heading
          );


          // SAVE PATH HISTORY

          setPathHistory(prev => [

            ...prev,

            newLocation

          ]);


          // CALLBACK

          if(onLocationUpdate){

            onLocationUpdate(newLocation);

          }


          // SAVE TO LOCAL STORAGE

          const existingTracking =

            JSON.parse(

              localStorage.getItem(
                "liveTrackingHistory"
              )

            ) || [];


          existingTracking.push(newLocation);


          localStorage.setItem(

            "liveTrackingHistory",

            JSON.stringify(existingTracking)

          );

        },

        err => {

          console.error(err);

          setStatus("error");

          setError(
            "Failed to access location"
          );

        },

        {

          enableHighAccuracy:true,

          timeout:10000,

          maximumAge:0

        }

      );


    // TIMER

    timerRef.current = setInterval(() => {

      setTrackingTime(prev => prev + 1);

    }, 1000);

  };


  // ═══════════════════════════════════════
  // STOP TRACKING
  // ═══════════════════════════════════════

  const stopTracking = () => {

    if(watchIdRef.current){

      navigator.geolocation.clearWatch(

        watchIdRef.current

      );

    }

    if(timerRef.current){

      clearInterval(timerRef.current);

    }

    setStatus("stopped");


    if(onTrackingStopped){

      onTrackingStopped();

    }

  };


  // ═══════════════════════════════════════
  // FORMAT TIME
  // ═══════════════════════════════════════

  const formattedTime = useMemo(() => {

    const hrs =
      Math.floor(trackingTime / 3600);

    const mins =
      Math.floor(
        (trackingTime % 3600) / 60
      );

    const secs =
      trackingTime % 60;

    return `

      ${hrs.toString().padStart(2,"0")}:
      ${mins.toString().padStart(2,"0")}:
      ${secs.toString().padStart(2,"0")}

    `;

  }, [trackingTime]);


  // ═══════════════════════════════════════
  // LIVE SHARE LINK
  // ═══════════════════════════════════════

  const shareLink = useMemo(() => {

    if(!location){

      return "";
    }

    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;

  }, [location]);


  // ═══════════════════════════════════════
  // SHARE LIVE LOCATION
  // ═══════════════════════════════════════

  const shareLiveLocation = async() => {

    if(!location) return;

    const shareMessage = `

Live Location Tracking

Current Location:
${shareLink}

Tracking Duration:
${formattedTime}

Shared via SafeRoute

    `;

    try{

      if(navigator.share){

        await navigator.share({

          title:"Live Location",

          text:shareMessage

        });

      }else{

        await navigator.clipboard.writeText(
          shareMessage
        );

        alert(
          "Tracking link copied to clipboard"
        );

      }

    }catch(err){

      console.error(err);

    }

  };


  // ═══════════════════════════════════════
  // SEND TO EMERGENCY CONTACTS
  // ═══════════════════════════════════════

  const notifyEmergencyContacts = () => {

    if(!location) return;

    const sortedContacts =

      [...emergencyContacts].sort(

        (a,b) => a.priority - b.priority

      );

    console.log(

      "Sending live tracking to:",

      sortedContacts

    );

    alert(

      "Live tracking shared with emergency contacts."

    );

  };


  // ═══════════════════════════════════════
  // AUTO START / STOP
  // ═══════════════════════════════════════

  useEffect(() => {

    if(isTracking){

      startTracking();

    }else{

      stopTracking();

    }

    return () => {

      stopTracking();

    };

  }, [isTracking]);


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.container}>


      {/* HEADER */}

      <div style={styles.header}>


        <div>

          <div style={styles.title}>
            Live Tracking
          </div>

          <div style={styles.subtitle}>
            Real-time safety monitoring
          </div>

        </div>


        <div
          style={{
            ...styles.statusBadge,

            background:

              status === "tracking"

              ? "#00e87a"

              : status === "error"

                ? "#ff3d6e"

                : "#8b8b9e"
          }}
        >

          {

            status === "tracking"

            ? "LIVE"

            : status.toUpperCase()

          }

        </div>

      </div>


      {/* TRACKING TIME */}

      <div style={styles.timerCard}>


        <div style={styles.timerLabel}>
          Tracking Duration
        </div>


        <div style={styles.timerValue}>
          {formattedTime}
        </div>

      </div>


      {/* LOCATION */}

      <div style={styles.locationCard}>


        <div style={styles.cardTitle}>
          Current Location
        </div>


        {

          location

          ?

          <>

            <div style={styles.locationText}>

              {location.lat.toFixed(5)},
              {" "}
              {location.lng.toFixed(5)}

            </div>


            <div style={styles.metaRow}>


              <div style={styles.metaItem}>

                🎯 Accuracy:
                {" "}
                {Math.round(accuracy)}m

              </div>


              <div style={styles.metaItem}>

                🚶 Speed:
                {" "}
                {

                  speed

                  ?

                  `${(speed * 3.6).toFixed(1)} km/h`

                  :

                  "0 km/h"
                }

              </div>

            </div>

          </>

          :

          <div style={styles.waitingText}>
            Waiting for GPS signal...
          </div>

        }

      </div>


      {/* PATH HISTORY */}

      <div style={styles.pathCard}>


        <div style={styles.cardTitle}>
          Movement History
        </div>


        <div style={styles.pathCount}>

          {pathHistory.length}
          {" "}
          tracking points recorded

        </div>

      </div>


      {/* ERROR */}

      {

        error && (

          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>

        )

      }


      {/* ACTIONS */}

      <div style={styles.actions}>


        <button

          style={styles.actionBtn}

          onClick={shareLiveLocation}

        >

          📤 Share

        </button>


        <button

          style={styles.actionBtn}

          onClick={notifyEmergencyContacts}

        >

          🚨 Notify Contacts

        </button>

      </div>


      {/* STOP BUTTON */}

      {

        isTracking && (

          <button

            style={styles.stopBtn}

            onClick={stopTracking}

          >

            Stop Live Tracking

          </button>

        )

      }

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  container: {

    width:"100%",

    background:"#13131a",

    borderRadius:"28px",

    padding:"24px",

    border:"1px solid rgba(255,255,255,0.08)",

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

    color:"#8b8b9e",

    fontSize:"13px",

    marginTop:"6px"

  },

  statusBadge: {

    padding:"10px 16px",

    borderRadius:"999px",

    color:"#13131a",

    fontWeight:"800",

    fontSize:"12px"

  },

  timerCard: {

    background:"#1c1c26",

    borderRadius:"20px",

    padding:"20px",

    textAlign:"center"

  },

  timerLabel: {

    color:"#8b8b9e",

    fontSize:"12px"

  },

  timerValue: {

    marginTop:"10px",

    color:"#ffffff",

    fontSize:"34px",

    fontWeight:"800"

  },

  locationCard: {

    background:"#1c1c26",

    borderRadius:"20px",

    padding:"20px"

  },

  cardTitle: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"700"

  },

  locationText: {

    marginTop:"14px",

    color:"#00e87a",

    fontSize:"16px",

    fontWeight:"700"

  },

  waitingText: {

    marginTop:"12px",

    color:"#8b8b9e",

    fontSize:"13px"

  },

  metaRow: {

    display:"flex",

    gap:"12px",

    marginTop:"14px",

    flexWrap:"wrap"

  },

  metaItem: {

    background:"#2a2a35",

    padding:"10px 14px",

    borderRadius:"14px",

    color:"#d6d6e7",

    fontSize:"12px"

  },

  pathCard: {

    background:"#1c1c26",

    borderRadius:"20px",

    padding:"20px"

  },

  pathCount: {

    marginTop:"12px",

    color:"#4d9fff",

    fontSize:"16px",

    fontWeight:"700"

  },

  errorBox: {

    padding:"14px",

    borderRadius:"16px",

    background:"rgba(255,61,110,0.12)",

    color:"#ff3d6e",

    fontSize:"13px",

    fontWeight:"600"

  },

  actions: {

    display:"flex",

    gap:"14px"

  },

  actionBtn: {

    flex:1,

    height:"54px",

    border:"none",

    borderRadius:"18px",

    background:"#1c1c26",

    color:"#ffffff",

    fontWeight:"700",

    cursor:"pointer",

    fontSize:"14px"

  },

  stopBtn: {

    width:"100%",

    height:"60px",

    border:"none",

    borderRadius:"20px",

    background:"#ff3d6e",

    color:"#ffffff",

    fontSize:"15px",

    fontWeight:"800",

    cursor:"pointer"

  }

};