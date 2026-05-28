// src/components/contacts/ContactCard.jsx

import { useState } from "react";


// ═══════════════════════════════════════
// CONTACT CARD COMPONENT
// ═══════════════════════════════════════

export default function ContactCard({

  contact,

  onDelete,

  onPriorityChange,

  onCall,

  onMessage

}){

  const [showActions, setShowActions] =
    useState(false);


  // ═══════════════════════════════════════
  // PRIORITY COLORS
  // ═══════════════════════════════════════

  const getPriorityColor = () => {

    switch(contact.priority){

      case 1:
        return "#00e87a";

      case 2:
        return "#ffb830";

      case 3:
        return "#4d9fff";

      default:
        return "#8b8b9e";
    }
  };


  // ═══════════════════════════════════════
  // PRIORITY LABEL
  // ═══════════════════════════════════════

  const getPriorityLabel = () => {

    switch(contact.priority){

      case 1:
        return "Primary";

      case 2:
        return "Secondary";

      case 3:
        return "Backup";

      default:
        return "Contact";
    }
  };


  // ═══════════════════════════════════════
  // CALL CONTACT
  // ═══════════════════════════════════════

  const handleCall = () => {

    if(onCall){

      onCall(contact);

    }else{

      window.location.href =
        `tel:${contact.phone}`;
    }
  };


  // ═══════════════════════════════════════
  // MESSAGE CONTACT
  // ═══════════════════════════════════════

  const handleMessage = () => {

    if(onMessage){

      onMessage(contact);

    }else{

      window.location.href =
        `sms:${contact.phone}`;
    }
  };


  // ═══════════════════════════════════════
  // DELETE CONTACT
  // ═══════════════════════════════════════

  const handleDelete = () => {

    const confirmed = window.confirm(

      `Remove ${contact.name} from emergency contacts?`

    );

    if(!confirmed) return;


    // REMOVE FROM LOCAL STORAGE

    const existingContacts =

      JSON.parse(

        localStorage.getItem(
          "emergencyContacts"
        )

      ) || [];


    const updatedContacts =

      existingContacts.filter(

        item => item.id !== contact.id

      );


    localStorage.setItem(

      "emergencyContacts",

      JSON.stringify(updatedContacts)

    );


    if(onDelete){

      onDelete(contact.id);

    }

  };


  // ═══════════════════════════════════════
  // CHANGE PRIORITY
  // ═══════════════════════════════════════

  const handlePriorityChange = (newPriority) => {

    const contacts =

      JSON.parse(

        localStorage.getItem(
          "emergencyContacts"
        )

      ) || [];


    // ENSURE ONLY ONE PRIMARY

    if(newPriority === 1){

      contacts.forEach(c => {

        if(c.id !== contact.id){

          c.priority = 2;

        }

      });

    }


    const updatedContacts = contacts.map(c => {

      if(c.id === contact.id){

        return {

          ...c,

          priority:newPriority

        };

      }

      return c;
    });


    localStorage.setItem(

      "emergencyContacts",

      JSON.stringify(updatedContacts)

    );


    if(onPriorityChange){

      onPriorityChange(
        contact.id,
        newPriority
      );

    }

  };


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.card}>


      {/* HEADER */}

      <div style={styles.header}>


        {/* AVATAR */}

        <div
          style={{
            ...styles.avatar,

            background:getPriorityColor()
          }}
        >

          {contact.name?.charAt(0)?.toUpperCase()}

        </div>


        {/* INFO */}

        <div style={styles.info}>

          <div style={styles.name}>

            {contact.name}

          </div>

          <div style={styles.relationship}>

            {contact.relationship}

          </div>

        </div>


        {/* PRIORITY BADGE */}

        <div
          style={{
            ...styles.priorityBadge,

            background:getPriorityColor()
          }}
        >

          {getPriorityLabel()}

        </div>

      </div>


      {/* PHONE */}

      <div style={styles.phoneContainer}>

        <span style={styles.phoneLabel}>
          Phone
        </span>

        <span style={styles.phoneNumber}>
          {contact.phone}
        </span>

      </div>


      {/* ACTION BUTTONS */}

      <div style={styles.actions}>


        <button
          style={styles.actionBtn}
          onClick={handleCall}
        >
          📞 Call
        </button>


        <button
          style={styles.actionBtn}
          onClick={handleMessage}
        >
          💬 SMS
        </button>


        <button
          style={styles.moreBtn}
          onClick={() =>
            setShowActions(!showActions)
          }
        >
          ⋮
        </button>

      </div>


      {/* EXPANDED ACTIONS */}

      {showActions && (

        <div style={styles.expandedActions}>


          {/* PRIORITY */}

          <div style={styles.prioritySection}>

            <div style={styles.sectionTitle}>
              Change Priority
            </div>

            <div style={styles.priorityButtons}>


              <button

                style={{

                  ...styles.priorityBtn,

                  background:
                    contact.priority === 1
                    ? "#00e87a"
                    : "#1c1c26"

                }}

                onClick={() =>
                  handlePriorityChange(1)
                }
              >
                Primary
              </button>


              <button

                style={{

                  ...styles.priorityBtn,

                  background:
                    contact.priority === 2
                    ? "#ffb830"
                    : "#1c1c26"

                }}

                onClick={() =>
                  handlePriorityChange(2)
                }
              >
                Secondary
              </button>


              <button

                style={{

                  ...styles.priorityBtn,

                  background:
                    contact.priority === 3
                    ? "#4d9fff"
                    : "#1c1c26"

                }}

                onClick={() =>
                  handlePriorityChange(3)
                }
              >
                Backup
              </button>

            </div>

          </div>


          {/* DELETE */}

          <button
            style={styles.deleteBtn}
            onClick={handleDelete}
          >
            Remove Contact
          </button>

        </div>

      )}

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  card: {

    background:"#13131a",

    border:"1px solid rgba(255,255,255,0.08)",

    borderRadius:"22px",

    padding:"18px",

    display:"flex",

    flexDirection:"column",

    gap:"18px",

    boxShadow:"0 8px 24px rgba(0,0,0,0.2)"

  },

  header: {

    display:"flex",

    alignItems:"center",

    gap:"14px"

  },

  avatar: {

    width:"52px",

    height:"52px",

    borderRadius:"50%",

    display:"flex",

    alignItems:"center",

    justifyContent:"center",

    fontSize:"20px",

    fontWeight:"700",

    color:"#13131a"

  },

  info: {

    flex:1

  },

  name: {

    color:"#ffffff",

    fontSize:"16px",

    fontWeight:"700"

  },

  relationship: {

    color:"#8b8b9e",

    fontSize:"13px",

    marginTop:"4px"

  },

  priorityBadge: {

    padding:"8px 12px",

    borderRadius:"999px",

    color:"#13131a",

    fontWeight:"700",

    fontSize:"11px"

  },

  phoneContainer: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    padding:"14px",

    borderRadius:"14px",

    background:"#1c1c26"

  },

  phoneLabel: {

    color:"#8b8b9e",

    fontSize:"12px"

  },

  phoneNumber: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"600"

  },

  actions: {

    display:"flex",

    gap:"10px"

  },

  actionBtn: {

    flex:1,

    border:"none",

    borderRadius:"14px",

    padding:"14px",

    background:"#1c1c26",

    color:"#ffffff",

    fontSize:"13px",

    fontWeight:"600",

    cursor:"pointer"

  },

  moreBtn: {

    width:"52px",

    border:"none",

    borderRadius:"14px",

    background:"#1c1c26",

    color:"#ffffff",

    fontSize:"20px",

    cursor:"pointer"

  },

  expandedActions: {

    borderTop:"1px solid rgba(255,255,255,0.06)",

    paddingTop:"18px",

    display:"flex",

    flexDirection:"column",

    gap:"18px"

  },

  prioritySection: {

    display:"flex",

    flexDirection:"column",

    gap:"12px"

  },

  sectionTitle: {

    color:"#8b8b9e",

    fontSize:"12px",

    fontWeight:"600"

  },

  priorityButtons: {

    display:"flex",

    gap:"10px"

  },

  priorityBtn: {

    flex:1,

    border:"none",

    borderRadius:"12px",

    padding:"12px",

    color:"#ffffff",

    fontWeight:"600",

    fontSize:"12px",

    cursor:"pointer"

  },

  deleteBtn: {

    width:"100%",

    border:"none",

    borderRadius:"14px",

    padding:"14px",

    background:"#ff3d6e",

    color:"#ffffff",

    fontWeight:"700",

    cursor:"pointer"

  }

};