// src/components/contacts/PrioritySelector.jsx

import { useState } from "react";


// ═══════════════════════════════════════
// PRIORITY SELECTOR COMPONENT
// ═══════════════════════════════════════

export default function PrioritySelector({

  value = 1,

  onChange,

  contacts = []

}){

  const [selectedPriority, setSelectedPriority] =
    useState(value);


  // ═══════════════════════════════════════
  // PRIORITY OPTIONS
  // ═══════════════════════════════════════

  const priorityOptions = [

    {

      id:1,

      label:"Primary",

      description:
        "Receives SOS alerts first",

      color:"#00e87a",

      icon:"🛡️"

    },

    {

      id:2,

      label:"Secondary",

      description:
        "Backup emergency contact",

      color:"#ffb830",

      icon:"📞"

    },

    {

      id:3,

      label:"Backup",

      description:
        "Last priority emergency contact",

      color:"#4d9fff",

      icon:"👥"

    }

  ];


  // ═══════════════════════════════════════
  // CHECK IF PRIMARY EXISTS
  // ═══════════════════════════════════════

  const primaryExists = contacts.some(

    contact => contact.priority === 1

  );


  // ═══════════════════════════════════════
  // HANDLE SELECT
  // ═══════════════════════════════════════

  const handleSelect = (priority) => {

    setSelectedPriority(priority);

    if(onChange){

      onChange(priority);

    }

  };


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.container}>


      {/* TITLE */}

      <div style={styles.header}>

        <div style={styles.title}>
          Contact Priority
        </div>

        <div style={styles.subtitle}>
          Priority determines SOS alert order
        </div>

      </div>


      {/* PRIORITY OPTIONS */}

      <div style={styles.optionsContainer}>


        {priorityOptions.map(option => {

          const isSelected =
            selectedPriority === option.id;

          const disablePrimary =

            option.id === 1 &&
            primaryExists &&
            selectedPriority !== 1;


          return (

            <button

              key={option.id}

              disabled={disablePrimary}

              onClick={() =>
                handleSelect(option.id)
              }

              style={{

                ...styles.optionCard,

                border:isSelected

                  ? `2px solid ${option.color}`

                  : "1px solid rgba(255,255,255,0.08)",

                background:isSelected

                  ? `${option.color}15`

                  : "#1c1c26",

                opacity:disablePrimary
                  ? 0.45
                  : 1

              }}
            >


              {/* TOP SECTION */}

              <div style={styles.topRow}>


                <div
                  style={{

                    ...styles.iconWrapper,

                    background:option.color

                  }}
                >

                  {option.icon}

                </div>


                {isSelected && (

                  <div
                    style={{

                      ...styles.selectedDot,

                      background:option.color

                    }}
                  />

                )}

              </div>


              {/* LABEL */}

              <div
                style={{

                  ...styles.optionLabel,

                  color:isSelected
                    ? option.color
                    : "#ffffff"

                }}
              >

                {option.label}

              </div>


              {/* DESCRIPTION */}

              <div style={styles.description}>

                {option.description}

              </div>


              {/* WARNING */}

              {disablePrimary && (

                <div style={styles.warning}>

                  Primary already assigned

                </div>

              )}

            </button>

          );

        })}

      </div>


      {/* PRIORITY FLOW */}

      <div style={styles.priorityFlow}>


        <div style={styles.flowTitle}>
          SOS Alert Order
        </div>


        <div style={styles.flowContainer}>


          <div style={styles.flowStep}>

            <div
              style={{
                ...styles.flowBadge,
                background:"#00e87a"
              }}
            >
              1
            </div>

            <span style={styles.flowText}>
              Primary
            </span>

          </div>


          <div style={styles.arrow}>
            →
          </div>


          <div style={styles.flowStep}>

            <div
              style={{
                ...styles.flowBadge,
                background:"#ffb830"
              }}
            >
              2
            </div>

            <span style={styles.flowText}>
              Secondary
            </span>

          </div>


          <div style={styles.arrow}>
            →
          </div>


          <div style={styles.flowStep}>

            <div
              style={{
                ...styles.flowBadge,
                background:"#4d9fff"
              }}
            >
              3
            </div>

            <span style={styles.flowText}>
              Backup
            </span>

          </div>

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

    display:"flex",

    flexDirection:"column",

    gap:"22px"

  },

  header: {

    display:"flex",

    flexDirection:"column",

    gap:"6px"

  },

  title: {

    color:"#ffffff",

    fontSize:"16px",

    fontWeight:"700"

  },

  subtitle: {

    color:"#8b8b9e",

    fontSize:"13px"

  },

  optionsContainer: {

    display:"grid",

    gridTemplateColumns:"1fr",

    gap:"14px"

  },

  optionCard: {

    width:"100%",

    padding:"18px",

    borderRadius:"20px",

    cursor:"pointer",

    display:"flex",

    flexDirection:"column",

    gap:"14px",

    transition:"0.2s",

    textAlign:"left"

  },

  topRow: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center"

  },

  iconWrapper: {

    width:"44px",

    height:"44px",

    borderRadius:"14px",

    display:"flex",

    alignItems:"center",

    justifyContent:"center",

    fontSize:"20px"

  },

  selectedDot: {

    width:"14px",

    height:"14px",

    borderRadius:"50%",

    boxShadow:"0 0 10px currentColor"

  },

  optionLabel: {

    fontSize:"16px",

    fontWeight:"700"

  },

  description: {

    color:"#8b8b9e",

    fontSize:"13px",

    lineHeight:"1.5"

  },

  warning: {

    color:"#ff3d6e",

    fontSize:"12px",

    fontWeight:"600"

  },

  priorityFlow: {

    padding:"18px",

    borderRadius:"20px",

    background:"#1c1c26",

    display:"flex",

    flexDirection:"column",

    gap:"16px"

  },

  flowTitle: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"700"

  },

  flowContainer: {

    display:"flex",

    alignItems:"center",

    justifyContent:"space-between",

    gap:"10px",

    flexWrap:"wrap"

  },

  flowStep: {

    display:"flex",

    alignItems:"center",

    gap:"8px"

  },

  flowBadge: {

    width:"30px",

    height:"30px",

    borderRadius:"50%",

    display:"flex",

    alignItems:"center",

    justifyContent:"center",

    color:"#13131a",

    fontWeight:"700",

    fontSize:"13px"

  },

  flowText: {

    color:"#ffffff",

    fontSize:"13px",

    fontWeight:"600"

  },

  arrow: {

    color:"#8b8b9e",

    fontSize:"18px",

    fontWeight:"700"

  }

};