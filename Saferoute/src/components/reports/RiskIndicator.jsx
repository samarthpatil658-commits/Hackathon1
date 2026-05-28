// src/components/reports/RiskIndicator.jsx

import { useMemo } from "react";


// ═══════════════════════════════════════
// RISK INDICATOR COMPONENT
// ═══════════════════════════════════════

export default function RiskIndicator({

  risk = 0,

  riskyPoints = 0,

  safe = true,

  routeType = "Safest Route",

  distance = "0 km",

  duration = "0 min",

  compact = false

}){


  // ═══════════════════════════════════════
  // RISK DATA
  // ═══════════════════════════════════════

  const riskData = useMemo(() => {

    if(risk <= 3){

      return {

        label:"Low Risk",

        color:"#00e87a",

        bg:"rgba(0,232,122,0.12)",

        icon:"🛡️",

        message:
          "This route avoids most unsafe areas."

      };

    }

    if(risk <= 6){

      return {

        label:"Medium Risk",

        color:"#ffb830",

        bg:"rgba(255,184,48,0.12)",

        icon:"⚠️",

        message:
          "Some reported unsafe areas nearby."

      };

    }

    return {

      label:"High Risk",

      color:"#ff3d6e",

      bg:"rgba(255,61,110,0.12)",

      icon:"🚨",

      message:
        "Danger zones detected on this route."

    };

  }, [risk]);


  // ═══════════════════════════════════════
  // SAFETY SCORE
  // ═══════════════════════════════════════

  const safetyScore = useMemo(() => {

    const score =
      Math.max(0, 100 - (risk * 10));

    return Math.round(score);

  }, [risk]);


  // ═══════════════════════════════════════
  // COMPACT MODE
  // ═══════════════════════════════════════

  if(compact){

    return (

      <div
        style={{
          ...styles.compactCard,
          border:`1px solid ${riskData.color}30`
        }}
      >

        <div style={styles.compactLeft}>

          <div
            style={{
              ...styles.compactIcon,
              background:riskData.bg
            }}
          >
            {riskData.icon}
          </div>

          <div>

            <div
              style={{
                ...styles.compactTitle,
                color:riskData.color
              }}
            >
              {riskData.label}
            </div>

            <div style={styles.compactSubtitle}>
              {distance} • {duration}
            </div>

          </div>

        </div>

        <div
          style={{
            ...styles.compactScore,
            color:riskData.color
          }}
        >
          {safetyScore}%
        </div>

      </div>

    );

  }


  // ═══════════════════════════════════════
  // FULL UI
  // ═══════════════════════════════════════

  return (

    <div style={styles.container}>


      {/* HEADER */}

      <div style={styles.header}>


        <div style={styles.left}>


          <div
            style={{
              ...styles.iconWrapper,
              background:riskData.bg
            }}
          >
            {riskData.icon}
          </div>


          <div>

            <div style={styles.routeType}>
              {routeType}
            </div>

            <div
              style={{
                ...styles.riskLabel,
                color:riskData.color
              }}
            >
              {riskData.label}
            </div>

          </div>

        </div>


        {/* SAFETY SCORE */}

        <div style={styles.scoreContainer}>

          <div
            style={{
              ...styles.scoreCircle,

              background:`
                conic-gradient(
                  ${riskData.color}
                  ${safetyScore * 3.6}deg,

                  rgba(255,255,255,0.08)
                  0deg
                )
              `
            }}
          >

            <div style={styles.scoreInner}>

              <span
                style={{
                  ...styles.scoreText,
                  color:riskData.color
                }}
              >
                {safetyScore}
              </span>

            </div>

          </div>

          <div style={styles.scoreLabel}>
            Safety Score
          </div>

        </div>

      </div>


      {/* MESSAGE */}

      <div
        style={{
          ...styles.messageBox,
          background:riskData.bg
        }}
      >

        <div style={styles.messageText}>
          {riskData.message}
        </div>

      </div>


      {/* STATS */}

      <div style={styles.statsRow}>


        <div style={styles.statCard}>

          <div style={styles.statValue}>
            {distance}
          </div>

          <div style={styles.statLabel}>
            Distance
          </div>

        </div>


        <div style={styles.statCard}>

          <div style={styles.statValue}>
            {duration}
          </div>

          <div style={styles.statLabel}>
            Duration
          </div>

        </div>


        <div style={styles.statCard}>

          <div
            style={{
              ...styles.statValue,
              color:riskData.color
            }}
          >
            {riskyPoints}
          </div>

          <div style={styles.statLabel}>
            Risk Points
          </div>

        </div>

      </div>


      {/* STATUS */}

      <div
        style={{
          ...styles.statusBox,

          background:safe
            ? "rgba(0,232,122,0.12)"
            : "rgba(255,61,110,0.12)"
        }}
      >

        <div
          style={{
            ...styles.statusDot,

            background:safe
              ? "#00e87a"
              : "#ff3d6e"
          }}
        />

        <div
          style={{
            ...styles.statusText,

            color:safe
              ? "#00e87a"
              : "#ff3d6e"
          }}
        >

          {safe

            ? "Safe route available"

            : "No completely safe route available"}

        </div>

      </div>

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

    borderRadius:"26px",

    padding:"22px",

    border:"1px solid rgba(255,255,255,0.06)",

    display:"flex",

    flexDirection:"column",

    gap:"22px",

    boxShadow:"0 10px 30px rgba(0,0,0,0.25)"

  },

  header: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    gap:"20px"

  },

  left: {

    display:"flex",

    alignItems:"center",

    gap:"16px"

  },

  iconWrapper: {

    width:"58px",

    height:"58px",

    borderRadius:"18px",

    display:"flex",

    alignItems:"center",

    justifyContent:"center",

    fontSize:"28px"

  },

  routeType: {

    color:"#ffffff",

    fontSize:"18px",

    fontWeight:"700"

  },

  riskLabel: {

    marginTop:"6px",

    fontSize:"13px",

    fontWeight:"600"

  },

  scoreContainer: {

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    gap:"8px"

  },

  scoreCircle: {

    width:"82px",

    height:"82px",

    borderRadius:"50%",

    display:"flex",

    alignItems:"center",

    justifyContent:"center"

  },

  scoreInner: {

    width:"64px",

    height:"64px",

    borderRadius:"50%",

    background:"#13131a",

    display:"flex",

    alignItems:"center",

    justifyContent:"center"

  },

  scoreText: {

    fontSize:"20px",

    fontWeight:"800"

  },

  scoreLabel: {

    color:"#8b8b9e",

    fontSize:"11px"

  },

  messageBox: {

    borderRadius:"18px",

    padding:"16px"

  },

  messageText: {

    color:"#ffffff",

    fontSize:"13px",

    lineHeight:"1.6"

  },

  statsRow: {

    display:"grid",

    gridTemplateColumns:"1fr 1fr 1fr",

    gap:"14px"

  },

  statCard: {

    background:"#1c1c26",

    borderRadius:"18px",

    padding:"16px",

    textAlign:"center"

  },

  statValue: {

    color:"#ffffff",

    fontSize:"18px",

    fontWeight:"700"

  },

  statLabel: {

    marginTop:"6px",

    color:"#8b8b9e",

    fontSize:"11px"

  },

  statusBox: {

    borderRadius:"16px",

    padding:"14px 16px",

    display:"flex",

    alignItems:"center",

    gap:"10px"

  },

  statusDot: {

    width:"10px",

    height:"10px",

    borderRadius:"50%"

  },

  statusText: {

    fontSize:"13px",

    fontWeight:"700"

  },

  compactCard: {

    width:"100%",

    background:"#13131a",

    borderRadius:"20px",

    padding:"16px",

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center"

  },

  compactLeft: {

    display:"flex",

    alignItems:"center",

    gap:"14px"

  },

  compactIcon: {

    width:"48px",

    height:"48px",

    borderRadius:"14px",

    display:"flex",

    alignItems:"center",

    justifyContent:"center",

    fontSize:"22px"

  },

  compactTitle: {

    fontSize:"15px",

    fontWeight:"700"

  },

  compactSubtitle: {

    marginTop:"4px",

    color:"#8b8b9e",

    fontSize:"12px"

  },

  compactScore: {

    fontSize:"22px",

    fontWeight:"800"

  }

};