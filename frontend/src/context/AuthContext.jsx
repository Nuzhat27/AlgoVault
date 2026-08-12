import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  loginUser,
  registerUser,
  fetchMe,
} from "../api/endpoints";

const AuthContext = createContext(null);

/* =========================================================
   Read user already stored in browser
========================================================= */

function readStoredUser() {
  try {
    const raw = localStorage.getItem("user");

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error("Could not read stored user:", error);

    localStorage.removeItem("user");
    return null;
  }
}

/* =========================================================
   Extract token from ANY supported backend response
========================================================= */

function getToken(response) {
  if (!response) {
    return null;
  }

  return (
    response.token ||
    response.accessToken ||
    response.data?.token ||
    response.data?.accessToken ||
    null
  );
}

/* =========================================================
   Extract user from backend response
========================================================= */

function getUser(response) {
  if (!response) {
    return null;
  }

  // { token, user: {...} }
  if (response.user) {
    return response.user;
  }

  // { data: { token, user: {...} } }
  if (response.data?.user) {
    return response.data.user;
  }

  // Backend response you showed earlier:
  //
  // {
  //   _id,
  //   name,
  //   email,
  //   role,
  //   registrationNumber,
  //   token
  // }

  if (response._id || response.id) {
    return {
      _id: response._id || response.id,
      name: response.name || "",
      email: response.email || "",
      role: response.role || "student",
      registrationNumber: response.registrationNumber || "",
    };
  }

  // Some APIs return:
  // { data: { _id, name, email, ... } }

  if (response.data?._id || response.data?.id) {
    return {
      _id: response.data._id || response.data.id,
      name: response.data.name || "",
      email: response.data.email || "",
      role: response.data.role || "student",
      registrationNumber:
        response.data.registrationNumber || "",
    };
  }

  return null;
}

/* =========================================================
   Save session
========================================================= */

function saveToken(token) {
  if (!token) {
    throw new Error(
      "Login succeeded but the server did not return an authentication token."
    );
  }

  localStorage.setItem("token", token);
}

function saveUser(user) {
  if (!user) {
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
}

/* =========================================================
   Auth Provider
========================================================= */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     RESTORE SESSION AFTER REFRESH
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      // No token = logged out
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }

        return;
      }

      try {
        /*
          Token already exists.

          Ask backend who this token belongs to.
        */

        const response = await fetchMe();

        const currentUser =
          response?.user ||
          response?.data?.user ||
          response;

        if (!currentUser || !(currentUser._id || currentUser.id)) {
          throw new Error("Invalid user returned from /auth/me");
        }

        if (mounted) {
          setUser(currentUser);
          saveUser(currentUser);
        }
      } catch (error) {
        console.error("Session restore failed:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOGIN
  ======================================================= */

  const login = useCallback(async (email, password) => {
    const response = await loginUser({
      email: email.trim(),
      password,
    });

    console.log("LOGIN RESPONSE:", response);

    /*
      IMPORTANT:

      First get the token.

      We do NOT require user information in the login
      response anymore.
    */

    const token = getToken(response);

    if (!token) {
      throw new Error(
        "Login failed: the server did not return an authentication token."
      );
    }

    /*
      Save token FIRST.

      This is important because axios.js reads the token
      from localStorage when making /auth/me request.
    */

    saveToken(token);

    /*
      Try to get user directly from login response.
    */

    let loggedInUser = getUser(response);

    /*
      If login response doesn't contain user information,
      use /auth/me.

      This fixes the exact error you are currently getting.
    */

    if (!loggedInUser) {
      try {
        const meResponse = await fetchMe();

        loggedInUser =
          meResponse?.user ||
          meResponse?.data?.user ||
          meResponse;
      } catch (error) {
        console.error(
          "Login succeeded but /auth/me failed:",
          error
        );

        localStorage.removeItem("token");

        throw new Error(
          "Login succeeded, but the server could not verify the user session."
        );
      }
    }

    /*
      Final validation.
    */

    if (
      !loggedInUser ||
      !(loggedInUser._id || loggedInUser.id)
    ) {
      localStorage.removeItem("token");

      throw new Error(
        "The server returned a token but no valid user account."
      );
    }

    /*
      Normalize id -> _id
    */

    if (!loggedInUser._id && loggedInUser.id) {
      loggedInUser = {
        ...loggedInUser,
        _id: loggedInUser.id,
      };
    }

    saveUser(loggedInUser);

    setUser(loggedInUser);

    return loggedInUser;
  }, []);

  /* =======================================================
     REGISTER
  ======================================================= */

  const register = useCallback(
    async (name, email, password) => {
      const response = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      console.log("REGISTER RESPONSE:", response);

      const token = getToken(response);

      if (!token) {
        throw new Error(
          "Account was created but the server did not return an authentication token."
        );
      }

      saveToken(token);

      let createdUser = getUser(response);

      /*
        If registration returns only a token,
        retrieve the newly created user.
      */

      if (!createdUser) {
        try {
          const meResponse = await fetchMe();

          createdUser =
            meResponse?.user ||
            meResponse?.data?.user ||
            meResponse;
        } catch (error) {
          console.error(
            "Registration succeeded but /auth/me failed:",
            error
          );

          localStorage.removeItem("token");

          throw new Error(
            "Account was created, but the user session could not be verified."
          );
        }
      }

      if (
        !createdUser ||
        !(createdUser._id || createdUser.id)
      ) {
        localStorage.removeItem("token");

        throw new Error(
          "The server returned a token but no valid user account."
        );
      }

      if (!createdUser._id && createdUser.id) {
        createdUser = {
          ...createdUser,
          _id: createdUser.id,
        };
      }

      saveUser(createdUser);

      setUser(createdUser);

      return createdUser;
    },
    []
  );

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  }, []);

  /* =======================================================
     CONTEXT
  ======================================================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================================================
   useAuth Hook
========================================================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}