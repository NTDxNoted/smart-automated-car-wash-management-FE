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
     const adminToken = localStorage.getItem("admin_token");
    const adminRaw = localStorage.getItem("admin_user");

    if (adminToken && adminRaw) {
      return { token: adminToken, ...JSON.parse(adminRaw) };
    }

    const memberToken = localStorage.getItem("member_token");
    const memberRaw = localStorage.getItem("member_user");

    if (memberToken && memberRaw) {
      return { token: memberToken, ...JSON.parse(memberRaw) };
    }
  } catch (_) {}
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
    if (auth.role === "ADMIN") {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  }

  if (auth.role === "MEMBER") {
    localStorage.removeItem("member_token");
    localStorage.removeItem("member_user");
  }
    //logoutService(); // clears localStorage
    setAuthState(DEFAULT_AUTH);
  }, [auth.role]);

  const isAdmin = !!auth.token && auth.role === "ADMIN";
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
