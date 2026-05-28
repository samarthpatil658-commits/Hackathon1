// ═══════════════════════════════════════
// SAFEROUTE — DANGER ZONES SYSTEM
// FULL FILE
// ═══════════════════════════════════════


// ───────────────────────────────────────
// GLOBAL STORAGE
// ───────────────────────────────────────

const zoneLayers = [];


// ───────────────────────────────────────
// DANGER ZONE CONFIG
// ───────────────────────────────────────

const dangerConfig = {

  harassment : {

    color  : '#ff3d6e',

    radius : 120,

    risk   : 9,

    icon   : '⚠️',

    label  : 'Harassment Reported'

  },

  lighting : {

    color  : '#ffb830',

    radius : 100,

    risk   : 6,

    icon   : '🌑',

    label  : 'Poor Lighting'

  },

  network : {

    color  : '#4d9fff',

    radius : 90,

    risk   : 4,

    icon   : '📵',

    label  : 'No Network Coverage'

  },

  night : {

    color  : '#9b59b6',

    radius : 140,

    risk   : 7,

    icon   : '🌙',

    label  : 'Unsafe At Night'

  }

};


// ───────────────────────────────────────
// PRESEEDED DANGER ZONES
// ───────────────────────────────────────

const preseededZones = [

  {
    lat   : 12.9752,
    lng   : 77.6095,
    type  : 'harassment'
  },

  {
    lat   : 12.9720,
    lng   : 77.6148,
    type  : 'lighting'
  },

  {
    lat   : 12.9780,
    lng   : 77.6060,
    type  : 'night'
  },

  {
    lat   : 12.9695,
    lng   : 77.6115,
    type  : 'harassment'
  },

  {
    lat   : 12.9760,
    lng   : 77.6180,
    type  : 'network'
  },

  {
    lat   : 12.9740,
    lng   : 77.6020,
    type  : 'lighting'
  },

  {
    lat   : 12.9810,
    lng   : 77.6130,
    type  : 'night'
  },

  {
    lat   : 12.9700,
    lng   : 77.6070,
    type  : 'harassment'
  }

];


// ───────────────────────────────────────
// CREATE DANGER ZONE
// ───────────────────────────────────────

function createDangerZone(zone){

  const config =
    dangerConfig[zone.type];

  if(!config) return;


  // MAIN ZONE CIRCLE

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


  // OUTER GLOW

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

        className: 'danger-zone-marker',

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

  glowCircle.addTo(map);

  mainCircle.addTo(map);

  marker.addTo(map);


  // STORE REFERENCES

  zoneLayers.push({

    marker,

    mainCircle,

    glowCircle,

    zone

  });

}


// ───────────────────────────────────────
// LOAD ALL ZONES
// ───────────────────────────────────────

function loadDangerZones(){

  preseededZones.forEach(zone => {

    createDangerZone(zone);

  });

}


// ───────────────────────────────────────
// CLEAR ALL ZONES
// ───────────────────────────────────────

function clearDangerZones(){

  zoneLayers.forEach(layer => {

    map.removeLayer(layer.marker);

    map.removeLayer(layer.mainCircle);

    map.removeLayer(layer.glowCircle);

  });

}


// ───────────────────────────────────────
// CALCULATE ZONE RISK
// ───────────────────────────────────────

function calculateZoneRisk(lat,lng){

  let totalRisk = 0;

  zoneLayers.forEach(layer => {

    const config =
      dangerConfig[layer.zone.type];

    const dist = map.distance(

      [lat,lng],

      [layer.zone.lat,layer.zone.lng]

    );

    if(dist < config.radius){

      totalRisk += config.risk;

    }

    else if(dist < config.radius * 2){

      totalRisk += config.risk * 0.5;

    }

  });

  return totalRisk;
}


// ───────────────────────────────────────
// CHECK ROUTE SAFETY
// ───────────────────────────────────────

function isRouteSafe(routeCoords){

  let riskyPoints = 0;

  routeCoords.forEach(coord => {

    const lng = coord[0];

    const lat = coord[1];

    const risk =
      calculateZoneRisk(lat,lng);

    if(risk > 5){

      riskyPoints++;

    }

  });

  return {

    safe: riskyPoints < 15,

    riskyPoints

  };

}


// ───────────────────────────────────────
// ADD USER REPORTED ZONE
// ───────────────────────────────────────

function reportDangerZone(lat,lng,type){

  createDangerZone({

    lat,

    lng,

    type

  });

}


// ───────────────────────────────────────
// GET ALL ACTIVE ZONES
// ───────────────────────────────────────

function getAllDangerZones(){

  return zoneLayers.map(layer => layer.zone);

}


// ───────────────────────────────────────
// FIND NEARBY DANGER ZONES
// ───────────────────────────────────────

function getNearbyDangerZones(lat,lng,maxDistance=250){

  return zoneLayers.filter(layer => {

    const dist = map.distance(

      [lat,lng],

      [layer.zone.lat,layer.zone.lng]

    );

    return dist <= maxDistance;

  });

}


// ───────────────────────────────────────
// HIGHLIGHT HIGH RISK ZONES
// ───────────────────────────────────────

function highlightHighRiskZones(){

  zoneLayers.forEach(layer => {

    const config =
      dangerConfig[layer.zone.type];

    if(config.risk >= 7){

      layer.mainCircle.setStyle({

        fillOpacity:0.35,

        weight:3

      });

    }

  });

}


// ───────────────────────────────────────
// FLASH ZONE ALERT
// ───────────────────────────────────────

function flashDangerZone(zoneType){

  zoneLayers.forEach(layer => {

    if(layer.zone.type === zoneType){

      let visible = true;

      const interval = setInterval(() => {

        visible = !visible;

        layer.mainCircle.setStyle({

          opacity: visible ? 1 : 0.3

        });

      },300);

      setTimeout(() => {

        clearInterval(interval);

        layer.mainCircle.setStyle({

          opacity:0.9

        });

      },3000);

    }

  });

}


// ───────────────────────────────────────
// INITIALIZE SYSTEM
// ───────────────────────────────────────

function initDangerZones(){

  loadDangerZones();

  highlightHighRiskZones();

  console.log(
    'Danger Zones Loaded:',
    zoneLayers.length
  );

}


// ───────────────────────────────────────
// AUTO START
// ───────────────────────────────────────

window.addEventListener('load', () => {

  initDangerZones();

});