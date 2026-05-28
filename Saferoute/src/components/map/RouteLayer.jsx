import { useEffect, useRef } from "react";
import L from "leaflet";


// ═══════════════════════════════════════
// ROUTE LAYER COMPONENT
// ═══════════════════════════════════════

export default function RouteLayer({

  map,

  source,

  destination,

  dangerZones = [],

  onRouteCalculated,

  onRouteError

}){

  const currentRouteRef = useRef(null);

  const routeMarkersRef = useRef([]);


  // ═══════════════════════════════════════
  // CALCULATE ZONE RISK
  // ═══════════════════════════════════════

  const calculateZoneRisk = (lat,lng) => {

    let totalRisk = 0;

    dangerZones.forEach(zone => {

      const dist = map.distance(

        [lat,lng],

        [zone.lat,zone.lng]

      );

      let radius = 120;
      let risk = 5;

      switch(zone.type){

        case "harassment":
          radius = 140;
          risk = 10;
          break;

        case "lighting":
          radius = 100;
          risk = 6;
          break;

        case "night":
          radius = 160;
          risk = 8;
          break;

        case "network":
          radius = 90;
          risk = 4;
          break;

        default:
          break;
      }

      if(dist < radius){

        totalRisk += risk;

      }else if(dist < radius * 2){

        totalRisk += risk * 0.5;

      }

    });

    return totalRisk;
  };


  // ═══════════════════════════════════════
  // CHECK ROUTE SAFETY
  // ═══════════════════════════════════════

  const analyzeRouteSafety = (coordinates) => {

    let riskyPoints = 0;

    let totalRisk = 0;

    coordinates.forEach(coord => {

      const lng = coord[0];

      const lat = coord[1];

      const risk =
        calculateZoneRisk(lat,lng);

      totalRisk += risk;

      if(risk > 5){

        riskyPoints++;

      }

    });

    const avgRisk =
      totalRisk / coordinates.length;

    return {

      riskyPoints,

      avgRisk,

      safe: riskyPoints < 15

    };

  };


  // ═══════════════════════════════════════
  // CLEAR EXISTING ROUTE
  // ═══════════════════════════════════════

  const clearRoute = () => {

    if(currentRouteRef.current){

      map.removeLayer(
        currentRouteRef.current
      );

      currentRouteRef.current = null;
    }

    routeMarkersRef.current.forEach(marker => {

      map.removeLayer(marker);

    });

    routeMarkersRef.current = [];
  };


  // ═══════════════════════════════════════
  // CREATE ROUTE MARKERS
  // ═══════════════════════════════════════

  const createRouteMarkers = () => {

    if(!source || !destination) return;


    // SOURCE MARKER

    const sourceMarker = L.marker(

      [source.lat, source.lng],

      {

        icon: L.divIcon({

          className:"",

          html:`

            <div
              style="
                width:18px;
                height:18px;
                border-radius:50%;
                background:#00e87a;
                border:3px solid white;
                box-shadow:
                  0 0 12px rgba(0,232,122,0.8);
              "
            ></div>

          `,

          iconSize:[18,18],

          iconAnchor:[9,9]

        })

      }

    ).addTo(map);


    // DESTINATION MARKER

    const destinationMarker = L.marker(

      [destination.lat, destination.lng],

      {

        icon: L.divIcon({

          className:"",

          html:`

            <div
              style="
                width:18px;
                height:18px;
                border-radius:50%;
                background:#ff3d6e;
                border:3px solid white;
                box-shadow:
                  0 0 12px rgba(255,61,110,0.8);
              "
            ></div>

          `,

          iconSize:[18,18],

          iconAnchor:[9,9]

        })

      }

    ).addTo(map);


    routeMarkersRef.current = [

      sourceMarker,

      destinationMarker

    ];
  };


  // ═══════════════════════════════════════
  // FETCH SAFE ROUTE
  // ═══════════════════════════════════════

  const fetchSafeRoute = async() => {

    if(!source || !destination || !map){

      return;
    }

    try{

      clearRoute();

      createRouteMarkers();


      // OSRM ROUTING API

      const start =
        `${source.lng},${source.lat}`;

      const end =
        `${destination.lng},${destination.lat}`;

      const url =

        `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;


      const response =
        await fetch(url);

      const data =
        await response.json();


      if(!data.routes || !data.routes.length){

        throw new Error(
          "No route found"
        );
      }


      const route =
        data.routes[0];

      const coordinates =
        route.geometry.coordinates;


      // SAFETY ANALYSIS

      const safety =
        analyzeRouteSafety(coordinates);


      // ROUTE COLOR

      let routeColor = "#00e87a";

      if(safety.avgRisk > 8){

        routeColor = "#ff3d6e";

      }else if(safety.avgRisk > 4){

        routeColor = "#ffb830";

      }


      // DRAW ROUTE

      currentRouteRef.current =

        L.geoJSON(

          route.geometry,

          {

            style:{

              color: routeColor,

              weight: 6,

              opacity: 0.9,

              lineJoin:"round",

              lineCap:"round"

            }

          }

        ).addTo(map);


      // FIT MAP

      map.fitBounds(

        currentRouteRef.current.getBounds(),

        {

          padding:[60,60]

        }

      );


      // CALLBACK

      if(onRouteCalculated){

        onRouteCalculated({

          distance:
            (route.distance / 1000).toFixed(1),

          duration:
            Math.ceil(route.duration / 60),

          risk:
            safety.avgRisk.toFixed(1),

          riskyPoints:
            safety.riskyPoints,

          safe:
            safety.safe,

          routeColor

        });

      }


      // WARNING

      if(!safety.safe){

        console.warn(
          "Unsafe route detected"
        );
      }

    }catch(err){

      console.error(err);

      if(onRouteError){

        onRouteError(err.message);

      }

    }

  };


  // ═══════════════════════════════════════
  // EFFECT
  // ═══════════════════════════════════════

  useEffect(() => {

    fetchSafeRoute();

    return () => {

      clearRoute();

    };

  }, [source, destination]);


  // ═══════════════════════════════════════
  // NO UI
  // ═══════════════════════════════════════

  return null;

}