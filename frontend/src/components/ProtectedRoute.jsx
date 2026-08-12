import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute() {

  const {
    user,
    loading,
  } = useAuth();

  const location = useLocation();


  /* =======================================================
     AUTHENTICATION IS STILL BEING CHECKED
     ======================================================= */

  if (loading) {

    return (
      <div className="auth-loading">

        <div className="auth-loading-spinner" />

        <p>
          Loading your workspace...
        </p>

      </div>
    );

  }


  /* =======================================================
     USER IS NOT LOGGED IN
     ======================================================= */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );

  }


  /* =======================================================
     USER IS AUTHENTICATED
     ======================================================= */

  return <Outlet />;
}