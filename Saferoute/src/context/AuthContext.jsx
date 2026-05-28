// src/context/AuthContext.jsx

import {

  createContext,

  useContext,

  useEffect,

  useMemo,

  useState

} from "react";


// ═══════════════════════════════════════
// AUTH CONTEXT
// ═══════════════════════════════════════

const AuthContext =
  createContext(null);


// ═══════════════════════════════════════
// AUTH PROVIDER
// ═══════════════════════════════════════

export function AuthProvider({

  children

}){

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);


  // ═══════════════════════════════════════
  // LOAD USER
  // ═══════════════════════════════════════

  useEffect(() => {

    try{

      const savedUser =

        localStorage.getItem(
          "saferoute-user"
        );


      if(savedUser){

        const parsedUser =
          JSON.parse(savedUser);

        setUser(parsedUser);

        setAuthenticated(true);

      }

    }catch(err){

      console.error(err);

    }finally{

      setLoading(false);

    }

  }, []);


  // ═══════════════════════════════════════
  // LOGIN
  // ═══════════════════════════════════════

  const login = async({

    email,

    password

  }) => {

    try{

      setLoading(true);


      // DEMO AUTH

      const fakeUser = {

        id:Date.now(),

        name:
          email.split("@")[0],

        email,

        avatar:null,

        createdAt:new Date(),

        emergencyMode:false

      };


      // SAVE

      localStorage.setItem(

        "saferoute-user",

        JSON.stringify(fakeUser)

      );


      setUser(fakeUser);

      setAuthenticated(true);


      return {

        success:true,

        user:fakeUser

      };

    }catch(err){

      console.error(err);

      return {

        success:false,

        message:"Login failed"

      };

    }finally{

      setLoading(false);

    }

  };


  // ═══════════════════════════════════════
  // REGISTER
  // ═══════════════════════════════════════

  const register = async({

    name,

    email,

    password

  }) => {

    try{

      setLoading(true);


      const newUser = {

        id:Date.now(),

        name,

        email,

        avatar:null,

        createdAt:new Date(),

        emergencyMode:false

      };


      localStorage.setItem(

        "saferoute-user",

        JSON.stringify(newUser)

      );


      setUser(newUser);

      setAuthenticated(true);


      return {

        success:true,

        user:newUser

      };

    }catch(err){

      console.error(err);

      return {

        success:false,

        message:"Registration failed"

      };

    }finally{

      setLoading(false);

    }

  };


  // ═══════════════════════════════════════
  // LOGOUT
  // ═══════════════════════════════════════

  const logout = () => {

    localStorage.removeItem(
      "saferoute-user"
    );

    setUser(null);

    setAuthenticated(false);

  };


  // ═══════════════════════════════════════
  // UPDATE USER
  // ═══════════════════════════════════════

  const updateUser = (updates) => {

    if(!user) return;


    const updatedUser = {

      ...user,

      ...updates

    };


    setUser(updatedUser);


    localStorage.setItem(

      "saferoute-user",

      JSON.stringify(updatedUser)

    );

  };


  // ═══════════════════════════════════════
  // TOGGLE EMERGENCY MODE
  // ═══════════════════════════════════════

  const toggleEmergencyMode = () => {

    if(!user) return;


    updateUser({

      emergencyMode:
        !user.emergencyMode

    });

  };


  // ═══════════════════════════════════════
  // AUTH VALUE
  // ═══════════════════════════════════════

  const value = useMemo(() => ({

    user,

    loading,

    authenticated,

    login,

    register,

    logout,

    updateUser,

    toggleEmergencyMode

  }),

  [

    user,

    loading,

    authenticated

  ]);


  // ═══════════════════════════════════════
  // PROVIDER
  // ═══════════════════════════════════════

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

}


// ═══════════════════════════════════════
// USE AUTH HOOK
// ═══════════════════════════════════════

export function useAuth(){

  const context =
    useContext(AuthContext);

  if(!context){

    throw new Error(

      "useAuth must be used inside AuthProvider"

    );

  }

  return context;

}