// src/pages/SOSPage.jsx

import { useEffect, useState } from "react";

import SOSButton
from "../components/sos/SOSButton";

import EmergencyModal
from "../components/sos/EmergencyModal";

import LiveTracking
from "../components/sos/LiveTracking";

import Toast
from "../components/ui/Toast";

import Loader
from "../components/ui/Loader";

import { useSOS }
from "../hooks/useSOS";


// ═══════════════════════════════════════
// SOS PAGE
// ═══════════════════════════════════════

export default function SOSPage(){

  const {

    sosActive,

    liveTracking,

    currentLocation,

    trackingHistory,

    emergencyContacts,

    alerts,

    loading,

    error,

    countdown,

    countdownActive,

    triggerSOS,

    quickSOS,

    startSOSCountdown,

    cancelCountdown,

    cancelSOS,

    safeCheckIn,

    startLiveTracking,

    stopLiveTracking,

    shareLiveLocation

  } = useSOS();


  const [showEmergencyModal, setShowEmergencyModal] =
    useState(false);

  const [toast, setToast] =
    useState({

      visible:false,

      message:"",

      type:"info"

    });


  // ═══════════════════════════════════════
  // HANDLE SOS
  // ═══════════════════════════════════════

  const handleSOS = () => {

    setShowEmergencyModal(true);

    startSOSCountdown(5);

  };


  // ═══════════════════════════════════════
  // TRACKING AUTO START
  // ═══════════════════════════════════════

  useEffect(() => {

    if(sosActive){

      startLiveTracking();

    }

  }, [sosActive]);


  // ═══════════════════════════════════════
  // SAFE CHECK-IN
  // ═══════════════════════════════════════

  const handleSafeCheckIn =
    async() => {

      const result =
        await safeCheckIn();

      if(result.success){

        setToast({

          visible:true,

          type:"success",

          message:
            "Safe check-in shared"

        });

      }

    };


  // ═══════════════════════════════════════
  // SHARE LIVE LOCATION
  // ═══════════════════════════════════════

  const handleShareLocation =
    async() => {

      await shareLiveLocation();

      setToast({

        visible:true,

        type:"info",

        message:
          "Live location shared"

      });

    };


  // ═══════════════════════════════════════
  // CANCEL SOS
  // ═══════════════════════════════════════

  const handleCancelSOS = () => {

    cancelCountdown();

    cancelSOS();

    setShowEmergencyModal(false);

    setToast({

      visible:true,

      type:"warning",

      message:
        "Emergency SOS cancelled"

    });

  };


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.page}>


      {/* HEADER */}

      <div style={styles.header}>


        <div style={styles.title}>
          Emergency SOS
        </div>


        <div style={styles.subtitle}>
          Instantly alert trusted contacts
        </div>

      </div>


      {/* STATUS CARD */}

      <div style={styles.statusCard}>


        <div style={styles.statusTop}>


          <div style={styles.statusTitle}>
            Emergency Status
          </div>


          <div

            style={{

              ...styles.statusBadge,

              background:

                sosActive

                ? "#ff3d6e"

                : "#00e87a"

            }}

          >

            {

              sosActive

              ? "ACTIVE"

              : "SAFE"

            }

          </div>

        </div>


        <div style={styles.statusText}>

          {

            sosActive

            ?

            "Emergency SOS is currently active and tracking your live location."

            :

            "You are currently safe. Press the SOS button during emergencies."

          }

        </div>

      </div>


      {/* COUNTDOWN */}

      {

        countdownActive && (

          <div style={styles.countdownCard}>


            <div style={styles.countdownLabel}>
              Sending emergency SOS in
            </div>


            <div style={styles.countdownValue}>
              {countdown}
            </div>


            <button

              style={styles.cancelBtn}

              onClick={handleCancelSOS}

            >

              Cancel SOS

            </button>

          </div>

        )

      }


      {/* SOS BUTTON */}

      <div style={styles.sosWrapper}>


        <SOSButton

          floating={false}

          size={150}

          onTrigger={handleSOS}

          emergencyMode={sosActive}

        />

      </div>


      {/* QUICK ACTIONS */}

      <div style={styles.actionsGrid}>


        <button

          style={styles.actionBtn}

          onClick={handleSafeCheckIn}

        >

          ✅ Safe Check-In

        </button>


        <button

          style={styles.actionBtn}

          onClick={handleShareLocation}

        >

          📡 Share Location

        </button>

      </div>


      {/* LIVE TRACKING */}

      {

        liveTracking && (

          <LiveTracking

            isTracking={liveTracking}

            emergencyContacts={
              emergencyContacts
            }

          />

        )

      }


      {/* LOCATION CARD */}

      {

        currentLocation && (

          <div style={styles.locationCard}>


            <div style={styles.cardTitle}>
              Current Location
            </div>


            <div style={styles.locationText}>

              {currentLocation.lat.toFixed(5)},
              {" "}
              {currentLocation.lng.toFixed(5)}

            </div>


            <div style={styles.metaRow}>


              <div style={styles.metaItem}>

                🎯 Accuracy:
                {" "}

                {

                  Math.round(

                    currentLocation.accuracy

                  )

                }

                m

              </div>


              <div style={styles.metaItem}>

                📍 GPS Active

              </div>

            </div>

          </div>

        )

      }


      {/* CONTACTS */}

      <div style={styles.contactCard}>


        <div style={styles.cardTitle}>
          Emergency Contacts
        </div>


        {

          emergencyContacts.length === 0

          ?

          <div style={styles.emptyText}>
            No emergency contacts added
          </div>

          :

          emergencyContacts.map(contact => (

            <div

              key={contact.id}

              style={styles.contactItem}

            >


              <div>

                <div style={styles.contactName}>
                  {contact.name}
                </div>

                <div style={styles.contactPhone}>
                  {contact.phone}
                </div>

              </div>


              <div style={styles.priorityBadge}>

                P{contact.priority}

              </div>

            </div>

          ))

        }

      </div>


      {/* ALERT HISTORY */}

      <div style={styles.alertCard}>


        <div style={styles.cardTitle}>
          SOS Alerts History
        </div>


        {

          alerts.length === 0

          ?

          <div style={styles.emptyText}>
            No emergency alerts yet
          </div>

          :

          alerts.slice(0,5).map(alert => (

            <div

              key={alert.id}

              style={styles.alertItem}

            >


              <div>

                <div style={styles.alertType}>
                  {alert.type}
                </div>

                <div style={styles.alertTime}>

                  {

                    new Date(

                      alert.timestamp

                    ).toLocaleString()

                  }

                </div>

              </div>


              <div style={styles.alertStatus}>
                {alert.status}
              </div>

            </div>

          ))

        }

      </div>


      {/* MODAL */}

      <EmergencyModal

        isOpen={showEmergencyModal}

        onClose={() =>
          setShowEmergencyModal(false)
        }

        onConfirm={triggerSOS}

        onCancel={handleCancelSOS}

      />


      {/* LOADER */}

      {

        loading && (

          <div style={styles.loaderOverlay}>

            <Loader

              text="Sending SOS alert..."

              size={70}

            />

          </div>

        )

      }


      {/* TOAST */}

      <Toast

        visible={toast.visible}

        type={toast.type}

        message={toast.message}

        onClose={() =>

          setToast(prev => ({

            ...prev,

            visible:false

          }))

        }

      />


      {/* ERROR */}

      {

        error && (

          <Toast

            visible={true}

            type="error"

            message={error}

          />

        )

      }

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  page: {

    width:"100%",

    minHeight:"100vh",

    padding:"24px 18px 140px",

    background:"#0b0b10",

    display:"flex",

    flexDirection:"column",

    gap:"22px"

  },

  header: {

    marginTop:"10px"

  },

  title: {

    fontSize:"30px",

    fontWeight:"800",

    color:"#ffffff"

  },

  subtitle: {

    color:"#8b8b9e",

    fontSize:"13px",

    marginTop:"6px"

  },

  statusCard: {

    background:"#13131a",

    borderRadius:"26px",

    padding:"22px",

    border:
      "1px solid rgba(255,255,255,0.08)"

  },

  statusTop: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center"

  },

  statusTitle: {

    color:"#ffffff",

    fontSize:"16px",

    fontWeight:"700"

  },

  statusBadge: {

    padding:"10px 14px",

    borderRadius:"999px",

    color:"#ffffff",

    fontSize:"11px",

    fontWeight:"800"

  },

  statusText: {

    marginTop:"14px",

    color:"#bdbdd3",

    fontSize:"14px",

    lineHeight:"1.7"

  },

  countdownCard: {

    background:"#ff3d6e",

    borderRadius:"28px",

    padding:"28px",

    textAlign:"center",

    color:"#ffffff"

  },

  countdownLabel: {

    fontSize:"14px",

    opacity:0.9

  },

  countdownValue: {

    fontSize:"72px",

    fontWeight:"900",

    marginTop:"10px"

  },

  cancelBtn: {

    marginTop:"18px",

    width:"100%",

    height:"54px",

    borderRadius:"18px",

    border:"none",

    background:"#ffffff",

    color:"#ff3d6e",

    fontWeight:"800",

    cursor:"pointer"

  },

  sosWrapper: {

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    padding:"10px 0 20px"

  },

  actionsGrid: {

    display:"grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap:"14px"

  },

  actionBtn: {

    height:"58px",

    borderRadius:"18px",

    border:"1px solid rgba(255,255,255,0.08)",

    background:"#13131a",

    color:"#ffffff",

    fontWeight:"700",

    cursor:"pointer"

  },

  locationCard: {

    background:"#13131a",

    borderRadius:"24px",

    padding:"20px",

    border:
      "1px solid rgba(255,255,255,0.08)"

  },

  cardTitle: {

    color:"#ffffff",

    fontSize:"15px",

    fontWeight:"700"

  },

  locationText: {

    color:"#00e87a",

    fontSize:"16px",

    fontWeight:"700",

    marginTop:"14px"

  },

  metaRow: {

    display:"flex",

    gap:"12px",

    marginTop:"16px",

    flexWrap:"wrap"

  },

  metaItem: {

    background:"#1f1f2b",

    padding:"10px 14px",

    borderRadius:"14px",

    color:"#d7d7e9",

    fontSize:"12px"

  },

  contactCard: {

    background:"#13131a",

    borderRadius:"24px",

    padding:"20px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    display:"flex",

    flexDirection:"column",

    gap:"16px"

  },

  contactItem: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    background:"#1c1c26",

    borderRadius:"18px",

    padding:"16px"

  },

  contactName: {

    color:"#ffffff",

    fontSize:"15px",

    fontWeight:"700"

  },

  contactPhone: {

    color:"#8b8b9e",

    fontSize:"12px",

    marginTop:"5px"

  },

  priorityBadge: {

    minWidth:"46px",

    height:"46px",

    borderRadius:"14px",

    background:"#00e87a",

    color:"#13131a",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    fontWeight:"800"

  },

  alertCard: {

    background:"#13131a",

    borderRadius:"24px",

    padding:"20px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    display:"flex",

    flexDirection:"column",

    gap:"16px"

  },

  alertItem: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    background:"#1c1c26",

    borderRadius:"18px",

    padding:"16px"

  },

  alertType: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"700"

  },

  alertTime: {

    color:"#8b8b9e",

    fontSize:"11px",

    marginTop:"6px"

  },

  alertStatus: {

    color:"#00e87a",

    fontSize:"12px",

    fontWeight:"700",

    textTransform:"uppercase"

  },

  emptyText: {

    color:"#8b8b9e",

    fontSize:"13px",

    marginTop:"12px"

  },

  loaderOverlay: {

    position:"fixed",

    inset:0,

    background:"rgba(0,0,0,0.45)",

    zIndex:99999,

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    backdropFilter:"blur(8px)"

  }

};