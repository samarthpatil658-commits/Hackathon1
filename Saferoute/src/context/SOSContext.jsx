// src/context/SOSContext.jsx

import {

  createContext,

  useContext,

  useEffect,

  useMemo,

  useRef,

  useState

} from "react";


// ═══════════════════════════════════════
// SOS CONTEXT
// ═══════════════════════════════════════

const SOSContext =
  createContext(null);


// ═══════════════════════════════════════
// SOS PROVIDER
// ═══════════════════════════════════════

export function SOSProvider({

  children

}){

  const [sosActive, setSOSActive] =
    useState(false);

  const [liveTracking, setLiveTracking] =
    useState(false);

  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [trackingHistory, setTrackingHistory] =
    useState([]);

  const [emergencyContacts, setEmergencyContacts] =
    useState([]);

  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const watchIdRef = useRef(null);


  // ═══════════════════════════════════════
  // LOAD CONTACTS
  // ═══════════════════════════════════════

  useEffect(() => {

    try{

      const storedContacts =

        JSON.parse(

          localStorage.getItem(
            "emergencyContacts"
          )

        ) || [];


      // SORT BY PRIORITY

      const sortedContacts =

        storedContacts.sort(

          (a,b) =>
            a.priority - b.priority

        );


      setEmergencyContacts(
        sortedContacts
      );

    }catch(err){

      console.error(err);

    }

  }, []);


  // ═══════════════════════════════════════
  // GET LIVE LOCATION
  // ═══════════════════════════════════════

  const getCurrentLocation = () => {

    return new Promise(

      (resolve,reject) => {

        if(!navigator.geolocation){

          reject(
            "Geolocation not supported"
          );

          return;
        }

        navigator.geolocation.getCurrentPosition(

          position => {

            const location = {

              lat:
                position.coords.latitude,

              lng:
                position.coords.longitude,

              accuracy:
                position.coords.accuracy,

              timestamp:new Date()

            };

            resolve(location);

          },

          err => {

            reject(err.message);

          },

          {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:0

          }

        );

      }

    );

  };


  // ═══════════════════════════════════════
  // START LIVE TRACKING
  // ═══════════════════════════════════════

  const startLiveTracking = () => {

    if(!navigator.geolocation){

      setError(
        "Location tracking not supported"
      );

      return;
    }

    setLiveTracking(true);

    watchIdRef.current =

      navigator.geolocation.watchPosition(

        position => {

          const location = {

            lat:
              position.coords.latitude,

            lng:
              position.coords.longitude,

            accuracy:
              position.coords.accuracy,

            speed:
              position.coords.speed,

            heading:
              position.coords.heading,

            timestamp:new Date()

          };


          setCurrentLocation(location);

          setTrackingHistory(prev => [

            ...prev,

            location

          ]);


          // SAVE TRACK HISTORY

          const existingHistory =

            JSON.parse(

              localStorage.getItem(
                "trackingHistory"
              )

            ) || [];


          existingHistory.push(location);


          localStorage.setItem(

            "trackingHistory",

            JSON.stringify(existingHistory)

          );

        },

        err => {

          console.error(err);

          setError(
            "Failed to track location"
          );

        },

        {

          enableHighAccuracy:true,

          maximumAge:0,

          timeout:10000

        }

      );

  };


  // ═══════════════════════════════════════
  // STOP LIVE TRACKING
  // ═══════════════════════════════════════

  const stopLiveTracking = () => {

    if(watchIdRef.current){

      navigator.geolocation.clearWatch(

        watchIdRef.current

      );

    }

    setLiveTracking(false);

  };


  // ═══════════════════════════════════════
  // SEND SOS ALERT
  // ═══════════════════════════════════════

  const sendSOS = async(

    customMessage = ""

  ) => {

    try{

      setLoading(true);

      setError("");

      setSOSActive(true);


      // GET LIVE LOCATION

      const location =
        await getCurrentLocation();

      setCurrentLocation(location);


      // START TRACKING

      startLiveTracking();


      // PRIORITY CONTACTS

      const sortedContacts =

        [...emergencyContacts].sort(

          (a,b) =>
            a.priority - b.priority

        );


      // CREATE ALERT

      const sosAlert = {

        id:Date.now(),

        type:"SOS",

        message:

          customMessage ||

          "Emergency SOS Alert Triggered",

        location,

        contacts:sortedContacts,

        timestamp:new Date(),

        status:"sent",

        tracking:true

      };


      // SAVE ALERT

      const existingAlerts =

        JSON.parse(

          localStorage.getItem(
            "sosAlerts"
          )

        ) || [];


      existingAlerts.unshift(sosAlert);


      localStorage.setItem(

        "sosAlerts",

        JSON.stringify(existingAlerts)

      );


      setAlerts(existingAlerts);


      // SEND SMS SIMULATION

      sortedContacts.forEach(contact => {

        console.log(

          `SOS sent to ${contact.name} (${contact.phone})`

        );

      });


      // DEVICE VIBRATION

      if(navigator.vibrate){

        navigator.vibrate([

          300,

          120,

          300,

          120,

          600

        ]);

      }


      return {

        success:true,

        alert:sosAlert

      };

    }catch(err){

      console.error(err);

      setError(
        "Failed to send SOS alert"
      );

      return {

        success:false,

        message:
          "Unable to trigger emergency SOS"

      };

    }finally{

      setLoading(false);

    }

  };


  // ═══════════════════════════════════════
  // CANCEL SOS
  // ═══════════════════════════════════════

  const cancelSOS = () => {

    setSOSActive(false);

    stopLiveTracking();

  };


  // ═══════════════════════════════════════
  // SHARE LIVE LOCATION
  // ═══════════════════════════════════════

  const shareLiveLocation = async() => {

    if(!currentLocation){

      return;
    }

    const mapUrl =

      `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;


    const message = `

My Live Location:
${mapUrl}

Shared via SafeRoute

    `;

    try{

      if(navigator.share){

        await navigator.share({

          title:"Live Location",

          text:message

        });

      }else{

        await navigator.clipboard.writeText(
          message
        );

        alert(
          "Location copied to clipboard"
        );

      }

    }catch(err){

      console.error(err);

    }

  };


  // ═══════════════════════════════════════
  // ADD CONTACT
  // ═══════════════════════════════════════

  const addEmergencyContact = (

    contact

  ) => {

    const updatedContacts = [

      ...emergencyContacts,

      contact

    ];


    // SORT BY PRIORITY

    updatedContacts.sort(

      (a,b) =>
        a.priority - b.priority

    );


    setEmergencyContacts(
      updatedContacts
    );


    localStorage.setItem(

      "emergencyContacts",

      JSON.stringify(updatedContacts)

    );

  };


  // ═══════════════════════════════════════
  // REMOVE CONTACT
  // ═══════════════════════════════════════

  const removeEmergencyContact = (

    id

  ) => {

    const updatedContacts =

      emergencyContacts.filter(

        contact => contact.id !== id

      );


    setEmergencyContacts(
      updatedContacts
    );


    localStorage.setItem(

      "emergencyContacts",

      JSON.stringify(updatedContacts)

    );

  };


  // ═══════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════

  const value = useMemo(() => ({

    sosActive,

    liveTracking,

    currentLocation,

    trackingHistory,

    emergencyContacts,

    alerts,

    loading,

    error,

    sendSOS,

    cancelSOS,

    startLiveTracking,

    stopLiveTracking,

    shareLiveLocation,

    addEmergencyContact,

    removeEmergencyContact

  }),

  [

    sosActive,

    liveTracking,

    currentLocation,

    trackingHistory,

    emergencyContacts,

    alerts,

    loading,

    error

  ]);


  // ═══════════════════════════════════════
  // PROVIDER
  // ═══════════════════════════════════════

  return (

    <SOSContext.Provider value={value}>

      {children}

    </SOSContext.Provider>

  );

}


// ═══════════════════════════════════════
// USE SOS HOOK
// ═══════════════════════════════════════

export function useSOS(){

  const context =
    useContext(SOSContext);

  if(!context){

    throw new Error(

      "useSOS must be used inside SOSProvider"

    );

  }

  return context;

}