"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/supabase/supabaseClient';

const TIMEOUT_DURATION = 20 * 60 * 1000; // 20 menit dalam milliseconds

export function useSessionTimeout() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = async () => {
    console.log('[SessionTimeout] Session expired - logging out');
    await supabase.auth.signOut();
    
    // Clear localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      localStorage.removeItem(`generalInfo_${userEmail}`);
      localStorage.removeItem(`questionnaireAnswers_${userEmail}`);
    }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("universityName");
    
    router.push('/authentication/login');
  };

  const resetTimeout = () => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const inactiveTime = Date.now() - lastActivityRef.current;
      if (inactiveTime >= TIMEOUT_DURATION) {
        logout();
      }
    }, TIMEOUT_DURATION);
  };

  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Don't set timeout if not logged in

      // Events to track user activity
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

      // Add event listeners
      events.forEach(event => {
        window.addEventListener(event, resetTimeout);
      });

      // Initial timeout
      resetTimeout();

      // Cleanup
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, resetTimeout);
        });
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    };

    checkSession();
  }, []);

  return { resetTimeout };
}   