import { createContext, useState, useCallback, useContext, useEffect } from "react";
import { logout as logoutService } from "../services/authService";
import { profileService, resolveEffectiveTier } from "../services/profileService";

/**
 * AuthContext — global auth state.
 *
 * Shape of `auth`:
 * {
 *   token        : string | null,
 *   customerId   : string | null,
 *   fullName     : string | null,
 *   tier         : 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM' | null,
 *   totalSpending: number | null,
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
  totalSpending: 0,
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
      const parsed = JSON.parse(memberRaw);
      const effectiveTier = resolveEffectiveTier(parsed.tier, parsed.totalSpending || 0);
      return { token: memberToken, ...parsed, tier: effectiveTier };
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

  // Auto-sync member profile to resolve real-time tier & spending from API
  useEffect(() => {
    if (auth.token && auth.role === "MEMBER") {
      profileService.getProfile()
        .then(profile => {
          if (profile) {
            const effectiveTier = resolveEffectiveTier(profile.tier, profile.totalSpending);
            const updated = {
              ...auth,
              fullName: profile.fullName || auth.fullName,
              tier: effectiveTier,
              totalSpending: profile.totalSpending ?? auth.totalSpending ?? 0,
            };
            setAuthState(updated);
            localStorage.setItem("member_user", JSON.stringify({
              customerId: auth.customerId,
              fullName: updated.fullName,
              tier: updated.tier,
              totalSpending: updated.totalSpending,
              suspendedUntil: auth.suspendedUntil,
              role: "MEMBER",
            }));
          }
        })
        .catch(() => {});
    }
  }, [auth.token, auth.role]);

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
