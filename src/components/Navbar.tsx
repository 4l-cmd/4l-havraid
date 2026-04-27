"use client";
import { useState, useEffect } from "react";
import { createClient, isAdmin } from "@/lib/supabase";
import AuthModal from "./AuthModal";
import { User } from "@supabase/supabase-js";
import { LogOut, Settings, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAdmin(isAdmin(data.user?.email));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setAdmin(isAdmin(session?.user?.email));
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null); setAdmin(false);
  }

  const navLinks = [
    { href: "/#actualites", label: "Actualités" },
    { href: "/#equipe", label: "Équipage" },
    { href: "/#adopter", label: "Adopter 1 km" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/#suivi", label: "Suivi GPS" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        <Link href="/" className="font-bebas text-2xl tracking-widest" style={{ color: 'var(--accent)', textDecoration: 'none', fontFamily: "'Bebas Neue',sans-serif", letterSpacing: '3px' }}>
          4L HAVRAID
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="text-xs font-normal uppercase tracking-widest transition-colors duration-200"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs" style={{ color: 'var(--green-light)' }}>{user.email}</span>
              {admin && (
                <Link href="/admin" className="flex items-center gap-1 px-4 py-2 rounded text-xs uppercase tracking-wider font-medium"
                  style={{ background: 'var(--accent)', color: 'var(--night)' }}>
                  <Settings size={14} /> Admin
                </Link>
              )}
              <button onClick={logout} className="flex items-center gap-1 px-4 py-2 rounded text-xs uppercase tracking-wider"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.15)', color: 'var(--muted)', cursor: 'pointer' }}>
                <LogOut size={14} /> Déconnexion
              </button>
            </>
          ) : (
            <button onClick={() => setShowAuth(true)}
              className="px-5 py-2 rounded text-xs uppercase tracking-wider font-medium text-white cursor-pointer border-none"
              style={{ background: 'var(--terra)', transition: 'background .2s' }}>
              Mon espace
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-400 cursor-pointer border-none bg-transparent" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[400] pt-20 px-6 flex flex-col gap-4 md:hidden"
          style={{ background: 'rgba(13,17,23,0.98)' }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-lg uppercase tracking-widest py-3 border-b"
              style={{ color: 'var(--text-dim)', textDecoration: 'none', borderColor: 'rgba(255,255,255,.06)' }}>
              {l.label}
            </a>
          ))}
          <div className="pt-4">
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-ghost w-full justify-center">
                <LogOut size={16} /> Déconnexion
              </button>
            ) : (
              <button onClick={() => { setShowAuth(true); setMenuOpen(false); }} className="btn-primary w-full justify-center">
                Mon espace
              </button>
            )}
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={(email, adm) => { setShowAuth(false); }} />}
    </>
  );
}
