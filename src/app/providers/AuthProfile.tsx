"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export interface Profile {
  id: string;
  name: string | null;
  role: "user" | "reviewer" | "admin";
  is_approved: boolean;
}

export function useAuthProfile() {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const { data: p } = await supabase
          .from("Profiles")
          .select("id,name,role,is_approved")
          .eq("id", data.session.user.id)
          .single();
        if (!cancelled) setProfile((p as Profile) ?? null);
      } else {
        setProfile(null);
      }
      if (!cancelled) setLoading(false);
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("Profiles")
          .select("id,name,role,is_approved")
          .eq("id", session.user.id)
          .single()
          .then(({ data: p }) => setProfile((p as Profile) ?? null));
      } else {
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, profile, loading };
}
