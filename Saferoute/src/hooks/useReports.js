// src/hooks/useReports.js

import {

  useCallback,

  useEffect,

  useMemo,

  useState

} from "react";


// ═══════════════════════════════════════
// USE REPORTS HOOK
// ═══════════════════════════════════════

export default function useReports(){

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("all");


  // ═══════════════════════════════════════
  // LOAD REPORTS
  // ═══════════════════════════════════════

  const loadReports =
    useCallback(() => {

      try{

        setLoading(true);

        const storedReports =

          JSON.parse(

            localStorage.getItem(
              "dangerReports"
            )

          ) || [];


        setReports(storedReports);

      }catch(err){

        console.error(err);

        setError(
          "Failed to load reports"
        );

      }finally{

        setLoading(false);

      }

    }, []);


  // ═══════════════════════════════════════
  // INITIAL LOAD
  // ═══════════════════════════════════════

  useEffect(() => {

    loadReports();

  }, [loadReports]);


  // ═══════════════════════════════════════
  // ADD REPORT
  // ═══════════════════════════════════════

  const addReport = (

    reportData

  ) => {

    try{

      const newReport = {

        id:Date.now(),

        type:
          reportData.type ||

          "harassment",

        severity:
          reportData.severity ||

          "medium",

        description:
          reportData.description ||

          "",

        lat:reportData.lat,

        lng:reportData.lng,

        createdAt:new Date(),

        verified:false,

        votes:0

      };


      const updatedReports = [

        newReport,

        ...reports

      ];


      setReports(updatedReports);


      localStorage.setItem(

        "dangerReports",

        JSON.stringify(updatedReports)

      );


      return {

        success:true,

        report:newReport

      };

    }catch(err){

      console.error(err);

      setError(
        "Failed to add report"
      );

      return {

        success:false

      };

    }

  };


  // ═══════════════════════════════════════
  // REMOVE REPORT
  // ═══════════════════════════════════════

  const removeReport = (

    reportId

  ) => {

    try{

      const updatedReports =

        reports.filter(

          report =>
            report.id !== reportId

        );


      setReports(updatedReports);


      localStorage.setItem(

        "dangerReports",

        JSON.stringify(updatedReports)

      );


      return {

        success:true

      };

    }catch(err){

      console.error(err);

      return {

        success:false

      };

    }

  };


  // ═══════════════════════════════════════
  // VERIFY REPORT
  // ═══════════════════════════════════════

  const verifyReport = (

    reportId

  ) => {

    try{

      const updatedReports =

        reports.map(report => {

          if(report.id === reportId){

            return {

              ...report,

              verified:true,

              votes:
                report.votes + 1

            };

          }

          return report;

        });


      setReports(updatedReports);


      localStorage.setItem(

        "dangerReports",

        JSON.stringify(updatedReports)

      );


      return {

        success:true

      };

    }catch(err){

      console.error(err);

      return {

        success:false

      };

    }

  };


  // ═══════════════════════════════════════
  // DOWNVOTE REPORT
  // ═══════════════════════════════════════

  const downvoteReport = (

    reportId

  ) => {

    try{

      const updatedReports =

        reports.map(report => {

          if(report.id === reportId){

            return {

              ...report,

              votes:
                report.votes - 1

            };

          }

          return report;

        });


      setReports(updatedReports);


      localStorage.setItem(

        "dangerReports",

        JSON.stringify(updatedReports)

      );


      return {

        success:true

      };

    }catch(err){

      console.error(err);

      return {

        success:false

      };

    }

  };


  // ═══════════════════════════════════════
  // FILTERED REPORTS
  // ═══════════════════════════════════════

  const filteredReports =
    useMemo(() => {

      if(filter === "all"){

        return reports;

      }

      return reports.filter(

        report =>
          report.type === filter

      );

    },

    [reports, filter]);


  // ═══════════════════════════════════════
  // REPORT STATISTICS
  // ═══════════════════════════════════════

  const stats = useMemo(() => {

    const total =
      reports.length;

    const verified =
      reports.filter(

        r => r.verified

      ).length;

    const highRisk =
      reports.filter(

        r => r.severity === "high"

      ).length;

    const harassment =
      reports.filter(

        r => r.type === "harassment"

      ).length;

    const theft =
      reports.filter(

        r => r.type === "theft"

      ).length;

    return {

      total,

      verified,

      highRisk,

      harassment,

      theft

    };

  }, [reports]);


  // ═══════════════════════════════════════
  // CLEAR ALL REPORTS
  // ═══════════════════════════════════════

  const clearReports = () => {

    localStorage.removeItem(
      "dangerReports"
    );

    setReports([]);

  };


  // ═══════════════════════════════════════
  // RETURN
  // ═══════════════════════════════════════

  return {

    reports,

    filteredReports,

    loading,

    error,

    filter,

    setFilter,

    stats,

    addReport,

    removeReport,

    verifyReport,

    downvoteReport,

    clearReports,

    refreshReports:loadReports

  };

}