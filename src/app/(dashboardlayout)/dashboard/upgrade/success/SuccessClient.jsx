"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function SuccessClient() {
  useEffect(() => {
    const refreshSession = async () => {
      try {
        await authClient.getSession({
          query: {
            disableCookieCache: true,
          },
        });
      } catch (err) {
        console.error("Failed to refresh session on success:", err);
      }
    };
    refreshSession();
  }, []);

  return null;
}
