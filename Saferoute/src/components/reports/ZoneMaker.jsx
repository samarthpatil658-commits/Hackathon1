// src/components/reports/ZoneMarker.jsx

import { useEffect, useRef } from "react";
import L from "leaflet";


// ═══════════════════════════════════════
// ZONE MARKER COMPONENT
// ═══════════════════════════════════════

export default function ZoneMarker({

  map,

  zone,

  pulse = true,

  showRadius = true,

  interactive = true,

  onClick

}){

  const markerRef = useRef(null);

  const circleRef = useRef(null);

  const glowRef = useRef(null);


  // ═══════════════════════════════════════
  // CONFIG
  // ═══════════════════════════════════════

  const zoneConfig = {

    harassment : {

      color:"#ff3d6e",

      radius:140,

      icon:"⚠️",

      label:"Harassment Reported",

      risk:9

    },

    lighting : {

      color:"#ffb830",

      radius:100,

      icon:"🌑",

      label:"Poor Lighting",

      risk:6

    },

    network : {

      color:"#4d9fff",

      radius:90,

      icon:"📵",

      label:"No Network Coverage",

      risk:4

    },

    night : {

      color:"#9b59b6",

      radius:150,

      icon:"🌙",

      label:"Unsafe At Night",

      risk:7

    },

    theft : {

      color:"#ff6b00",

      radius:120,

      icon:"🚨",

      label:"Theft Risk",

      risk:8

    }

  };


  // ═══════════════════════════════════════
  // GET CONFIG
  // ═══════════════════════════════════════

  const config =

    zoneConfig[zone.type] ||

    zoneConfig.harassment;


  // ═══════════════════════════════════════
  // CREATE POPUP
  // ═══════════════════════════════════════

  const createPopupContent = () => {

    return `

      <div
        style="
          min-width:220px;
          color:white;
        "
      >

        <div
          style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:14px;
          "
        >

          <div
            style="
              width:38px;
              height:38px;
              border-radius:12px;
              background:${config.color}20;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:20px;
            "
          >
            ${config.icon}
          </div>

          <div>

            <div
              style="
                color:${config.color};
                font-size:15px;
                font-weight:700;
              "
            >
              ${config.label}
            </div>

            <div
              style="
                color:#8b8b9e;
                font-size:11px;
                margin-top:2px;
              "
            >
              Community Safety Alert
            </div>

          </div>

        </div>


        <div
          style="
            color:#d6d6e7;
            font-size:12px;
            line-height:1.6;
            margin-bottom:14px;
          "
        >

          ${
            zone.description ||

            "Users have reported this area as potentially unsafe."
          }

        </div>


        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:10px;
          "
        >

          <span
            style="
              color:#8b8b9e;
              font-size:11px;
            "
          >
            Risk Score
          </span>

          <span
            style="
              color:${config.color};
              font-size:13px;
              font-weight:700;
            "
          >
            ${config.risk}/10
          </span>

        </div>


        <div
          style="
            width:100%;
            height:8px;
            background:#23232d;
            border-radius:999px;
            overflow:hidden;
          "
        >

          <div
            style="
              width:${config.risk * 10}%;
              height:100%;
              background:${config.color};
              border-radius:999px;
            "
          ></div>

        </div>


        <div
          style="
            margin-top:12px;
            display:flex;
            justify-content:space-between;
            color:#8b8b9e;
            font-size:10px;
          "
        >

          <span>
            ${
              zone.severity
                ? zone.severity.toUpperCase()
                : "MEDIUM"
            }
          </span>

          <span>
            ${
              zone.createdAt
                ? new Date(
                    zone.createdAt
                  ).toLocaleDateString()
                : "Recently Reported"
            }
          </span>

        </div>

      </div>

    `;
  };


  // ═══════════════════════════════════════
  // CREATE MARKER
  // ═══════════════════════════════════════

  useEffect(() => {

    if(!map || !zone) return;


    // MAIN MARKER

    markerRef.current = L.marker(

      [zone.lat, zone.lng],

      {

        interactive,

        zIndexOffset:500,

        icon:L.divIcon({

          className:"",

          html:`

            <div
              style="
                position:relative;
                width:22px;
                height:22px;
              "
            >

              ${
                pulse

                ?

                `
                <div
                  style="
                    position:absolute;
                    inset:-8px;
                    border-radius:50%;
                    border:2px solid ${config.color};
                    animation:zonePulse 2s infinite;
                  "
                ></div>
                `

                :

                ""
              }

              <div
                style="
                  width:22px;
                  height:22px;
                  border-radius:50%;
                  background:${config.color};
                  border:3px solid white;
                  box-shadow:
                    0 0 16px ${config.color};
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-size:10px;
                "
              >
                ${config.icon}
              </div>

            </div>

          `,

          iconSize:[22,22],

          iconAnchor:[11,11]

        })

      }

    );


    // GLOW CIRCLE

    glowRef.current = L.circle(

      [zone.lat, zone.lng],

      {

        radius:config.radius * 1.7,

        color:config.color,

        fillColor:config.color,

        fillOpacity:0.04,

        weight:1,

        opacity:0.25,

        interactive:false

      }

    );


    // MAIN RADIUS

    if(showRadius){

      circleRef.current = L.circle(

        [zone.lat, zone.lng],

        {

          radius:config.radius,

          color:config.color,

          fillColor:config.color,

          fillOpacity:0.18,

          weight:2,

          opacity:0.7,

          interactive:false

        }

      );

    }


    // POPUP

    markerRef.current.bindPopup(

      createPopupContent(),

      {

        className:"danger-popup"

      }

    );


    // CLICK EVENT

    markerRef.current.on("click", () => {

      if(onClick){

        onClick(zone);

      }

    });


    // ADD TO MAP

    glowRef.current.addTo(map);

    markerRef.current.addTo(map);

    circleRef.current?.addTo(map);


    // CLEANUP

    return () => {

      if(markerRef.current){

        map.removeLayer(
          markerRef.current
        );

      }

      if(circleRef.current){

        map.removeLayer(
          circleRef.current
        );

      }

      if(glowRef.current){

        map.removeLayer(
          glowRef.current
        );

      }

    };

  }, [map, zone]);


  // ═══════════════════════════════════════
  // PULSE ANIMATION
  // ═══════════════════════════════════════

  useEffect(() => {

    const style =
      document.createElement("style");

    style.innerHTML = `

      @keyframes zonePulse{

        0%{

          transform:scale(0.7);

          opacity:0.9;

        }

        70%{

          transform:scale(1.8);

          opacity:0;

        }

        100%{

          transform:scale(1.8);

          opacity:0;

        }

      }

      .danger-popup
      .leaflet-popup-content-wrapper{

        background:#13131a;

        color:white;

        border-radius:18px;

        border:1px solid
          rgba(255,255,255,0.08);
      }

      .danger-popup
      .leaflet-popup-tip{

        background:#13131a;
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