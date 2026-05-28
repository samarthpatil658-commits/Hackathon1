// src/components/map/MapView.jsx

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


// ═══════════════════════════════════════
// DANGER CONFIG
// ═══════════════════════════════════════

const dangerConfig = {

  harassment : {
    color  : "#ff3d6e",
    radius : 120,
    risk   : 9,
    icon   : "⚠️",
    label  : "Harassment Reported"
  },

  lighting : {
    color  : "#ffb830",
    radius : 100,
    risk   : 6,
    icon   : "🌑",
    label  : "Poor Lighting"
  },

  network : {
    color  : "#4d9fff",
    radius : 90,
    risk   : 4,
    icon   : "📵",
    label  : "No Network Coverage"
  },

  night : {
    color  : "#9b59b6",
    radius : 140,
    risk   : 7,
    icon   : "🌙",
    label  : "Unsafe At Night"
  }

};


// ═══════════════════════════════════════
// PRESEEDED DANGER ZONES
// ═══════════════════════════════════════

const preseededZones = [

  {
    lat   : 12.9752,
    lng   : 77.6095,
    type  : "harassment"
  },

  {
    lat   : 12.9720,
    lng   : 77.6148,
    type  : "lighting"
  },

  {
    lat   : 12.9780,
    lng   : 77.6060,
    type  : "night"
  },

  {
    lat   : 12.9695,
    lng   : 77.6115,
    type  : "harassment"
  },

  {
    lat   : 12.9760,
    lng   : 77.6180,
    type  : "network"
  },

  {
    lat   : 12.9740,
    lng   : 77.6020,
    type  : "lighting"
  },

  {
    lat   : 12.9810,
    lng   : 77.6130,
    type  : "night"
  },

  {
    lat   : 12.9700,
    lng   : 77.6070,
    type  : "harassment"
  }

];


// ═══════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════

export default function MapView(){

  const mapRef = useRef(null);

  const mapInstance = useRef(null);

  const zoneLayers = useRef([]);

  const userMarkerRef = useRef(null);


  // ═══════════════════════════════════════
  // CREATE DANGER ZONE
  // ═══════════════════════════════════════

  const createDangerZone = (zone) => {

    const config =
      dangerConfig[zone.type];

    if(!config) return;


    // MAIN CIRCLE

    const mainCircle = L.circle(

      [zone.lat, zone.lng],

      {

        radius: config.radius,

        color: config.color,

        fillColor: config.color,

        fillOpacity: 0.22,

        weight: 2,

        opacity: 0.9

      }

    );


    // GLOW EFFECT

    const glowCircle = L.circle(

      [zone.lat, zone.lng],

      {

        radius: config.radius * 1.6,

        color: config.color,

        fillColor: config.color,

        fillOpacity: 0.05,

        weight: 1,

        opacity: 0.4

      }

    );


    // MARKER

    const marker = L.marker(

      [zone.lat, zone.lng],

      {

        icon: L.divIcon({

          className: "danger-zone-marker",

          html: `

            <div
              style="
                width:18px;
                height:18px;
                border-radius:50%;
                background:${config.color};
                border:2px solid white;
                box-shadow:0 0 12px ${config.color};
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:10px;
              "
            >
              ${config.icon}
            </div>

          `,

          iconSize:[18,18],

          iconAnchor:[9,9]

        })

      }

    );


    // POPUP

    const popupContent = `

      <div style="min-width:180px">

        <div
          style="
            display:flex;
            align-items:center;
            gap:8px;
            margin-bottom:8px;
          "
        >

          <div
            style="
              width:12px;
              height:12px;
              border-radius:50%;
              background:${config.color};
            "
          ></div>

          <strong
            style="
              color:${config.color};
              font-size:14px;
            "
          >
            ${config.label}
          </strong>

        </div>

        <div
          style="
            color:#8b8b9e;
            font-size:12px;
            line-height:1.5;
          "
        >
          Community reported unsafe area.
        </div>

        <div
          style="
            margin-top:10px;
            display:flex;
            justify-content:space-between;
            font-size:11px;
          "
        >

          <span style="color:#8b8b9e">
            Risk Score
          </span>

          <span style="color:${config.color}">
            ${config.risk}/10
          </span>

        </div>

      </div>

    `;


    mainCircle.bindPopup(popupContent);

    marker.bindPopup(popupContent);


    // ADD TO MAP

    glowCircle.addTo(mapInstance.current);

    mainCircle.addTo(mapInstance.current);

    marker.addTo(mapInstance.current);


    // SAVE REFERENCES

    zoneLayers.current.push({

      marker,

      mainCircle,

      glowCircle,

      zone

    });

  };


  // ═══════════════════════════════════════
  // LOAD ALL DANGER ZONES
  // ═══════════════════════════════════════

  const loadDangerZones = () => {

    preseededZones.forEach(zone => {

      createDangerZone(zone);

    });

  };


  // ═══════════════════════════════════════
  // PLACE USER MARKER
  // ═══════════════════════════════════════

  const placeUserMarker = (lat,lng) => {

    const icon = L.divIcon({

      className: "",

      html: `

        <div
          style="
            width:16px;
            height:16px;
            background:#00e87a;
            border-radius:50%;
            border:3px solid white;
            box-shadow:
              0 0 0 6px rgba(0,232,122,0.2);
          "
        ></div>

      `,

      iconSize:[16,16],

      iconAnchor:[8,8]

    });


    if(userMarkerRef.current){

      userMarkerRef.current.setLatLng([lat,lng]);

      return;
    }


    userMarkerRef.current = L.marker(

      [lat,lng],

      { icon }

    ).addTo(mapInstance.current);

  };


  // ═══════════════════════════════════════
  // INITIALIZE MAP
  // ═══════════════════════════════════════

  useEffect(() => {

    if(mapInstance.current) return;


    // CREATE MAP

    mapInstance.current = L.map(

      mapRef.current,

      {

        zoomControl:false,

        attributionControl:false

      }

    ).setView(

      [12.9750, 77.6100],

      15

    );


    // TILE LAYER

    L.tileLayer(

      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",

      {

        maxZoom:19

      }

    ).addTo(mapInstance.current);


    // ATTRIBUTION

    L.control.attribution({

      prefix:false,

      position:"bottomleft"

    }).addTo(mapInstance.current);


    // LOAD DANGER ZONES

    loadDangerZones();


    // USER LOCATION

    if(navigator.geolocation){

      navigator.geolocation.watchPosition(

        pos => {

          const lat =
            pos.coords.latitude;

          const lng =
            pos.coords.longitude;

          mapInstance.current.setView(
            [lat,lng],
            15
          );

          placeUserMarker(lat,lng);

        },

        err => {

          console.log(err);

        },

        {

          enableHighAccuracy:true,

          timeout:10000,

          maximumAge:0

        }

      );

    }


    // CLEANUP

    return () => {

      if(mapInstance.current){

        mapInstance.current.remove();

      }

    };

  }, []);


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div
      ref={mapRef}
      style={{
        width:"100%",
        height:"100vh"
      }}
    />

  );

}