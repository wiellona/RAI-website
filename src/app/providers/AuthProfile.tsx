"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/supabase/supabaseClient";

export interface Profile {
  id: string;
  name: string | null;
  role: "user" | "reviewer" | "admin";
  is_approved: boolean;
  university_id?: string | null;
}

export function useAuthProfile() {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (ignore) return;

        setUser(authUser ?? null);

        if (authUser) {
          const { data: profileData } = await supabase
            .from("Profiles")
            .select("id,name,role,is_approved,university_id")
            .eq("id", authUser.id)
            .single();

          if (!ignore) {
            setProfile((profileData as Profile) ?? null);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("[AuthProfile] Error:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data } = await supabase
            .from("Profiles")
            .select("id,name,role,is_approved")
            .eq("id", session.user.id)
            .single();

          setProfile((data as Profile) ?? null);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      localStorage.removeItem(`generalInfo_${userEmail}`);
      localStorage.removeItem(`questionnaireAnswers_${userEmail}`);
    }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("universityName");

    window.location.href = "/";
  };

  return { user, profile, loading, logout };
}
