// src/hooks/useGeolocation.js

import {

  useCallback,

  useEffect,

  useRef,

  useState

} from "react";


// ═══════════════════════════════════════
// USE GEOLOCATION HOOK
// ═══════════════════════════════════════

export default function useGeolocation({

  enableHighAccuracy = true,

  watch = true,

  timeout = 10000,

  maximumAge = 0,

  autoStart = true

} = {}){

  const [location, setLocation] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [permission, setPermission] =
    useState("prompt");

  const [tracking, setTracking] =
    useState(false);

  const [history, setHistory] =
    useState([]);

  const watchIdRef = useRef(null);


  // ═══════════════════════════════════════
  // FORMAT POSITION
  // ═══════════════════════════════════════

  const formatPosition = (

    position

  ) => {

    return {

      lat:
        position.coords.latitude,

      lng:
        position.coords.longitude,

      accuracy:
        position.coords.accuracy,

      altitude:
        position.coords.altitude,

      heading:
        position.coords.heading,

      speed:
        position.coords.speed,

      timestamp:
        position.timestamp ||

        Date.now()

    };

  };


  // ═══════════════════════════════════════
  // HANDLE SUCCESS
  // ═══════════════════════════════════════

  const handleSuccess = (

    position

  ) => {

    const formatted =
      formatPosition(position);

    setLocation(formatted);

    setPermission("granted");

    setLoading(false);

    setError("");


    // SAVE HISTORY

    setHistory(prev => [

      ...prev,

      formatted

    ]);

  };


  // ═══════════════════════════════════════
  // HANDLE ERROR
  // ═══════════════════════════════════════

  const handleError = (

    err

  ) => {

    setLoading(false);

    setTracking(false);

    setPermission("denied");


    switch(err.code){

      case 1:

        setError(
          "Location permission denied"
        );

        break;

      case 2:

        setError(
          "Unable to detect location"
        );

        break;

      case 3:

        setError(
          "Location request timed out"
        );

        break;

      default:

        setError(
          "Failed to fetch location"
        );

    }

  };


  // ═══════════════════════════════════════
  // GET CURRENT LOCATION
  // ═══════════════════════════════════════

  const getCurrentLocation =
    useCallback(() => {

      if(!navigator.geolocation){

        setError(
          "Geolocation is not supported"
        );

        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(

        handleSuccess,

        handleError,

        {

          enableHighAccuracy,

          timeout,

          maximumAge

        }

      );

    },

    [

      enableHighAccuracy,

      timeout,

      maximumAge

    ]);


  // ═══════════════════════════════════════
  // START TRACKING
  // ═══════════════════════════════════════

  const startTracking =
    useCallback(() => {

      if(!navigator.geolocation){

        setError(
          "Geolocation is not supported"
        );

        return;
      }

      setLoading(true);

      setTracking(true);


      watchIdRef.current =

        navigator.geolocation.watchPosition(

          handleSuccess,

          handleError,

          {

            enableHighAccuracy,

            timeout,

            maximumAge

          }

        );

    },

    [

      enableHighAccuracy,

      timeout,

      maximumAge

    ]);


  // ═══════════════════════════════════════
  // STOP TRACKING
  // ═══════════════════════════════════════

  const stopTracking =
    useCallback(() => {

      if(watchIdRef.current){

        navigator.geolocation.clearWatch(

          watchIdRef.current

        );

      }

      setTracking(false);

    }, []);


  // ═══════════════════════════════════════
  // CLEAR HISTORY
  // ═══════════════════════════════════════

  const clearHistory = () => {

    setHistory([]);

  };


  // ═══════════════════════════════════════
  // CHECK PERMISSION
  // ═══════════════════════════════════════

  const checkPermission =
    async() => {

      try{

        if(navigator.permissions){

          const result =

            await navigator.permissions.query({

              name:"geolocation"

            });

          setPermission(result.state);

        }

      }catch(err){

        console.error(err);

      }

    };


  // ═══════════════════════════════════════
  // AUTO START
  // ═══════════════════════════════════════

  useEffect(() => {

    checkPermission();

    if(autoStart){

      if(watch){

        startTracking();

      }else{

        getCurrentLocation();

      }

    }

    return () => {

      stopTracking();

    };

  }, []);


  // ═══════════════════════════════════════
  // DISTANCE CALCULATOR
  // ═══════════════════════════════════════

  const calculateDistance = (

    lat1,

    lon1,

    lat2,

    lon2

  ) => {

    const R = 6371;

    const dLat =
      (lat2 - lat1) *
      Math.PI / 180;

    const dLon =
      (lon2 - lon1) *
      Math.PI / 180;

    const a =

      Math.sin(dLat / 2) *
      Math.sin(dLat / 2)

      +

      Math.cos(lat1 * Math.PI / 180)

      *

      Math.cos(lat2 * Math.PI / 180)

      *

      Math.sin(dLon / 2)

      *

      Math.sin(dLon / 2);


    const c =

      2 *

      Math.atan2(

        Math.sqrt(a),

        Math.sqrt(1 - a)

      );


    return R * c;

  };


  // ═══════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════

  return {

    location,

    loading,

    error,

    permission,

    tracking,

    history,

    getCurrentLocation,

    startTracking,

    stopTracking,

    clearHistory,

    calculateDistance

  };

}