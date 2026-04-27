"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// Static export: Supabase sends tokens in URL hash (#access_token=...)
// The browser client picks them up automatically.
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    // Give the client a moment to parse the hash and set the session
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        listener.subscription.unsubscribe();
        router.replace("/");
      }
    });
    // Fallback: if already signed in or no event fires
    const t = setTimeout(() => router.replace("/"), 3000);
    return () => {
      clearTimeout(t);
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--night)" }}>
      <Loader2 size={36} className="animate-spin" style={{ color: "var(--accent)" }} />
      <p style={{ color: "var(--muted)", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "3px" }}>
        CONNEXION EN COURS...
      </p>
    </div>
  );
}
