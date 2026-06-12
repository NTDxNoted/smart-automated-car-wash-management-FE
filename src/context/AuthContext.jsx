import { createContext, useState, useCallback, useContext } from "react";
import { logout as logoutService } from "../services/authService";

/**
 * AuthContext — global auth state.
 *
 * Shape of `auth`:
 * {
 *   token        : string | null,
 *   customerId   : string | null,
 *   fullName     : string | null,
 *   tier         : 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM' | null,
 *   suspendedUntil: string | null,  // ISO date or null
 *   role         : 'ADMIN' | 'MEMBER' | null,
 * }
 */

const DEFAULT_AUTH = {
  token: null,
  customerId: null,
  adminId: null,
  fullName: null,
  tier: null,
  suspendedUntil: null,
  role: null,
};

// Rehydrate from localStorage on app boot
function loadFromStorage() {
  try {
    const token = localStorage.getItem("aw_token");
    const raw = localStorage.getItem("aw_user");
    if (token && raw) {
      return { token, ...JSON.parse(raw) };
    }
  } catch (_) { /* ignore */ }
  return DEFAULT_AUTH;
}

export const AuthContext = createContext({
  auth: DEFAULT_AUTH,
  setAuth: () => { },
  logout: () => { },
  isAdmin: false,
  isMember: false,
  isGuest: true,
});

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(loadFromStorage);

  const setAuth = useCallback((payload) => {
    setAuthState(payload ?? DEFAULT_AUTH);
  }, []);

  const logout = useCallback(() => {
    logoutService(); // clears localStorage
    setAuthState(DEFAULT_AUTH);
  }, []);

  const isAdmin = auth.role === "ADMIN";
  const isMember = !!auth.token && auth.role === "MEMBER";
  const isGuest = !auth.token;

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, isAdmin, isMember, isGuest }}>
      {children}
    </AuthContext.Provider>

  );
}

export function useAuth() {
  return useContext(AuthContext);
}
