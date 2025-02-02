"use client";

import { createClient } from "@/utils/supabase/client";

export const signout = () => {
  const supabse = createClient();
  return supabse.auth.signOut();
};
