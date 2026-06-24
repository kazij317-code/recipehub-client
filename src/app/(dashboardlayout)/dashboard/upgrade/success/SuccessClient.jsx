"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function SuccessClient({ type }) {
  const session = authClient.useSession();
  const user = session.data?.user;

  useEffect(() => {
    // If it's a recipe purchase, no plan upgrade happened
    if (type === "recipe_purchase") {
      return;
    }

    if (session.isPending || !user) {
      return;
    }

    // If the user already has premium status, do not reload
    if (user.plan === "premium" || user.isPremium) {
      return;
    }

    // Safety fallback: only reload once per session to prevent infinite loops
    const hasReloadedKey = `recipehub_upgrade_reloaded_${user.id}`;
    if (sessionStorage.getItem(hasReloadedKey)) {
      return;
    }

    const refreshSession = async () => {
      try {
        await authClient.getSession({
          query: {
            disableCookieCache: true,
          },
        });
        sessionStorage.setItem(hasReloadedKey, "true");
        window.location.reload();
      } catch (err) {
        console.error("Failed to refresh session on success:", err);
      }
    };

    refreshSession();
  }, [user, session.isPending, type]);

  return null;
}
