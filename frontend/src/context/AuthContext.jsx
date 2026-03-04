import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check existing login on refresh
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        dispatch({ type: "AUTH_FAILURE" });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // ✅ LOGIN (DIRECT CALL TO BACKEND — NO SERVICES, NO API CLIENT)
  const login = useCallback(async (credentials) => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      dispatch({ type: "AUTH_SUCCESS", payload: data });
      return data; // Return data for caller to handle redirects
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    dispatch({ type: "LOGOUT" });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    isStudent: state.user?.role === "student",
    isAdmin: state.user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
