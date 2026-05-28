// src/components/reports/ReportZoneModal.jsx

import { useState } from "react";


// ═══════════════════════════════════════
// REPORT ZONE MODAL
// ═══════════════════════════════════════

export default function ReportZoneModal({

  isOpen,

  onClose,

  onSubmit,

  coordinates

}){

  const [selectedType, setSelectedType] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [severity, setSeverity] =
    useState("medium");

  const [isAnonymous, setIsAnonymous] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});


  // ═══════════════════════════════════════
  // ZONE TYPES
  // ═══════════════════════════════════════

  const zoneTypes = [

    {

      id:"harassment",

      label:"Harassment",

      icon:"⚠️",

      color:"#ff3d6e"

    },

    {

      id:"lighting",

      label:"Poor Lighting",

      icon:"🌑",

      color:"#ffb830"

    },

    {

      id:"network",

      label:"No Network",

      icon:"📵",

      color:"#4d9fff"

    },

    {

      id:"night",

      label:"Unsafe At Night",

      icon:"🌙",

      color:"#9b59b6"

    },

    {

      id:"theft",

      label:"Theft Risk",

      icon:"🚨",

      color:"#ff6b00"

    }

  ];


  // ═══════════════════════════════════════
  // VALIDATE FORM
  // ═══════════════════════════════════════

  const validateForm = () => {

    const newErrors = {};


    if(!selectedType){

      newErrors.type =
        "Please select report type";

    }


    if(description.trim().length < 10){

      newErrors.description =
        "Description must be at least 10 characters";

    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // ═══════════════════════════════════════
  // SUBMIT REPORT
  // ═══════════════════════════════════════

  const handleSubmit = async() => {

    if(!validateForm()) return;

    setLoading(true);

    try{

      const reportData = {

        id: Date.now(),

        type: selectedType,

        description,

        severity,

        anonymous:isAnonymous,

        lat: coordinates?.lat,

        lng: coordinates?.lng,

        createdAt: new Date(),

        status:"active"

      };


      // SAVE TO LOCAL STORAGE

      const existingReports =

        JSON.parse(

          localStorage.getItem(
            "dangerReports"
          )

        ) || [];


      existingReports.push(reportData);


      localStorage.setItem(

        "dangerReports",

        JSON.stringify(existingReports)

      );


      // CALLBACK

      if(onSubmit){

        onSubmit(reportData);

      }


      // RESET FORM

      setSelectedType("");

      setDescription("");

      setSeverity("medium");

      setIsAnonymous(true);

      setErrors({});


      // CLOSE

      onClose();

    }catch(err){

      console.error(err);

    }finally{

      setLoading(false);

    }

  };


  // ═══════════════════════════════════════
  // CLOSE MODAL
  // ═══════════════════════════════════════

  const handleClose = () => {

    setErrors({});

    onClose();

  };


  // ═══════════════════════════════════════
  // RETURN NULL IF CLOSED
  // ═══════════════════════════════════════

  if(!isOpen) return null;


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.overlay}>


      <div style={styles.modal}>


        {/* HEADER */}

        <div style={styles.header}>


          <div>

            <div style={styles.title}>
              Report Unsafe Area
            </div>

            <div style={styles.subtitle}>
              Help improve community safety
            </div>

          </div>


          <button
            style={styles.closeBtn}
            onClick={handleClose}
          >
            ✕
          </button>

        </div>


        {/* TYPE SELECTION */}

        <div style={styles.section}>


          <div style={styles.sectionTitle}>
            Select Report Type
          </div>


          <div style={styles.typeGrid}>


            {zoneTypes.map(type => {

              const active =
                selectedType === type.id;

              return (

                <button

                  key={type.id}

                  onClick={() =>
                    setSelectedType(type.id)
                  }

                  style={{

                    ...styles.typeCard,

                    border:active

                      ? `2px solid ${type.color}`

                      : "1px solid rgba(255,255,255,0.08)",

                    background:active

                      ? `${type.color}15`

                      : "#1c1c26"

                  }}
                >

                  <div style={styles.typeIcon}>
                    {type.icon}
                  </div>

                  <div
                    style={{

                      ...styles.typeLabel,

                      color:active
                        ? type.color
                        : "#ffffff"

                    }}
                  >
                    {type.label}
                  </div>

                </button>

              );

            })}

          </div>


          {errors.type && (

            <div style={styles.error}>
              {errors.type}
            </div>

          )}

        </div>


        {/* DESCRIPTION */}

        <div style={styles.section}>


          <div style={styles.sectionTitle}>
            Description
          </div>


          <textarea

            value={description}

            onChange={(e) =>
              setDescription(e.target.value)
            }

            placeholder="
Describe what happened or why this area feels unsafe...
            "

            style={styles.textarea}

          />


          {errors.description && (

            <div style={styles.error}>
              {errors.description}
            </div>

          )}

        </div>


        {/* SEVERITY */}

        <div style={styles.section}>


          <div style={styles.sectionTitle}>
            Severity Level
          </div>


          <div style={styles.severityRow}>


            {["low","medium","high"].map(level => (

              <button

                key={level}

                onClick={() =>
                  setSeverity(level)
                }

                style={{

                  ...styles.severityBtn,

                  background:

                    severity === level

                    ? level === "high"

                      ? "#ff3d6e"

                      : level === "medium"

                        ? "#ffb830"

                        : "#00e87a"

                    : "#1c1c26"

                }}
              >

                {level.toUpperCase()}

              </button>

            ))}

          </div>

        </div>


        {/* ANONYMOUS */}

        <div style={styles.anonymousBox}>


          <div>

            <div style={styles.anonymousTitle}>
              Anonymous Report
            </div>

            <div style={styles.anonymousSubtitle}>
              Your identity will remain hidden
            </div>

          </div>


          <button

            onClick={() =>
              setIsAnonymous(!isAnonymous)
            }

            style={{

              ...styles.toggle,

              background:
                isAnonymous
                ? "#00e87a"
                : "#2a2a35"

            }}
          >

            <div
              style={{

                ...styles.toggleDot,

                transform:isAnonymous

                  ? "translateX(22px)"

                  : "translateX(0px)"
              }}
            />

          </button>

        </div>


        {/* LOCATION */}

        <div style={styles.locationBox}>


          <div style={styles.locationTitle}>
            📍 Selected Coordinates
          </div>

          <div style={styles.locationText}>

            {coordinates?.lat?.toFixed(5)},
            {" "}
            {coordinates?.lng?.toFixed(5)}

          </div>

        </div>


        {/* SUBMIT */}

        <button

          onClick={handleSubmit}

          disabled={loading}

          style={styles.submitBtn}

        >

          {loading
            ? "Submitting..."
            : "Submit Report"}

        </button>

      </div>

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  overlay: {

    position:"fixed",

    inset:0,

    background:"rgba(0,0,0,0.7)",

    backdropFilter:"blur(10px)",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    zIndex:9999,

    padding:"20px"

  },

  modal: {

    width:"100%",

    maxWidth:"480px",

    maxHeight:"90vh",

    overflowY:"auto",

    background:"#13131a",

    borderRadius:"28px",

    padding:"24px",

    border:"1px solid rgba(255,255,255,0.08)"

  },

  header: {

    display:"flex",

    justifyContent:"space-between",

    marginBottom:"24px"

  },

  title: {

    color:"#ffffff",

    fontSize:"24px",

    fontWeight:"700"

  },

  subtitle: {

    color:"#8b8b9e",

    fontSize:"13px",

    marginTop:"6px"

  },

  closeBtn: {

    background:"transparent",

    border:"none",

    color:"#8b8b9e",

    fontSize:"20px",

    cursor:"pointer"

  },

  section: {

    marginBottom:"24px"

  },

  sectionTitle: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"700",

    marginBottom:"14px"

  },

  typeGrid: {

    display:"grid",

    gridTemplateColumns:"1fr 1fr",

    gap:"12px"

  },

  typeCard: {

    padding:"16px",

    borderRadius:"18px",

    cursor:"pointer",

    textAlign:"center"

  },

  typeIcon: {

    fontSize:"24px",

    marginBottom:"10px"

  },

  typeLabel: {

    fontSize:"13px",

    fontWeight:"700"

  },

  textarea: {

    width:"100%",

    minHeight:"120px",

    border:"none",

    outline:"none",

    resize:"none",

    borderRadius:"18px",

    background:"#1c1c26",

    padding:"16px",

    color:"#ffffff",

    fontSize:"14px",

    lineHeight:"1.6"

  },

  severityRow: {

    display:"flex",

    gap:"12px"

  },

  severityBtn: {

    flex:1,

    padding:"14px",

    border:"none",

    borderRadius:"14px",

    color:"#ffffff",

    fontWeight:"700",

    cursor:"pointer"

  },

  anonymousBox: {

    background:"#1c1c26",

    borderRadius:"18px",

    padding:"18px",

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    marginBottom:"20px"

  },

  anonymousTitle: {

    color:"#ffffff",

    fontWeight:"700",

    fontSize:"14px"

  },

  anonymousSubtitle: {

    color:"#8b8b9e",

    fontSize:"12px",

    marginTop:"4px"

  },

  toggle: {

    width:"52px",

    height:"30px",

    borderRadius:"999px",

    border:"none",

    position:"relative",

    cursor:"pointer",

    transition:"0.2s"

  },

  toggleDot: {

    width:"22px",

    height:"22px",

    borderRadius:"50%",

    background:"#ffffff",

    position:"absolute",

    top:"4px",

    left:"4px",

    transition:"0.2s"

  },

  locationBox: {

    background:"#1c1c26",

    borderRadius:"18px",

    padding:"16px",

    marginBottom:"20px"

  },

  locationTitle: {

    color:"#ffffff",

    fontSize:"13px",

    fontWeight:"700"

  },

  locationText: {

    color:"#8b8b9e",

    fontSize:"12px",

    marginTop:"6px"

  },

  submitBtn: {

    width:"100%",

    padding:"18px",

    border:"none",

    borderRadius:"18px",

    background:"#00e87a",

    color:"#13131a",

    fontWeight:"700",

    fontSize:"15px",

    cursor:"pointer"

  },

  error: {

    color:"#ff3d6e",

    fontSize:"12px",

    marginTop:"8px"

  }

};