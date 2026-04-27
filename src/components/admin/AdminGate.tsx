"use client";
import { useEffect, useState } from "react";
import { createClient, isAdmin } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import AuthModal from "@/components/AuthModal";
import AdminPanel from "./AdminPanel";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminGate() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user); setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null); setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--night)' }}>
      <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: 'var(--night)' }}>
      <ShieldAlert size={56} style={{ color: 'var(--muted)', opacity: 0.4 }} />
      <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '3px', color: 'var(--sand)' }}>
        ACCÈS ADMIN
      </h1>
      <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
        Connectez-vous avec votre adresse admin pour accéder au tableau de bord.
      </p>
      <button onClick={() => setShowAuth(true)} className="btn-primary">
        Se connecter
      </button>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={() => setShowAuth(false)} />}
    </div>
  );

  if (!isAdmin(user.email)) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: 'var(--night)' }}>
      <ShieldAlert size={56} style={{ color: '#f85149', opacity: 0.6 }} />
      <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', letterSpacing: '3px', color: 'var(--sand)' }}>
        ACCÈS REFUSÉ
      </h1>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        {user.email} n&apos;est pas une adresse administrateur.
      </p>
      <button onClick={() => createClient().auth.signOut()} className="btn-ghost text-sm">
        Se déconnecter
      </button>
    </div>
  );

  return <AdminPanel user={user} />;
}
