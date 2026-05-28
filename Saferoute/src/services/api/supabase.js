// src/services/api/supabase.js

import { createClient }
from "@supabase/supabase-js";


// ═══════════════════════════════════════
// SUPABASE ENV VARIABLES
// ═══════════════════════════════════════

const SUPABASE_URL =

  import.meta.env.VITE_SUPABASE_URL;

const SUPABASE_ANON_KEY =

  import.meta.env.VITE_SUPABASE_ANON_KEY;


// ═══════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════

if(

  !SUPABASE_URL ||

  !SUPABASE_ANON_KEY

){

  console.error(

    "Missing Supabase environment variables"

  );

}


// ═══════════════════════════════════════
// CREATE CLIENT
// ═══════════════════════════════════════

export const supabase = createClient(

  SUPABASE_URL,

  SUPABASE_ANON_KEY,

  {

    auth:{

      persistSession:true,

      autoRefreshToken:true,

      detectSessionInUrl:true

    }

  }

);


// ═══════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════


// SIGN UP

export const signUpUser =
  async({

    name,

    email,

    password

  }) => {

  try{

    const {

      data,

      error

    } = await supabase.auth.signUp({

      email,

      password,

      options:{

        data:{

          name

        }

      }

    });


    if(error){

      throw error;

    }


    return {

      success:true,

      user:data.user,

      session:data.session

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// LOGIN

export const signInUser =
  async({

    email,

    password

  }) => {

  try{

    const {

      data,

      error

    } = await supabase.auth.signInWithPassword({

      email,

      password

    });


    if(error){

      throw error;

    }


    return {

      success:true,

      user:data.user,

      session:data.session

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// LOGOUT

export const signOutUser =
  async() => {

  try{

    const {

      error

    } = await supabase.auth.signOut();


    if(error){

      throw error;

    }


    return {

      success:true

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// GET CURRENT USER

export const getCurrentUser =
  async() => {

  try{

    const {

      data,

      error

    } = await supabase.auth.getUser();


    if(error){

      throw error;

    }


    return {

      success:true,

      user:data.user

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// RESET PASSWORD

export const resetPassword =
  async(email) => {

  try{

    const {

      error

    } = await supabase.auth.resetPasswordForEmail(

      email

    );


    if(error){

      throw error;

    }


    return {

      success:true

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// ═══════════════════════════════════════
// DATABASE HELPERS
// ═══════════════════════════════════════


// ADD DANGER REPORT

export const addDangerReport =
  async(reportData) => {

  try{

    const {

      data,

      error

    } = await supabase

      .from("danger_reports")

      .insert([reportData])

      .select();


    if(error){

      throw error;

    }


    return {

      success:true,

      data

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// GET REPORTS

export const getDangerReports =
  async() => {

  try{

    const {

      data,

      error

    } = await supabase

      .from("danger_reports")

      .select("*")

      .order(

        "created_at",

        {

          ascending:false

        }

      );


    if(error){

      throw error;

    }


    return {

      success:true,

      data

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// ADD EMERGENCY CONTACT

export const addEmergencyContact =
  async(contactData) => {

  try{

    const {

      data,

      error

    } = await supabase

      .from("emergency_contacts")

      .insert([contactData])

      .select();


    if(error){

      throw error;

    }


    return {

      success:true,

      data

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// GET EMERGENCY CONTACTS

export const getEmergencyContacts =
  async(userId) => {

  try{

    const {

      data,

      error

    } = await supabase

      .from("emergency_contacts")

      .select("*")

      .eq("user_id", userId)

      .order(

        "priority",

        {

          ascending:true

        }

      );


    if(error){

      throw error;

    }


    return {

      success:true,

      data

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// SAVE LIVE LOCATION

export const saveLiveLocation =
  async(locationData) => {

  try{

    const {

      data,

      error

    } = await supabase

      .from("live_tracking")

      .insert([locationData])

      .select();


    if(error){

      throw error;

    }


    return {

      success:true,

      data

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};


// ═══════════════════════════════════════
// REALTIME SUBSCRIPTIONS
// ═══════════════════════════════════════


// SUBSCRIBE TO REPORTS

export const subscribeToReports =
  (callback) => {

  return supabase

    .channel("danger-reports-channel")

    .on(

      "postgres_changes",

      {

        event:"*",

        schema:"public",

        table:"danger_reports"

      },

      payload => {

        callback(payload);

      }

    )

    .subscribe();

};


// ═══════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════


// UPLOAD PROFILE IMAGE

export const uploadProfileImage =
  async(file, userId) => {

  try{

    const fileExt =
      file.name.split(".").pop();

    const fileName =
      `${userId}.${fileExt}`;


    const {

      data,

      error

    } = await supabase.storage

      .from("profile-images")

      .upload(fileName, file, {

        upsert:true

      });


    if(error){

      throw error;

    }


    const {

      data:urlData

    } = supabase.storage

      .from("profile-images")

      .getPublicUrl(fileName);


    return {

      success:true,

      url:urlData.publicUrl

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:err.message

    };

  }

};