// src/context/RouteContext.jsx

import {

  createContext,

  useContext,

  useMemo,

  useState

} from "react";


// ═══════════════════════════════════════
// ROUTE CONTEXT
// ═══════════════════════════════════════

const RouteContext =
  createContext(null);


// ═══════════════════════════════════════
// ROUTE PROVIDER
// ═══════════════════════════════════════

export function RouteProvider({

  children

}){

  const [source, setSource] =
    useState(null);

  const [destination, setDestination] =
    useState(null);

  const [routeData, setRouteData] =
    useState(null);

  const [alternativeRoutes, setAlternativeRoutes] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [dangerZones, setDangerZones] =
    useState([]);

  const [riskScore, setRiskScore] =
    useState(0);

  const [safeRouteAvailable, setSafeRouteAvailable] =
    useState(true);


  // ═══════════════════════════════════════
  // FETCH DANGER ZONES
  // ═══════════════════════════════════════

  const loadDangerZones = () => {

    try{

      const reports =

        JSON.parse(

          localStorage.getItem(
            "dangerReports"
          )

        ) || [];


      setDangerZones(reports);

      return reports;

    }catch(err){

      console.error(err);

      return [];

    }

  };


  // ═══════════════════════════════════════
  // CALCULATE ROUTE RISK
  // ═══════════════════════════════════════

  const calculateRisk = (

    routeCoordinates,

    zones

  ) => {

    let score = 0;

    let unsafeDetected = false;


    routeCoordinates.forEach(coord => {

      zones.forEach(zone => {

        const distance =

          getDistance(

            coord[1],

            coord[0],

            zone.lat,

            zone.lng

          );


        // WITHIN DANGER RADIUS

        if(distance < 0.5){

          unsafeDetected = true;

          score +=

            zone.severity === "high"

            ? 3

            : zone.severity === "medium"

              ? 2

              : 1;

        }

      });

    });


    return {

      score,

      safe:!unsafeDetected

    };

  };


  // ═══════════════════════════════════════
  // HAVERSINE DISTANCE
  // ═══════════════════════════════════════

  const getDistance = (

    lat1,

    lon1,

    lat2,

    lon2

  ) => {

    const R = 6371;

    const dLat =
      (lat2 - lat1) * Math.PI / 180;

    const dLon =
      (lon2 - lon1) * Math.PI / 180;

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
      2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;

  };


  // ═══════════════════════════════════════
  // FETCH SAFE ROUTE
  // ═══════════════════════════════════════

  const fetchSafeRoute = async({

    source,

    destination

  }) => {

    try{

      setLoading(true);

      setError("");


      setSource(source);

      setDestination(destination);


      const zones =
        loadDangerZones();


      // OSRM ROUTING API

      const response = await fetch(

        `https://router.project-osrm.org/route/v1/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?overview=full&alternatives=true&geometries=geojson`

      );


      const data =
        await response.json();


      if(!data.routes){

        throw new Error(
          "No routes found"
        );

      }


      // ANALYZE ROUTES

      const analyzedRoutes =

        data.routes.map(route => {

          const riskAnalysis =

            calculateRisk(

              route.geometry.coordinates,

              zones

            );


          return {

            ...route,

            risk:riskAnalysis.score,

            safe:riskAnalysis.safe

          };

        });


      // SORT SAFEST FIRST

      analyzedRoutes.sort(

        (a,b) => a.risk - b.risk

      );


      const safestRoute =
        analyzedRoutes[0];


      setRouteData(safestRoute);

      setAlternativeRoutes(
        analyzedRoutes
      );

      setRiskScore(
        safestRoute.risk
      );

      setSafeRouteAvailable(
        safestRoute.safe
      );


      return {

        success:true,

        route:safestRoute

      };

    }catch(err){

      console.error(err);

      setError(
        "Failed to fetch route"
      );

      return {

        success:false,

        message:
          "Unable to calculate safe route"

      };

    }finally{

      setLoading(false);

    }

  };


  // ═══════════════════════════════════════
  // CLEAR ROUTE
  // ═══════════════════════════════════════

  const clearRoute = () => {

    setRouteData(null);

    setAlternativeRoutes([]);

    setRiskScore(0);

    setSource(null);

    setDestination(null);

    setError("");

  };


  // ═══════════════════════════════════════
  // REFRESH DANGER ZONES
  // ═══════════════════════════════════════

  const refreshDangerZones = () => {

    loadDangerZones();

  };


  // ═══════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════

  const value = useMemo(() => ({

    source,

    destination,

    routeData,

    alternativeRoutes,

    loading,

    error,

    dangerZones,

    riskScore,

    safeRouteAvailable,

    fetchSafeRoute,

    clearRoute,

    refreshDangerZones

  }),

  [

    source,

    destination,

    routeData,

    alternativeRoutes,

    loading,

    error,

    dangerZones,

    riskScore,

    safeRouteAvailable

  ]);


  // ═══════════════════════════════════════
  // PROVIDER
  // ═══════════════════════════════════════

  return (

    <RouteContext.Provider value={value}>

      {children}

    </RouteContext.Provider>

  );

}


// ═══════════════════════════════════════
// USE ROUTE HOOK
// ═══════════════════════════════════════

export function useRoute(){

  const context =
    useContext(RouteContext);

  if(!context){

    throw new Error(

      "useRoute must be used inside RouteProvider"

    );

  }

  return context;

}