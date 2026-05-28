// src/components/map/UserMarker.jsx

import { useEffect, useRef } from "react";
import L from "leaflet";


// ═══════════════════════════════════════
// USER MARKER COMPONENT
// ═══════════════════════════════════════

export default function UserMarker({

  map,

  followUser = true,

  zoomLevel = 15,

  onLocationUpdate,

  onLocationError

}){

  const markerRef = useRef(null);

  const accuracyCircleRef = useRef(null);

  const watchIdRef = useRef(null);


  // ═══════════════════════════════════════
  // CREATE USER ICON
  // ═══════════════════════════════════════

  const createUserIcon = () => {

    return L.divIcon({

      className:"",

      html:`

        <div
          style="
            position:relative;
            width:18px;
            height:18px;
          "
        >

          <div
            style="
              position:absolute;
              inset:0;
              border-radius:50%;
              background:#00e87a;
              border:3px solid white;
              box-shadow:
                0 0 0 6px rgba(0,232,122,0.25),
                0 0 16px rgba(0,232,122,0.7);
            "
          ></div>

          <div
            style="
              position:absolute;
              inset:-8px;
              border-radius:50%;
              border:2px solid rgba(0,232,122,0.25);
              animation:pulse-user-marker 2s infinite;
            "
          ></div>

        </div>

      `,

      iconSize:[18,18],

      iconAnchor:[9,9]

    });

  };


  // ═══════════════════════════════════════
  // CREATE OR UPDATE MARKER
  // ═══════════════════════════════════════

  const updateUserMarker = (

    lat,

    lng,

    accuracy

  ) => {

    const position = [lat,lng];


    // CREATE MARKER

    if(!markerRef.current){

      markerRef.current = L.marker(

        position,

        {

          icon:createUserIcon(),

          zIndexOffset:9999

        }

      ).addTo(map);

    }else{

      markerRef.current.setLatLng(position);

    }


    // ACCURACY CIRCLE

    if(!accuracyCircleRef.current){

      accuracyCircleRef.current = L.circle(

        position,

        {

          radius:accuracy,

          color:"#00e87a",

          fillColor:"#00e87a",

          fillOpacity:0.08,

          weight:1,

          opacity:0.25

        }

      ).addTo(map);

    }else{

      accuracyCircleRef.current.setLatLng(position);

      accuracyCircleRef.current.setRadius(accuracy);

    }


    // FOLLOW USER

    if(followUser){

      map.setView(position, zoomLevel);

    }


    // CALLBACK

    if(onLocationUpdate){

      onLocationUpdate({

        lat,

        lng,

        accuracy

      });

    }

  };


  // ═══════════════════════════════════════
  // START GPS TRACKING
  // ═══════════════════════════════════════

  const startTracking = () => {

    if(!navigator.geolocation){

      if(onLocationError){

        onLocationError(
          "Geolocation not supported"
        );

      }

      return;
    }


    watchIdRef.current =

      navigator.geolocation.watchPosition(

        position => {

          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;

          const accuracy =
            position.coords.accuracy;


          updateUserMarker(

            lat,

            lng,

            accuracy

          );

        },

        error => {

          console.error(error);

          let message =
            "Location access failed";


          switch(error.code){

            case error.PERMISSION_DENIED:

              message =
                "Location permission denied";

              break;

            case error.POSITION_UNAVAILABLE:

              message =
                "Location unavailable";

              break;

            case error.TIMEOUT:

              message =
                "Location request timeout";

              break;

            default:

              break;
          }


          if(onLocationError){

            onLocationError(message);

          }

        },

        {

          enableHighAccuracy:true,

          timeout:10000,

          maximumAge:0

        }

      );

  };


  // ═══════════════════════════════════════
  // STOP GPS TRACKING
  // ═══════════════════════════════════════

  const stopTracking = () => {

    if(watchIdRef.current){

      navigator.geolocation.clearWatch(

        watchIdRef.current

      );

    }

  };


  // ═══════════════════════════════════════
  // EFFECT
  // ═══════════════════════════════════════

  useEffect(() => {

    if(!map) return;

    startTracking();


    return () => {

      stopTracking();

      if(markerRef.current){

        map.removeLayer(

          markerRef.current

        );

      }

      if(accuracyCircleRef.current){

        map.removeLayer(

          accuracyCircleRef.current

        );

      }

    };

  }, [map]);


  // ═══════════════════════════════════════
  // ADD PULSE ANIMATION
  // ═══════════════════════════════════════

  useEffect(() => {

    const style = document.createElement("style");

    style.innerHTML = `

      @keyframes pulse-user-marker{

        0%{

          transform:scale(0.8);

          opacity:0.9;

        }

        70%{

          transform:scale(1.5);

          opacity:0;

        }

        100%{

          transform:scale(1.5);

          opacity:0;

        }

      }

    `;

    document.head.appendChild(style);

    return () => {

      document.head.removeChild(style);

    };

  }, []);


  // ═══════════════════════════════════════
  // NO JSX UI
  // ═══════════════════════════════════════

  return null;

}