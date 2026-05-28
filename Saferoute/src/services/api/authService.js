// src/services/api/AuthServices.js

// ═══════════════════════════════════════
// BASE API CONFIG
// ═══════════════════════════════════════

const BASE_URL =

  import.meta.env.VITE_API_URL ||

  "http://localhost:5000/api";


// ═══════════════════════════════════════
// TOKEN STORAGE
// ═══════════════════════════════════════

const TOKEN_KEY =
  "saferoute-token";


// ═══════════════════════════════════════
// SAVE TOKEN
// ═══════════════════════════════════════

export const saveToken = (

  token

) => {

  localStorage.setItem(

    TOKEN_KEY,

    token

  );

};


// ═══════════════════════════════════════
// GET TOKEN
// ═══════════════════════════════════════

export const getToken = () => {

  return localStorage.getItem(
    TOKEN_KEY
  );

};


// ═══════════════════════════════════════
// REMOVE TOKEN
// ═══════════════════════════════════════

export const removeToken = () => {

  localStorage.removeItem(
    TOKEN_KEY
  );

};


// ═══════════════════════════════════════
// AUTH HEADERS
// ═══════════════════════════════════════

const authHeaders = () => {

  const token = getToken();

  return {

    "Content-Type":"application/json",

    Authorization:
      token
      ? `Bearer ${token}`
      : ""

  };

};


// ═══════════════════════════════════════
// REGISTER USER
// ═══════════════════════════════════════

export const registerUser =
  async(userData) => {

  try{

    const response = await fetch(

      `${BASE_URL}/auth/register`,

      {

        method:"POST",

        headers:{

          "Content-Type":
            "application/json"

        },

        body:JSON.stringify({

          name:userData.name,

          email:userData.email,

          password:userData.password

        })

      }

    );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(

        data.message ||

        "Registration failed"

      );

    }


    // SAVE TOKEN

    if(data.token){

      saveToken(data.token);

    }


    return {

      success:true,

      user:data.user,

      token:data.token,

      message:
        data.message ||

        "Registration successful"

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:
        err.message ||

        "Unable to register"

    };

  }

};


// ═══════════════════════════════════════
// LOGIN USER
// ═══════════════════════════════════════

export const loginUser =
  async(credentials) => {

  try{

    const response = await fetch(

      `${BASE_URL}/auth/login`,

      {

        method:"POST",

        headers:{

          "Content-Type":
            "application/json"

        },

        body:JSON.stringify({

          email:credentials.email,

          password:credentials.password

        })

      }

    );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(

        data.message ||

        "Login failed"

      );

    }


    // SAVE TOKEN

    if(data.token){

      saveToken(data.token);

    }


    return {

      success:true,

      user:data.user,

      token:data.token,

      message:
        data.message ||

        "Login successful"

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:
        err.message ||

        "Unable to login"

    };

  }

};


// ═══════════════════════════════════════
// GET PROFILE
// ═══════════════════════════════════════

export const getProfile =
  async() => {

  try{

    const response = await fetch(

      `${BASE_URL}/auth/profile`,

      {

        method:"GET",

        headers:authHeaders()

      }

    );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(

        data.message ||

        "Failed to fetch profile"

      );

    }


    return {

      success:true,

      user:data.user

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:
        err.message ||

        "Unable to fetch profile"

    };

  }

};


// ═══════════════════════════════════════
// UPDATE PROFILE
// ═══════════════════════════════════════

export const updateProfile =
  async(profileData) => {

  try{

    const response = await fetch(

      `${BASE_URL}/auth/profile`,

      {

        method:"PUT",

        headers:authHeaders(),

        body:JSON.stringify(profileData)

      }

    );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(

        data.message ||

        "Profile update failed"

      );

    }


    return {

      success:true,

      user:data.user,

      message:
        data.message ||

        "Profile updated"

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:
        err.message ||

        "Unable to update profile"

    };

  }

};


// ═══════════════════════════════════════
// CHANGE PASSWORD
// ═══════════════════════════════════════

export const changePassword =
  async(passwordData) => {

  try{

    const response = await fetch(

      `${BASE_URL}/auth/change-password`,

      {

        method:"PUT",

        headers:authHeaders(),

        body:JSON.stringify({

          currentPassword:
            passwordData.currentPassword,

          newPassword:
            passwordData.newPassword

        })

      }

    );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(

        data.message ||

        "Password update failed"

      );

    }


    return {

      success:true,

      message:
        data.message ||

        "Password updated"

    };

  }catch(err){

    console.error(err);

    return {

      success:false,

      message:
        err.message ||

        "Unable to change password"

    };

  }

};


// ═══════════════════════════════════════
// LOGOUT USER
// ═══════════════════════════════════════

export const logoutUser = () => {

  removeToken();

  localStorage.removeItem(
    "saferoute-user"
  );

  return {

    success:true,

    message:"Logged out"

  };

};


// ═══════════════════════════════════════
// VERIFY TOKEN
// ═══════════════════════════════════════

export const verifyToken =
  async() => {

  try{

    const token = getToken();

    if(!token){

      return {

        success:false,

        authenticated:false

      };

    }


    const response = await fetch(

      `${BASE_URL}/auth/verify`,

      {

        method:"GET",

        headers:authHeaders()

      }

    );


    const data =
      await response.json();


    if(!response.ok){

      removeToken();

      return {

        success:false,

        authenticated:false

      };

    }


    return {

      success:true,

      authenticated:true,

      user:data.user

    };

  }catch(err){

    console.error(err);

    removeToken();

    return {

      success:false,

      authenticated:false

    };

  }

};