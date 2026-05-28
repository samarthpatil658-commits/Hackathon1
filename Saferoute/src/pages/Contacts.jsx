// src/pages/ContactsPage.jsx

import { useMemo, useState } from "react";

import AddContactModal
from "../components/contacts/AddContactModal";

import ContactCard
from "../components/contacts/ContactCard";

import PrioritySelector
from "../components/contacts/PrioritySelector";

import BottomSheet
from "../components/ui/BottomSheet";

import Toast
from "../components/ui/Toast";

import { useSOS }
from "../context/SOSContext";


// ═══════════════════════════════════════
// CONTACTS PAGE
// ═══════════════════════════════════════

export default function ContactsPage(){

  const {

    emergencyContacts,

    addEmergencyContact,

    removeEmergencyContact

  } = useSOS();


  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showPrioritySheet, setShowPrioritySheet] =
    useState(false);

  const [selectedContact, setSelectedContact] =
    useState(null);

  const [toast, setToast] =
    useState({

      visible:false,

      message:"",

      type:"info"

    });


  // ═══════════════════════════════════════
  // SORTED CONTACTS
  // ═══════════════════════════════════════

  const sortedContacts = useMemo(() => {

    return [...emergencyContacts].sort(

      (a,b) => a.priority - b.priority

    );

  }, [emergencyContacts]);


  // ═══════════════════════════════════════
  // PRIMARY CONTACT
  // ═══════════════════════════════════════

  const primaryContact = useMemo(() => {

    return sortedContacts.find(

      c => c.priority === 1

    );

  }, [sortedContacts]);


  // ═══════════════════════════════════════
  // ADD CONTACT
  // ═══════════════════════════════════════

  const handleAddContact = (

    contact

  ) => {

    addEmergencyContact(contact);

    setShowAddModal(false);

    setToast({

      visible:true,

      message:
        "Emergency contact added",

      type:"success"

    });

  };


  // ═══════════════════════════════════════
  // DELETE CONTACT
  // ═══════════════════════════════════════

  const handleDeleteContact = (

    id

  ) => {

    removeEmergencyContact(id);

    setToast({

      visible:true,

      message:
        "Contact removed",

      type:"warning"

    });

  };


  // ═══════════════════════════════════════
  // CHANGE PRIORITY
  // ═══════════════════════════════════════

  const updatePriority = (

    contactId,

    newPriority

  ) => {

    try{

      const updatedContacts =

        sortedContacts.map(contact => {

          if(contact.id === contactId){

            return {

              ...contact,

              priority:newPriority

            };

          }

          return contact;

        });


      localStorage.setItem(

        "emergencyContacts",

        JSON.stringify(updatedContacts)

      );


      window.location.reload();

    }catch(err){

      console.error(err);

    }

  };


  // ═══════════════════════════════════════
  // OPEN PRIORITY
  // ═══════════════════════════════════════

  const openPrioritySheet = (

    contact

  ) => {

    setSelectedContact(contact);

    setShowPrioritySheet(true);

  };


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.page}>


      {/* HEADER */}

      <div style={styles.header}>


        <div>

          <div style={styles.title}>
            Emergency Contacts
          </div>

          <div style={styles.subtitle}>
            Manage your SOS priority list
          </div>

        </div>


        <button

          style={styles.addBtn}

          onClick={() =>
            setShowAddModal(true)
          }

        >

          ＋

        </button>

      </div>


      {/* PRIMARY CONTACT */}

      {

        primaryContact && (

          <div style={styles.primaryCard}>


            <div style={styles.primaryBadge}>
              PRIMARY CONTACT
            </div>


            <div style={styles.primaryContent}>


              <div style={styles.avatar}>

                {

                  primaryContact.name
                  ?.charAt(0)
                  ?.toUpperCase()

                }

              </div>


              <div style={styles.primaryInfo}>


                <div style={styles.primaryName}>
                  {primaryContact.name}
                </div>


                <div style={styles.primaryPhone}>
                  {primaryContact.phone}
                </div>

              </div>

            </div>

          </div>

        )

      }


      {/* EMPTY */}

      {

        sortedContacts.length === 0 && (

          <div style={styles.emptyState}>


            <div style={styles.emptyIcon}>
              📱
            </div>


            <div style={styles.emptyTitle}>
              No emergency contacts
            </div>


            <div style={styles.emptyText}>
              Add trusted people for SOS alerts
            </div>


            <button

              style={styles.emptyBtn}

              onClick={() =>
                setShowAddModal(true)
              }

            >

              Add Contact

            </button>

          </div>

        )

      }


      {/* CONTACT LIST */}

      {

        sortedContacts.length > 0 && (

          <div style={styles.contactList}>


            {

              sortedContacts.map(contact => (

                <ContactCard

                  key={contact.id}

                  contact={contact}

                  onDelete={() =>

                    handleDeleteContact(
                      contact.id
                    )

                  }

                  onPriority={() =>

                    openPrioritySheet(
                      contact
                    )

                  }

                />

              ))

            }

          </div>

        )

      }


      {/* INFO CARD */}

      <div style={styles.infoCard}>


        <div style={styles.infoTitle}>
          🚨 SOS Priority System
        </div>


        <div style={styles.infoText}>

          Your Priority 1 contact receives
          emergency alerts first before
          all other contacts.

        </div>

      </div>


      {/* ADD CONTACT MODAL */}

      <AddContactModal

        isOpen={showAddModal}

        onClose={() =>
          setShowAddModal(false)
        }

        onSave={handleAddContact}

        contacts={sortedContacts}

      />


      {/* PRIORITY SHEET */}

      <BottomSheet

        isOpen={showPrioritySheet}

        onClose={() =>
          setShowPrioritySheet(false)
        }

        title="Change Priority"

      >

        {

          selectedContact && (

            <PrioritySelector

              currentPriority={
                selectedContact.priority
              }

              onSelect={(priority) => {

                updatePriority(

                  selectedContact.id,

                  priority

                );

                setShowPrioritySheet(false);

              }}

            />

          )

        }

      </BottomSheet>


      {/* TOAST */}

      <Toast

        visible={toast.visible}

        message={toast.message}

        type={toast.type}

        onClose={() =>

          setToast(prev => ({

            ...prev,

            visible:false

          }))

        }

      />

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

    padding:"24px 18px 120px",

    background:"var(--bg-primary)",

    display:"flex",

    flexDirection:"column",

    gap:"22px"

  },

  header: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    marginTop:"10px"

  },

  title: {

    color:"#ffffff",

    fontSize:"28px",

    fontWeight:"800"

  },

  subtitle: {

    color:"#8b8b9e",

    fontSize:"13px",

    marginTop:"6px"

  },

  addBtn: {

    width:"56px",

    height:"56px",

    borderRadius:"18px",

    border:"none",

    background:"#00e87a",

    color:"#13131a",

    fontSize:"30px",

    fontWeight:"700",

    cursor:"pointer",

    boxShadow:
      "0 10px 24px rgba(0,232,122,0.25)"

  },

  primaryCard: {

    background:
      "linear-gradient(135deg,#00e87a,#00c76a)",

    borderRadius:"28px",

    padding:"22px",

    color:"#13131a"

  },

  primaryBadge: {

    fontSize:"11px",

    fontWeight:"800",

    letterSpacing:"1px",

    opacity:0.75

  },

  primaryContent: {

    display:"flex",

    alignItems:"center",

    gap:"16px",

    marginTop:"18px"

  },

  avatar: {

    width:"64px",

    height:"64px",

    borderRadius:"50%",

    background:"rgba(255,255,255,0.22)",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    fontSize:"24px",

    fontWeight:"800"

  },

  primaryInfo: {

    display:"flex",

    flexDirection:"column",

    gap:"6px"

  },

  primaryName: {

    fontSize:"22px",

    fontWeight:"800"

  },

  primaryPhone: {

    fontSize:"14px",

    opacity:0.8

  },

  contactList: {

    display:"flex",

    flexDirection:"column",

    gap:"16px"

  },

  emptyState: {

    background:"#13131a",

    borderRadius:"28px",

    padding:"40px 22px",

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    gap:"14px",

    border:
      "1px solid rgba(255,255,255,0.08)"

  },

  emptyIcon: {

    fontSize:"50px"

  },

  emptyTitle: {

    color:"#ffffff",

    fontSize:"20px",

    fontWeight:"800"

  },

  emptyText: {

    color:"#8b8b9e",

    fontSize:"13px",

    textAlign:"center",

    lineHeight:"1.6"

  },

  emptyBtn: {

    marginTop:"10px",

    height:"52px",

    padding:"0 26px",

    borderRadius:"16px",

    border:"none",

    background:"#00e87a",

    color:"#13131a",

    fontWeight:"800",

    cursor:"pointer"

  },

  infoCard: {

    background:"#13131a",

    borderRadius:"24px",

    padding:"20px",

    border:
      "1px solid rgba(255,255,255,0.08)"

  },

  infoTitle: {

    color:"#ffffff",

    fontSize:"15px",

    fontWeight:"700"

  },

  infoText: {

    color:"#8b8b9e",

    fontSize:"13px",

    lineHeight:"1.7",

    marginTop:"10px"

  }

};