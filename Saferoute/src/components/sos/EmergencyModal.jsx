// src/components/sos/EmergencyModal.jsx

import { useEffect, useMemo, useState } from "react";


// ═══════════════════════════════════════
// EMERGENCY MODAL
// ═══════════════════════════════════════

export default function EmergencyModal({

  isOpen,

  onClose,

  currentLocation = null,

  contacts = [],

  onSOSSent

}){

  const [sending, setSending] =
    useState(false);

  const [countdown, setCountdown] =
    useState(5);

  const [autoSend, setAutoSend] =
    useState(true);

  const [selectedContacts, setSelectedContacts] =
    useState([]);

  const [message, setMessage] =
    useState(
      "I may be in danger. Please check my live location immediately."
    );


  // ═══════════════════════════════════════
  // SORT CONTACTS BY PRIORITY
  // ═══════════════════════════════════════

  const sortedContacts = useMemo(() => {

    return [...contacts].sort(

      (a,b) => a.priority - b.priority

    );

  }, [contacts]);


  // ═══════════════════════════════════════
  // AUTO SELECT CONTACTS
  // ═══════════════════════════════════════

  useEffect(() => {

    if(sortedContacts.length){

      setSelectedContacts(

        sortedContacts.map(c => c.id)

      );

    }

  }, [contacts]);


  // ═══════════════════════════════════════
  // AUTO COUNTDOWN
  // ═══════════════════════════════════════

  useEffect(() => {

    if(

      !isOpen ||

      !autoSend ||

      countdown <= 0

    ){

      return;
    }

    const timer = setTimeout(() => {

      setCountdown(prev => prev - 1);

    }, 1000);

    return () => clearTimeout(timer);

  }, [countdown, isOpen, autoSend]);


  // ═══════════════════════════════════════
  // AUTO SEND SOS
  // ═══════════════════════════════════════

  useEffect(() => {

    if(

      isOpen &&

      autoSend &&

      countdown === 0

    ){

      handleSendSOS();

    }

  }, [countdown]);


  // ═══════════════════════════════════════
  // GENERATE LIVE LOCATION LINK
  // ═══════════════════════════════════════

  const liveLocationLink = useMemo(() => {

    if(!currentLocation){

      return "";
    }

    return `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;

  }, [currentLocation]);


  // ═══════════════════════════════════════
  // TOGGLE CONTACT
  // ═══════════════════════════════════════

  const toggleContact = (id) => {

    setSelectedContacts(prev => {

      if(prev.includes(id)){

        return prev.filter(c => c !== id);

      }

      return [...prev, id];

    });

  };


  // ═══════════════════════════════════════
  // SEND SOS
  // ═══════════════════════════════════════

  const handleSendSOS = async() => {

    try{

      setSending(true);

      const selected = contacts.filter(

        c => selectedContacts.includes(c.id)

      );


      const sosPayload = {

        id: Date.now(),

        message,

        location: currentLocation,

        contacts:selected,

        liveLocationLink,

        createdAt:new Date(),

        status:"sent"

      };


      // SAVE TO LOCAL STORAGE

      const existingAlerts =

        JSON.parse(

          localStorage.getItem(
            "sosAlerts"
          )

        ) || [];


      existingAlerts.push(sosPayload);


      localStorage.setItem(

        "sosAlerts",

        JSON.stringify(existingAlerts)

      );


      // SIMULATE ALERT SEND

      console.log(

        "SOS SENT TO:",

        selected

      );


      // CALLBACK

      if(onSOSSent){

        onSOSSent(sosPayload);

      }


      // SUCCESS

      alert(

        "Emergency alerts sent successfully."

      );


      onClose();

    }catch(err){

      console.error(err);

      alert(
        "Failed to send SOS alerts."
      );

    }finally{

      setSending(false);

    }

  };


  // ═══════════════════════════════════════
  // RESET ON OPEN
  // ═══════════════════════════════════════

  useEffect(() => {

    if(isOpen){

      setCountdown(5);

      setAutoSend(true);

    }

  }, [isOpen]);


  // ═══════════════════════════════════════
  // RETURN NULL
  // ═══════════════════════════════════════

  if(!isOpen){

    return null;

  }


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
              Emergency SOS
            </div>

            <div style={styles.subtitle}>
              Emergency alerts will be sent
            </div>

          </div>


          <button
            style={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>

        </div>


        {/* COUNTDOWN */}

        <div style={styles.countdownContainer}>


          <div
            style={styles.countdownCircle}
          >

            {countdown}

          </div>


          <div style={styles.countdownText}>

            Auto sending emergency alert

          </div>

        </div>


        {/* AUTO SEND TOGGLE */}

        <div style={styles.autoSendBox}>


          <div>

            <div style={styles.autoTitle}>
              Auto Send SOS
            </div>

            <div style={styles.autoSubtitle}>
              Automatically send alerts
            </div>

          </div>


          <button

            onClick={() =>
              setAutoSend(!autoSend)
            }

            style={{

              ...styles.toggle,

              background:
                autoSend
                ? "#00e87a"
                : "#2a2a35"

            }}
          >

            <div
              style={{

                ...styles.toggleDot,

                transform:autoSend

                  ? "translateX(22px)"

                  : "translateX(0px)"
              }}
            />

          </button>

        </div>


        {/* LOCATION */}

        <div style={styles.locationBox}>


          <div style={styles.locationTitle}>
            📍 Live Location
          </div>


          <div style={styles.locationText}>

            {

              currentLocation

              ?

              `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`

              :

              "Fetching location..."

            }

          </div>

        </div>


        {/* MESSAGE */}

        <div style={styles.section}>


          <div style={styles.sectionTitle}>
            Emergency Message
          </div>


          <textarea

            value={message}

            onChange={(e) =>
              setMessage(e.target.value)
            }

            style={styles.textarea}

          />

        </div>


        {/* CONTACTS */}

        <div style={styles.section}>


          <div style={styles.sectionTitle}>
            Emergency Contacts
          </div>


          <div style={styles.contactsList}>


            {sortedContacts.map(contact => {

              const selected =
                selectedContacts.includes(
                  contact.id
                );

              return (

                <button

                  key={contact.id}

                  onClick={() =>
                    toggleContact(contact.id)
                  }

                  style={{

                    ...styles.contactCard,

                    border:selected

                      ? "2px solid #00e87a"

                      : "1px solid rgba(255,255,255,0.08)"

                  }}
                >


                  <div style={styles.contactLeft}>


                    <div style={styles.avatar}>

                      {

                        contact.name
                        ?.charAt(0)
                        ?.toUpperCase()

                      }

                    </div>


                    <div>

                      <div style={styles.contactName}>
                        {contact.name}
                      </div>

                      <div style={styles.contactPhone}>
                        {contact.phone}
                      </div>

                    </div>

                  </div>


                  <div
                    style={{

                      ...styles.priorityBadge,

                      background:

                        contact.priority === 1

                        ? "#00e87a"

                        : contact.priority === 2

                          ? "#ffb830"

                          : "#4d9fff"

                    }}
                  >

                    P{contact.priority}

                  </div>

                </button>

              );

            })}

          </div>

        </div>


        {/* SEND BUTTON */}

        <button

          onClick={handleSendSOS}

          disabled={sending}

          style={styles.sendBtn}

        >

          {

            sending

            ? "Sending SOS..."

            : "Send Emergency Alert"

          }

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

    background:"rgba(0,0,0,0.72)",

    backdropFilter:"blur(12px)",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    zIndex:99999,

    padding:"20px"

  },

  modal: {

    width:"100%",

    maxWidth:"520px",

    maxHeight:"92vh",

    overflowY:"auto",

    background:"#13131a",

    borderRadius:"30px",

    border:"1px solid rgba(255,255,255,0.08)",

    padding:"24px",

    display:"flex",

    flexDirection:"column",

    gap:"22px"

  },

  header: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"flex-start"

  },

  title: {

    color:"#ffffff",

    fontSize:"26px",

    fontWeight:"800"

  },

  subtitle: {

    color:"#8b8b9e",

    fontSize:"13px",

    marginTop:"6px"

  },

  closeBtn: {

    border:"none",

    background:"transparent",

    color:"#8b8b9e",

    fontSize:"20px",

    cursor:"pointer"

  },

  countdownContainer: {

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    gap:"12px"

  },

  countdownCircle: {

    width:"90px",

    height:"90px",

    borderRadius:"50%",

    background:"#ff3d6e",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    color:"#ffffff",

    fontSize:"34px",

    fontWeight:"800",

    boxShadow:
      "0 0 24px rgba(255,61,110,0.4)"

  },

  countdownText: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"600"

  },

  autoSendBox: {

    background:"#1c1c26",

    borderRadius:"20px",

    padding:"18px",

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center"

  },

  autoTitle: {

    color:"#ffffff",

    fontWeight:"700",

    fontSize:"14px"

  },

  autoSubtitle: {

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

    cursor:"pointer"

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

    padding:"18px"

  },

  locationTitle: {

    color:"#ffffff",

    fontSize:"13px",

    fontWeight:"700"

  },

  locationText: {

    color:"#8b8b9e",

    fontSize:"12px",

    marginTop:"8px",

    lineHeight:"1.5"

  },

  section: {

    display:"flex",

    flexDirection:"column",

    gap:"14px"

  },

  sectionTitle: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"700"

  },

  textarea: {

    width:"100%",

    minHeight:"110px",

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

  contactsList: {

    display:"flex",

    flexDirection:"column",

    gap:"12px"

  },

  contactCard: {

    width:"100%",

    borderRadius:"18px",

    background:"#1c1c26",

    padding:"16px",

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    cursor:"pointer"

  },

  contactLeft: {

    display:"flex",

    alignItems:"center",

    gap:"14px"

  },

  avatar: {

    width:"48px",

    height:"48px",

    borderRadius:"50%",

    background:"#00e87a",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    color:"#13131a",

    fontWeight:"800",

    fontSize:"18px"

  },

  contactName: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"700"

  },

  contactPhone: {

    color:"#8b8b9e",

    fontSize:"12px",

    marginTop:"4px"

  },

  priorityBadge: {

    minWidth:"38px",

    height:"38px",

    borderRadius:"12px",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    color:"#13131a",

    fontWeight:"800",

    fontSize:"13px"

  },

  sendBtn: {

    width:"100%",

    height:"62px",

    border:"none",

    borderRadius:"20px",

    background:"#ff3d6e",

    color:"#ffffff",

    fontSize:"16px",

    fontWeight:"800",

    cursor:"pointer",

    boxShadow:
      "0 10px 28px rgba(255,61,110,0.32)"

  }

};