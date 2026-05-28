// src/components/contacts/AddContactModal.jsx

import { useState } from "react";


// ═══════════════════════════════════════
// ADD CONTACT MODAL
// ═══════════════════════════════════════

export default function AddContactModal({

  isOpen,

  onClose,

  onSave

}){

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [relationship, setRelationship] = useState("");

  const [priority, setPriority] = useState(1);

  const [errors, setErrors] = useState({});


  // ═══════════════════════════════════════
  // VALIDATION
  // ═══════════════════════════════════════

  const validateForm = () => {

    const newErrors = {};


    // NAME

    if(!name.trim()){

      newErrors.name =
        "Name is required";

    }


    // PHONE

    if(!phone.trim()){

      newErrors.phone =
        "Phone number is required";

    }else if(!/^[0-9]{10}$/.test(phone)){

      newErrors.phone =
        "Enter valid 10 digit number";

    }


    // RELATIONSHIP

    if(!relationship.trim()){

      newErrors.relationship =
        "Relationship is required";

    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // ═══════════════════════════════════════
  // SAVE CONTACT
  // ═══════════════════════════════════════

  const handleSave = () => {

    if(!validateForm()) return;


    const newContact = {

      id: Date.now(),

      name,

      phone,

      relationship,

      priority,

      createdAt: new Date()

    };


    // LOCAL STORAGE SAVE

    const existingContacts =

      JSON.parse(

        localStorage.getItem(
          "emergencyContacts"
        )

      ) || [];


    // ENSURE ONLY ONE PRIMARY

    if(priority === 1){

      existingContacts.forEach(contact => {

        contact.priority = 2;

      });

    }


    existingContacts.push(newContact);


    localStorage.setItem(

      "emergencyContacts",

      JSON.stringify(existingContacts)

    );


    // CALLBACK

    if(onSave){

      onSave(newContact);

    }


    // RESET FORM

    setName("");

    setPhone("");

    setRelationship("");

    setPriority(1);

    setErrors({});


    // CLOSE MODAL

    onClose();

  };


  // ═══════════════════════════════════════
  // CLOSE HANDLER
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

            <h2 style={styles.title}>
              Add Emergency Contact
            </h2>

            <p style={styles.subtitle}>
              SOS alerts will be sent here
            </p>

          </div>

          <button
            style={styles.closeBtn}
            onClick={handleClose}
          >
            ✕
          </button>

        </div>


        {/* FORM */}

        <div style={styles.form}>


          {/* NAME */}

          <div style={styles.field}>

            <label style={styles.label}>
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter full name"
              style={styles.input}
            />

            {errors.name && (

              <span style={styles.error}>
                {errors.name}
              </span>

            )}

          </div>


          {/* PHONE */}

          <div style={styles.field}>

            <label style={styles.label}>
              Phone Number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="9876543210"
              style={styles.input}
            />

            {errors.phone && (

              <span style={styles.error}>
                {errors.phone}
              </span>

            )}

          </div>


          {/* RELATIONSHIP */}

          <div style={styles.field}>

            <label style={styles.label}>
              Relationship
            </label>

            <input
              type="text"
              value={relationship}
              onChange={(e) =>
                setRelationship(e.target.value)
              }
              placeholder="Friend / Family"
              style={styles.input}
            />

            {errors.relationship && (

              <span style={styles.error}>
                {errors.relationship}
              </span>

            )}

          </div>


          {/* PRIORITY */}

          <div style={styles.field}>

            <label style={styles.label}>
              Contact Priority
            </label>

            <select

              value={priority}

              onChange={(e) =>
                setPriority(Number(e.target.value))
              }

              style={styles.select}
            >

              <option value={1}>
                Primary Contact
              </option>

              <option value={2}>
                Secondary Contact
              </option>

              <option value={3}>
                Backup Contact
              </option>

            </select>

          </div>


          {/* SAVE BUTTON */}

          <button
            style={styles.saveBtn}
            onClick={handleSave}
          >
            Save Emergency Contact
          </button>

        </div>

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

    maxWidth:"420px",

    background:"#13131a",

    border:"1px solid rgba(255,255,255,0.08)",

    borderRadius:"24px",

    padding:"24px",

    boxShadow:"0 12px 40px rgba(0,0,0,0.4)"

  },

  header: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"flex-start",

    marginBottom:"24px"

  },

  title: {

    margin:0,

    color:"#ffffff",

    fontSize:"22px",

    fontWeight:"700"

  },

  subtitle: {

    marginTop:"6px",

    color:"#8b8b9e",

    fontSize:"13px"

  },

  closeBtn: {

    background:"transparent",

    border:"none",

    color:"#8b8b9e",

    fontSize:"20px",

    cursor:"pointer"

  },

  form: {

    display:"flex",

    flexDirection:"column",

    gap:"18px"

  },

  field: {

    display:"flex",

    flexDirection:"column",

    gap:"8px"

  },

  label: {

    color:"#ffffff",

    fontSize:"13px",

    fontWeight:"600"

  },

  input: {

    width:"100%",

    padding:"14px",

    borderRadius:"14px",

    border:"1px solid rgba(255,255,255,0.08)",

    background:"#1c1c26",

    color:"#ffffff",

    fontSize:"14px",

    outline:"none"

  },

  select: {

    width:"100%",

    padding:"14px",

    borderRadius:"14px",

    border:"1px solid rgba(255,255,255,0.08)",

    background:"#1c1c26",

    color:"#ffffff",

    fontSize:"14px",

    outline:"none"

  },

  error: {

    color:"#ff3d6e",

    fontSize:"12px"

  },

  saveBtn: {

    width:"100%",

    padding:"16px",

    borderRadius:"16px",

    border:"none",

    background:"#00e87a",

    color:"#13131a",

    fontWeight:"700",

    fontSize:"15px",

    cursor:"pointer",

    marginTop:"10px"

  }

};