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

const ALLOWED_TIERS = ["MEMBER", "SILVER", "GOLD", "PLATINUM"];
const ALLOWED_ROLES = ["ADMIN", "MEMBER"];

// Sanitize string data before writing to or reading from browser storage to prevent Persistent XSS & Storage Poisoning
function sanitizeStorageString(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/[<>'"]/g, '').trim();
}

function sanitizeUserData(userObj, defaultRole = "MEMBER") {
  if (!userObj || typeof userObj !== "object") return null;

  const rawRole = String(userObj.role || defaultRole).toUpperCase();
  const role = ALLOWED_ROLES.includes(rawRole) ? rawRole : defaultRole;

  const rawTier = String(userObj.tier || "MEMBER").toUpperCase();
  const tier = ALLOWED_TIERS.includes(rawTier) ? rawTier : "MEMBER";

  return {
    customerId: userObj.customerId ? sanitizeStorageString(userObj.customerId) : null,
    adminId: userObj.adminId ? sanitizeStorageString(userObj.adminId) : null,
    fullName: sanitizeStorageString(userObj.fullName || ''),
    phone: userObj.phone ? sanitizeStorageString(userObj.phone) : null,
    role,
    tier,
    totalSpending: Number(userObj.totalSpending || 0),
    suspendedUntil: userObj.suspendedUntil ? sanitizeStorageString(userObj.suspendedUntil) : null,
  };
}

// Rehydrate from localStorage on app boot
function loadFromStorage() {
  try {
    const adminToken = localStorage.getItem("admin_token");
    const adminRaw = localStorage.getItem("admin_user");

    if (adminToken && adminRaw) {
      const sanitizedAdmin = sanitizeUserData(JSON.parse(adminRaw), "ADMIN");
      if (sanitizedAdmin) {
        return { token: adminToken, ...sanitizedAdmin };
      }
    }

    const memberToken = localStorage.getItem("member_token");
    const memberRaw = localStorage.getItem("member_user");

    if (memberToken && memberRaw) {
      const parsed = JSON.parse(memberRaw);
      const sanitizedMember = sanitizeUserData(parsed, "MEMBER");
      if (sanitizedMember) {
        const effectiveTier = resolveEffectiveTier(sanitizedMember.tier, sanitizedMember.totalSpending || 0);
        return { token: memberToken, ...sanitizedMember, tier: effectiveTier };
      }
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
            const computedTier = resolveEffectiveTier(profile.tier, profile.totalSpending);
            const safeFullName = sanitizeStorageString(profile.fullName || auth.fullName);
            const safeTier = ALLOWED_TIERS.includes(String(computedTier).toUpperCase())
              ? String(computedTier).toUpperCase()
              : "MEMBER";
            const safeSpending = Number(profile.totalSpending ?? auth.totalSpending ?? 0);

            const safeDataToStore = sanitizeUserData({
              customerId: auth.customerId,
              fullName: safeFullName,
              tier: safeTier,
              totalSpending: safeSpending,
              suspendedUntil: auth.suspendedUntil,
              role: "MEMBER",
            }, "MEMBER");

            const updated = {
              ...auth,
              ...safeDataToStore,
            };
            setAuthState(updated);
            localStorage.setItem("member_user", JSON.stringify(safeDataToStore));
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
