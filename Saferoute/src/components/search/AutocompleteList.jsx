// src/components/search/AutocompleteList.jsx

import { useMemo } from "react";


// ═══════════════════════════════════════
// AUTOCOMPLETE LIST
// ═══════════════════════════════════════

export default function AutocompleteList({

  results = [],

  loading = false,

  error = "",

  visible = false,

  query = "",

  onSelect,

  onClose

}){


  // ═══════════════════════════════════════
  // HIGHLIGHT MATCHING TEXT
  // ═══════════════════════════════════════

  const highlightMatch = (text) => {

    if(!query) return text;

    const regex = new RegExp(

      `(${query})`,

      "gi"

    );

    return text.replace(

      regex,

      `<span style="
        color:#00e87a;
        font-weight:700;
      ">
        $1
      </span>`
    );

  };


  // ═══════════════════════════════════════
  // EMPTY STATE
  // ═══════════════════════════════════════

  const isEmpty = useMemo(() => {

    return (
      !loading &&
      !error &&
      results.length === 0 &&
      query.length > 2
    );

  }, [results, loading, error, query]);


  // ═══════════════════════════════════════
  // HIDE COMPONENT
  // ═══════════════════════════════════════

  if(!visible){

    return null;

  }


  // ═══════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════

  return (

    <div style={styles.container}>


      {/* HEADER */}

      <div style={styles.header}>


        <div style={styles.headerTitle}>
          Search Results
        </div>


        <button
          style={styles.closeBtn}
          onClick={onClose}
        >
          ✕
        </button>

      </div>


      {/* LOADING */}

      {loading && (

        <div style={styles.loadingContainer}>


          <div style={styles.loader} />


          <div style={styles.loadingText}>
            Searching locations...
          </div>

        </div>

      )}


      {/* ERROR */}

      {!loading && error && (

        <div style={styles.errorContainer}>


          <div style={styles.errorIcon}>
            ⚠️
          </div>


          <div style={styles.errorText}>
            {error}
          </div>

        </div>

      )}


      {/* EMPTY */}

      {isEmpty && (

        <div style={styles.emptyContainer}>


          <div style={styles.emptyIcon}>
            📍
          </div>


          <div style={styles.emptyTitle}>
            No locations found
          </div>


          <div style={styles.emptySubtitle}>
            Try another search term
          </div>

        </div>

      )}


      {/* RESULTS */}

      {!loading &&
       !error &&
       results.length > 0 && (

        <div style={styles.resultsContainer}>


          {results.map((item,index) => {


            const title =

              item.display_name
              || item.name
              || "Unknown Location";


            const parts =
              title.split(",");


            const primary =
              parts[0];


            const secondary =
              parts.slice(1).join(",");


            return (

              <button

                key={index}

                style={styles.resultItem}

                onClick={() =>
                  onSelect(item)
                }

              >


                {/* ICON */}

                <div style={styles.iconWrapper}>

                  📍

                </div>


                {/* CONTENT */}

                <div style={styles.content}>


                  <div

                    style={styles.primaryText}

                    dangerouslySetInnerHTML={{

                      __html:
                        highlightMatch(primary)

                    }}

                  />


                  <div

                    style={styles.secondaryText}

                    dangerouslySetInnerHTML={{

                      __html:
                        highlightMatch(secondary)

                    }}

                  />

                </div>


                {/* ARROW */}

                <div style={styles.arrow}>
                  →
                </div>

              </button>

            );

          })}

        </div>

      )}

    </div>

  );

}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const styles = {

  container: {

    position:"absolute",

    top:"100%",

    left:0,

    right:0,

    marginTop:"10px",

    background:"#13131a",

    borderRadius:"22px",

    border:"1px solid rgba(255,255,255,0.08)",

    overflow:"hidden",

    zIndex:9999,

    backdropFilter:"blur(16px)",

    boxShadow:"0 12px 40px rgba(0,0,0,0.35)",

    maxHeight:"420px",

    overflowY:"auto"

  },

  header: {

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    padding:"16px 18px",

    borderBottom:
      "1px solid rgba(255,255,255,0.06)"

  },

  headerTitle: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"700"

  },

  closeBtn: {

    background:"transparent",

    border:"none",

    color:"#8b8b9e",

    cursor:"pointer",

    fontSize:"16px"

  },

  loadingContainer: {

    padding:"34px 20px",

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    gap:"16px"

  },

  loader: {

    width:"36px",

    height:"36px",

    borderRadius:"50%",

    border:"3px solid rgba(255,255,255,0.08)",

    borderTop:"3px solid #00e87a",

    animation:"spinLoader 1s linear infinite"

  },

  loadingText: {

    color:"#8b8b9e",

    fontSize:"13px"

  },

  errorContainer: {

    padding:"28px 20px",

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    gap:"12px"

  },

  errorIcon: {

    fontSize:"26px"

  },

  errorText: {

    color:"#ff3d6e",

    fontSize:"13px",

    textAlign:"center"

  },

  emptyContainer: {

    padding:"32px 20px",

    display:"flex",

    flexDirection:"column",

    alignItems:"center",

    gap:"10px"

  },

  emptyIcon: {

    fontSize:"28px"

  },

  emptyTitle: {

    color:"#ffffff",

    fontWeight:"700",

    fontSize:"14px"

  },

  emptySubtitle: {

    color:"#8b8b9e",

    fontSize:"12px"

  },

  resultsContainer: {

    display:"flex",

    flexDirection:"column"

  },

  resultItem: {

    width:"100%",

    border:"none",

    background:"transparent",

    display:"flex",

    alignItems:"center",

    gap:"14px",

    padding:"16px 18px",

    cursor:"pointer",

    borderBottom:
      "1px solid rgba(255,255,255,0.04)",

    transition:"0.2s",

    textAlign:"left"

  },

  iconWrapper: {

    width:"42px",

    height:"42px",

    borderRadius:"14px",

    background:"rgba(0,232,122,0.12)",

    display:"flex",

    alignItems:"center",

    justifyContent:"center",

    fontSize:"18px",

    flexShrink:0

  },

  content: {

    flex:1,

    overflow:"hidden"

  },

  primaryText: {

    color:"#ffffff",

    fontSize:"14px",

    fontWeight:"700",

    whiteSpace:"nowrap",

    overflow:"hidden",

    textOverflow:"ellipsis"

  },

  secondaryText: {

    marginTop:"4px",

    color:"#8b8b9e",

    fontSize:"12px",

    whiteSpace:"nowrap",

    overflow:"hidden",

    textOverflow:"ellipsis"

  },

  arrow: {

    color:"#8b8b9e",

    fontSize:"16px",

    flexShrink:0

  }

};


// ═══════════════════════════════════════
// GLOBAL ANIMATION
// ═══════════════════════════════════════

if(typeof document !== "undefined"){

  const existing =
    document.getElementById(
      "autocomplete-loader-style"
    );

  if(!existing){

    const style =
      document.createElement("style");

    style.id =
      "autocomplete-loader-style";

    style.innerHTML = `

      @keyframes spinLoader{

        from{
          transform:rotate(0deg);
        }

        to{
          transform:rotate(360deg);
        }

      }

    `;

    document.head.appendChild(style);

  }

}