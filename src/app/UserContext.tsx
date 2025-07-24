"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type UserInfo = {
  current_user_id: string | null;
  current_user_name: string | null;
  current_user_email: string | null;
};

const UserContext = createContext<UserInfo>({ current_user_id: null, current_user_name: null, current_user_email: null });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo>({ current_user_id: null, current_user_name: null, current_user_email: null });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser({
          current_user_id: user.id,
          current_user_name: user.user_metadata.full_name || null,
          current_user_email: user.email || null,
        });
      } else {
        setUser({ current_user_id: null, current_user_name: null, current_user_email: null });
      }
    }
    fetchUser();

    // Listen for auth changes and update user info
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          current_user_id: session.user.id,
          current_user_name: session.user.user_metadata.full_name || null,
          current_user_email: session.user.email || null,
        });
      } else {
        setUser({ current_user_id: null, current_user_name: null, current_user_email: null });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  console.log ("user", user);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {

  return useContext(UserContext);
} 