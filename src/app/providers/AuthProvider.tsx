"use client";
import { createContext, useContext } from "react";
import { useAuthProfile } from "@/app/providers/AuthProfile";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

const AuthContext = createContext<ReturnType<typeof useAuthProfile> | null>(
  null
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProfile();
  
  // ✅ Activate session timeout (20 minutes)
  useSessionTimeout();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
