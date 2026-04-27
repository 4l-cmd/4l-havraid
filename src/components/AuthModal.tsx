"use client";
import { useState } from "react";
import { createClient, isAdmin } from "@/lib/supabase";
import { X, Mail, KeyRound, Loader2 } from "lucide-react";

interface Props {
  onClose: () => void;
  onAuth: (email: string, admin: boolean) => void;
}

export default function AuthModal({ onClose, onAuth }: Props) {
  const [step, setStep] = useState<"email" | "sent">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendLink() {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setStep("sent");
  }

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-xl p-8 relative" style={{ background: 'var(--night2)', border: '1px solid rgba(255,255,255,.1)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(196,98,45,.15)', border: '1px solid rgba(196,98,45,.3)' }}>
            <Mail size={24} style={{ color: 'var(--terra)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: '3px', color: 'var(--sand)' }}>
            MON ESPACE
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {step === "email" ? "Entrez votre email pour recevoir un lien de connexion sécurisé." : "Un lien vous a été envoyé. Vérifiez votre boîte mail."}
          </p>
        </div>

        {step === "email" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendLink()}
                placeholder="votre@email.com"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button onClick={sendLink} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              {loading ? "Envoi en cours..." : "Recevoir le lien"}
            </button>
            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              Aucun mot de passe nécessaire · Connexion sécurisée par email
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(82,183,136,.15)', border: '1px solid rgba(82,183,136,.3)' }}>
              <KeyRound size={28} style={{ color: 'var(--green-light)' }} />
            </div>
            <p style={{ color: 'var(--text-dim)' }}>
              Lien envoyé à <strong style={{ color: 'var(--sand)' }}>{email}</strong>
            </p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Cliquez sur le lien dans l&apos;email pour vous connecter. Il est valable 1 heure.
            </p>
            <button onClick={() => setStep("email")} className="text-sm underline" style={{ color: 'var(--muted)' }}>
              Changer d&apos;adresse email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
