// src/hooks/useSOS.jsx

import { useCallback, useEffect, useState } from "react";

import { useSOS as useSOSContext }
from "../context/SOSContext";


// ═══════════════════════════════════════
// CUSTOM SOS HOOK
// ═══════════════════════════════════════

export default function useSOS(){

  const {

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

  } = useSOSContext();


  // ═══════════════════════════════════════
  // LOCAL STATES
  // ═══════════════════════════════════════

  const [countdown, setCountdown] =
    useState(0);

  const [countdownActive, setCountdownActive] =
    useState(false);

  const [lastSOS, setLastSOS] =
    useState(null);


  // ═══════════════════════════════════════
  // START SOS COUNTDOWN
  // ═══════════════════════════════════════

  const startSOSCountdown =
    useCallback((

      seconds = 5,

      customMessage = ""

    ) => {

      setCountdown(seconds);

      setCountdownActive(true);


      const interval = setInterval(() => {

        setCountdown(prev => {

          if(prev <= 1){

            clearInterval(interval);

            setCountdownActive(false);


            // TRIGGER SOS

            triggerSOS(customMessage);

            return 0;

          }

          return prev - 1;

        });

      }, 1000);

    }, []);


  // ═══════════════════════════════════════
  // CANCEL COUNTDOWN
  // ═══════════════════════════════════════

  const cancelCountdown =
    useCallback(() => {

      setCountdown(0);

      setCountdownActive(false);

    }, []);


  // ═══════════════════════════════════════
  // TRIGGER SOS
  // ═══════════════════════════════════════

  const triggerSOS =
    useCallback(async(

      customMessage = ""

    ) => {

      const result =

        await sendSOS(customMessage);


      if(result.success){

        setLastSOS(result.alert);

      }

      return result;

    },

    [sendSOS]);


  // ═══════════════════════════════════════
  // QUICK SOS
  // ═══════════════════════════════════════

  const quickSOS =
    useCallback(async() => {

      return await triggerSOS(

        "Quick emergency SOS triggered."

      );

    }, [triggerSOS]);


  // ═══════════════════════════════════════
  // SAFE CHECK-IN
  // ═══════════════════════════════════════

  const safeCheckIn =
    useCallback(async() => {

      try{

        if(!currentLocation){

          return {

            success:false,

            message:
              "Location unavailable"

          };

        }


        const locationLink =

          `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;


        const message = `

I am safe.

Current location:
${locationLink}

Shared via SafeRoute.

        `;


        // SHARE

        if(navigator.share){

          await navigator.share({

            title:"Safe Check-In",

            text:message

          });

        }else{

          await navigator.clipboard.writeText(
            message
          );

          alert(
            "Safe check-in copied to clipboard"
          );

        }

        return {

          success:true

        };

      }catch(err){

        console.error(err);

        return {

          success:false

        };

      }

    }, [currentLocation]);


  // ═══════════════════════════════════════
  // AUTO START TRACKING
  // ═══════════════════════════════════════

  useEffect(() => {

    if(sosActive){

      startLiveTracking();

    }

  }, [sosActive]);


  // ═══════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════

  return {

    sosActive,

    liveTracking,

    currentLocation,

    trackingHistory,

    emergencyContacts,

    alerts,

    loading,

    error,

    countdown,

    countdownActive,

    lastSOS,

    triggerSOS,

    quickSOS,

    startSOSCountdown,

    cancelCountdown,

    cancelSOS,

    safeCheckIn,

    startLiveTracking,

    stopLiveTracking,

    shareLiveLocation,

    addEmergencyContact,

    removeEmergencyContact

  };

}