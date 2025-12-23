"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export interface Profile {
  id: string;
  name: string;
  role: "user" | "reviewer" | "admin";
  is_approved: boolean;
  is_rejected?: boolean;
  created_at: string;
}

export function useAuthProfile() {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      // ✅ FIXED: Use getUser() instead of getSession()
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();
      if (ignore) return;

      setUser(authUser ?? null);

      if (authUser) {
        const { data: profileData } = await supabase
          .from("Profiles")
          .select("id,name,role,is_approved")
          .eq("id", authUser.id)
          .single();

        if (!ignore) setProfile((profileData as Profile) ?? null);
      } else {
        setProfile(null);
      }
      if (!ignore) setLoading(false);
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setProfile(null);
        if (session?.user) {
          supabase
            .from("Profiles")
            .select("id,name,role,is_approved")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => setProfile((data as Profile) ?? null));
        }
      }
    );

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, profile, loading };
}
